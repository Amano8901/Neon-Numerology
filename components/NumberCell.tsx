import React from 'react';

interface NumberCellProps {
  value: number;
  isSpinning: boolean;
  isMatch: boolean;
  delay: number;
}

const NumberCell: React.FC<NumberCellProps> = ({ value, isSpinning, isMatch, delay }) => {
  // Determine color based on number value for visual variety
  const getNumColor = (num: number) => {
    if (num === 7) return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'; // Lucky 7
    if (num % 2 === 0) return 'text-cyan-400'; // Even
    return 'text-pink-500'; // Odd
  };

  return (
    <div 
      className={`
        relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-32 
        flex items-center justify-center 
        bg-slate-900 border-2 rounded-lg
        transition-all duration-300
        ${isMatch ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-105 z-10' : 'border-slate-700 shadow-inner'}
        overflow-hidden
      `}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />

      <div className={`
        text-4xl sm:text-5xl md:text-6xl font-black digit
        ${isSpinning ? 'animate-pulse blur-sm scale-90' : 'scale-100'}
        ${getNumColor(value)}
        transition-all duration-100
      `}>
        {isSpinning ? (
          <span className="inline-block animate-bounce opacity-50">?</span>
        ) : (
           value
        )}
      </div>
      
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-0 hover:opacity-20 pointer-events-none transition-opacity" />
    </div>
  );
};

export default NumberCell;
