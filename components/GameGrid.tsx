import React from 'react';
import { Grid, RowResult } from '../types';
import NumberCell from './NumberCell';
import { WIN_DESCRIPTIONS } from '../constants';

interface GameGridProps {
  grid: Grid;
  winningRows: RowResult[];
}

const GameGrid: React.FC<GameGridProps> = ({ grid, winningRows }) => {
  const getRowWin = (rowIndex: number) => winningRows.find(w => w.rowIndex === rowIndex);

  return (
    <div className="flex flex-col gap-4 p-6 bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decor: Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-500 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-500 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-lg" />

      {grid.map((row, rIndex) => {
        const win = getRowWin(rIndex);
        return (
          <div key={`row-${rIndex}`} className="flex items-center gap-2 sm:gap-4 group relative">
            
            {/* Row Number Indicator */}
            <div className={`
                w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                transition-colors duration-500
                ${win ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-500 group-hover:bg-slate-700'}
            `}>
                {rIndex + 1}
            </div>

            <div className={`
                flex gap-2 sm:gap-4 p-2 rounded-xl transition-colors duration-300
                ${win ? 'bg-yellow-500/10' : ''}
            `}>
                {row.map((cell, cIndex) => (
                <NumberCell 
                    key={cell.id} 
                    value={cell.value} 
                    isSpinning={cell.isSpinning}
                    isMatch={cell.isMatch}
                    delay={cIndex * 100}
                />
                ))}
            </div>

            {/* Win Label */}
            <div className={`
                absolute -right-4 sm:right-0 translate-x-full sm:translate-x-full 
                whitespace-nowrap px-3 py-1 rounded bg-slate-900 border border-yellow-500/50 text-yellow-400 text-xs sm:text-sm font-bold tracking-widest uppercase
                transition-all duration-500
                ${win ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
            `}>
                {win ? `+${win.payout} // ${WIN_DESCRIPTIONS[win.winType]}` : ''}
            </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default GameGrid;
