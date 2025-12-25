import type { FC } from 'react';
import type { PlayerIndicatorProps } from '../types';

const PlayerIndicator: FC<PlayerIndicatorProps> = ({ currentPlayer, playerNames }) => {
  return (
    <div className="flex items-center justify-center gap-12">
      <div 
        className={`
          flex items-center gap-4 px-4 py-3 rounded-2xl 
          transition-all duration-300
          ${currentPlayer === 'X' 
            ? 'bg-rose-500/20 ring-2 ring-rose-500 scale-105' 
            : 'bg-slate-700/30 opacity-60'
          }
        `}
      >
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <line x1="20" y1="20" x2="80" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
        </svg>
        <span className={`font-semibold ${currentPlayer === 'X' ? 'text-rose-400' : 'text-slate-400'}`}>
          {playerNames.X}
        </span>
      </div>

      <div className="text-slate-500 font-bold text-lg px-3">VS</div>

      <div 
        className={`
          flex items-center gap-4 px-4 py-3 rounded-2xl 
          transition-all duration-300
          ${currentPlayer === 'O' 
            ? 'bg-blue-500/20 ring-2 ring-blue-500 scale-105' 
            : 'bg-slate-700/30 opacity-60'
          }
        `}
      >
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <circle cx="50" cy="50" r="35" stroke="#3b82f6" strokeWidth="12" fill="none" />
        </svg>
        <span className={`font-semibold ${currentPlayer === 'O' ? 'text-blue-400' : 'text-slate-400'}`}>
          {playerNames.O}
        </span>
      </div>
    </div>
  );
};

export default PlayerIndicator;
