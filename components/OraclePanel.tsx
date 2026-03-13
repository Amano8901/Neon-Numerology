import React from 'react';
import { OracleResponse } from '../types';

interface OraclePanelProps {
  oracleData: OracleResponse | null;
  loading: boolean;
}

const OraclePanel: React.FC<OraclePanelProps> = ({ oracleData, loading }) => {
  return (
    <div className="w-full max-w-2xl mt-8 relative">
       {/* Glowing Border Container */}
       <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 rounded-lg blur opacity-75 animate-pulse"></div>
       
       <div className="relative bg-slate-900 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-slate-700">
          
          {/* AI Avatar */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center bg-black rounded-full border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            {loading ? (
                <div className="w-full h-full rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin" />
            ) : (
                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                 System Oracle v2.5
             </h3>
             <p className={`text-lg md:text-xl font-medium leading-relaxed font-sans
                ${loading ? 'animate-pulse text-slate-500' : 'text-slate-100'}
             `}>
                {loading ? "Analyzing probability matrix..." : (oracleData?.message || "Awaiting system initialization. Spin to generate entropy.")}
             </p>
          </div>
       </div>
    </div>
  );
};

export default OraclePanel;
