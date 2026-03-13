import React, { useState, useCallback, useEffect } from 'react';
import GameGrid from './components/GameGrid';
import OraclePanel from './components/OraclePanel';
import { createInitialGrid, generateRandomNumber, calculateResults } from './services/gameLogic';
import { consultOracle } from './services/oracleService';
import { Grid, GameState, WinType, RowResult, OracleResponse } from './types';
import { INITIAL_CREDITS, MIN_BET, MAX_BET, BET_STEP, ANIMATION_DURATION_MS } from './constants';

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    grid: createInitialGrid(),
    isSpinning: false,
    credits: INITIAL_CREDITS,
    betPerLine: 10, // Betting 10 per row => Total bet 50
    lastWinAmount: 0,
    winningRows: [],
    history: []
  });

  const [oracleState, setOracleState] = useState<{data: OracleResponse | null, loading: boolean}>({
    data: null,
    loading: false
  });

  // --- Actions ---

  const handleBetChange = (delta: number) => {
    if (gameState.isSpinning) return;
    setGameState(prev => {
      const newBet = Math.max(MIN_BET, Math.min(MAX_BET, prev.betPerLine + delta));
      return { ...prev, betPerLine: newBet };
    });
  };

  const handleSpin = useCallback(() => {
    const totalBet = gameState.betPerLine * 5; // 5 Rows
    if (gameState.credits < totalBet) {
      alert("Insufficient credits! Reloading wallet..."); // Simple fallback
      setGameState(prev => ({ ...prev, credits: prev.credits + 500 }));
      return;
    }

    // 1. Deduct Bet & Start Spin State
    setGameState(prev => ({
      ...prev,
      credits: prev.credits - totalBet,
      isSpinning: true,
      winningRows: [], // Clear previous wins
      lastWinAmount: 0,
      grid: prev.grid.map(row => row.map(cell => ({ ...cell, isSpinning: true, isMatch: false })))
    }));

    setOracleState(prev => ({ ...prev, loading: true }));

    // 2. Animate and Reveal
    // We simulate a rolling reveal. Each row stops slightly after the other.
    const newValues: number[][] = Array.from({ length: 5 }, () => 
      Array.from({ length: 3 }, () => generateRandomNumber())
    );

    // Timeout to finish spinning
    setTimeout(async () => {
        // Construct the final grid
        const finalGrid: Grid = gameState.grid.map((row, rIndex) => 
            row.map((cell, cIndex) => ({
                ...cell,
                value: newValues[rIndex][cIndex],
                isSpinning: false, // Stop spinning
                isMatch: false // Will update next
            }))
        );

        // Calculate logic
        const { results, totalWin } = calculateResults(finalGrid, gameState.betPerLine);

        // Mark winning cells
        results.forEach(res => {
            res.winningIndices.forEach(colIdx => {
                finalGrid[res.rowIndex][colIdx].isMatch = true;
            });
        });

        // Update Game State
        setGameState(prev => ({
            ...prev,
            grid: finalGrid,
            isSpinning: false,
            credits: prev.credits + totalWin,
            lastWinAmount: totalWin,
            winningRows: results,
            history: totalWin > 0 ? [`Won ${totalWin} on spin!`, ...prev.history.slice(0, 4)] : prev.history
        }));

        // Call Oracle
        const oracleResp = await consultOracle(finalGrid, results, totalWin);
        setOracleState({ data: oracleResp, loading: false });

    }, ANIMATION_DURATION_MS);

  }, [gameState.betPerLine, gameState.credits, gameState.grid]);


  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text-glow">
            NEON<br/>NUMEROLOGY
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-mono tracking-widest uppercase">
            Quantized Probability Engine
            </p>
        </div>
        <div className="text-right">
             <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Credits</div>
             <div className="text-3xl md:text-4xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                 {gameState.credits.toLocaleString()}
             </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex flex-col items-center gap-8 w-full max-w-4xl">
        
        <GameGrid grid={gameState.grid} winningRows={gameState.winningRows} />
        
        {/* Controls */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
            
            {/* Bet Control */}
            <div className="flex flex-col justify-center items-center md:items-start gap-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Bet Per Row</label>
                <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-lg border border-slate-700">
                    <button 
                        onClick={() => handleBetChange(-BET_STEP)}
                        disabled={gameState.isSpinning || gameState.betPerLine <= MIN_BET}
                        className="w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 font-bold text-xl transition-colors"
                    >-</button>
                    <span className="w-12 text-center font-mono text-xl">{gameState.betPerLine}</span>
                    <button 
                         onClick={() => handleBetChange(BET_STEP)}
                         disabled={gameState.isSpinning || gameState.betPerLine >= MAX_BET}
                         className="w-10 h-10 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 font-bold text-xl transition-colors"
                    >+</button>
                </div>
                <div className="text-xs text-slate-500 font-mono">Total Bet: {gameState.betPerLine * 5}</div>
            </div>

            {/* Spin Button */}
            <div className="flex items-center justify-center">
                <button
                    onClick={handleSpin}
                    disabled={gameState.isSpinning}
                    className={`
                        w-full md:w-48 h-16 rounded-full font-black text-2xl tracking-widest uppercase
                        transition-all duration-200 transform active:scale-95
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${gameState.isSpinning 
                            ? 'bg-slate-800 text-slate-500 shadow-none border-none'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(219,39,119,0.5)] hover:shadow-[0_0_50px_rgba(219,39,119,0.8)] border border-pink-400/30'
                        }
                    `}
                >
                    {gameState.isSpinning ? 'Running...' : 'SPIN'}
                </button>
            </div>

            {/* Last Win Info */}
            <div className="flex flex-col justify-center items-center md:items-end gap-1">
                 <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Last Result</label>
                 <div className={`text-3xl font-mono font-bold transition-all duration-300 ${gameState.lastWinAmount > 0 ? 'text-yellow-400 scale-110' : 'text-slate-600'}`}>
                     {gameState.lastWinAmount > 0 ? `+${gameState.lastWinAmount}` : '--'}
                 </div>
                 {gameState.winningRows.length > 0 && (
                     <div className="text-xs text-yellow-500/80 animate-pulse">
                         {gameState.winningRows.length} Winning Rows
                     </div>
                 )}
            </div>

        </div>

        <OraclePanel oracleData={oracleState.data} loading={oracleState.loading} />

      </main>

      {/* Pay Table Hint */}
      <footer className="mt-12 text-center text-slate-600 text-xs max-w-2xl">
        <h4 className="uppercase tracking-widest font-bold mb-2 text-slate-500">Winning Combinations</h4>
        <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800"><span className="text-yellow-500">7-7-7</span> (Jackpot)</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800"><span className="text-cyan-400">X-X-X</span> (Match 3)</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800"><span className="text-pink-400">1-2-3</span> (Straight)</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">Sum 21</span>
            <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">Any Pair</span>
        </div>
      </footer>

    </div>
  );
};

export default App;
