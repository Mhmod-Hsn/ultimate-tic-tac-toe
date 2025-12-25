import type { FC } from 'react';
import type { GameBoardProps } from '../types';
import SmallBoard from './SmallBoard';

const GameBoard: FC<GameBoardProps> = ({ 
  boards, 
  activeBoard, 
  canPlayBoard, 
  onCellClick, 
  gameWinner 
}) => {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 sm:gap-5 p-2 sm:p-6 glass rounded-2xl">
        {boards.map((board, boardIndex) => (
          <SmallBoard
            key={boardIndex}
            board={board}
            boardIndex={boardIndex}
            isActive={activeBoard === null || activeBoard === boardIndex}
            isPlayable={canPlayBoard(boardIndex)}
            onCellClick={onCellClick}
          />
        ))}
      </div>

      {/* Game winner overlay */}
      {gameWinner !== null && gameWinner !== 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl animate-fade-in">
          <div className="text-center">
            <div className="mb-4">
              {gameWinner === 'X' ? (
                <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]">
                  <line x1="20" y1="20" x2="80" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
                  <line x1="80" y1="20" x2="20" y2="80" stroke="#f43f5e" strokeWidth="12" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]">
                  <circle cx="50" cy="50" r="35" stroke="#3b82f6" strokeWidth="12" fill="none" />
                </svg>
              )}
            </div>
            <h2 className={`text-3xl font-bold ${gameWinner === 'X' ? 'text-rose-500 neon-x' : 'text-blue-500 neon-o'}`}>
              Wins!
            </h2>
          </div>
        </div>
      )}

      {/* Draw overlay */}
      {gameWinner === 'draw' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 rounded-2xl animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-400 mb-2">It's a Draw!</h2>
            <p className="text-slate-500">No winner this time</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
