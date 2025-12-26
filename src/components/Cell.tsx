import type { FC, ReactElement } from 'react';
import type { CellProps } from '../types';

const Cell: FC<CellProps> = ({ value, onClick, isPlayable, isFlashing }) => {
  const getSymbol = (): ReactElement | null => {
    if (value === 'X') {
      return (
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full p-1 ${isFlashing ? 'animate-flash' : ''}`}
        >
          <line 
            x1="20" y1="20" x2="80" y2="80" 
            stroke="#f43f5e" 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cell-pop"
          />
          <line 
            x1="80" y1="20" x2="20" y2="80" 
            stroke="#f43f5e" 
            strokeWidth="12" 
            strokeLinecap="round"
            className="cell-pop"
          />
        </svg>
      );
    }
    if (value === 'O') {
      return (
        <svg 
          viewBox="0 0 100 100" 
          className={`w-full h-full p-1 ${isFlashing ? 'animate-flash' : ''}`}
        >
          <circle 
            cx="50" cy="50" r="35" 
            stroke="#3b82f6" 
            strokeWidth="12" 
            fill="none"
            className="cell-pop"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      disabled={!isPlayable || value !== null}
      className={`
        aspect-square w-full
        flex items-center justify-center
        transition-all duration-200
        ${value === null && isPlayable 
          ? 'hover:bg-slate-600/50 cursor-pointer' 
          : 'cursor-default'
        }
        ${value === null && isPlayable 
          ? 'hover:scale-105' 
          : ''
        }
        ${isFlashing ? 'bg-red-500/20' : ''}
      `}
    >
      {getSymbol()}
    </button>
  );
};

export default Cell;
