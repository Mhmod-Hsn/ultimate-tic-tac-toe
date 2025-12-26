import type { FC, ReactElement } from 'react';
import type { SmallBoardProps } from '../types';
import Cell from './Cell';

const SmallBoard: FC<SmallBoardProps> = ({ 
  board, 
  boardIndex, 
  isActive, 
  isPlayable, 
  onCellClick,
  flashingCells
}) => {
  const { cells, winner } = board;

  const getWinnerOverlay = (): ReactElement | null => {
    if (winner === null || winner === 'draw') return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl animate-fade-in">
        {winner === 'X' ? (
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">
            <line x1="20" y1="20" x2="80" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
            <circle cx="50" cy="50" r="35" stroke="#3b82f6" strokeWidth="12" fill="none" />
          </svg>
        )}
      </div>
    );
  };

  const getDrawOverlay = (): ReactElement | null => {
    if (winner !== 'draw') return null;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-xl animate-fade-in">
        <span className="text-slate-400 text-2xl font-bold">Draw</span>
      </div>
    );
  };

  return (
    <div 
      className={`
        relative
        grid grid-cols-3 gap-1 sm:gap-1.5
        p-2 sm:p-3 rounded-xl
        transition-all duration-300
        ${isActive && winner === null 
          ? 'ring-2 ring-indigo-500 active-board bg-slate-700/30' 
          : 'bg-slate-800/50'
        }
        ${!isPlayable && winner === null 
          ? 'opacity-50' 
          : ''
        }
      `}
    >
      {cells.map((cell, cellIndex) => {
        const isFlashing = flashingCells?.has(`${boardIndex}-${cellIndex}`) ?? false;
        
        return (
          <div
            key={cellIndex}
            className={`
              bg-slate-700/50 rounded-md
              ${cellIndex % 3 !== 2 ? 'border-r border-slate-600/50' : ''}
              ${cellIndex < 6 ? 'border-b border-slate-600/50' : ''}
            `}
          >
            <Cell
              value={cell}
              onClick={() => onCellClick(boardIndex, cellIndex)}
              isPlayable={isPlayable && winner === null}
              index={cellIndex}
              isFlashing={isFlashing}
            />
          </div>
        );
      })}
      
      {getWinnerOverlay()}
      {getDrawOverlay()}
    </div>
  );
};

export default SmallBoard;
