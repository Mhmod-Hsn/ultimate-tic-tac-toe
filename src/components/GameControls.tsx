import type { FC } from 'react';
import type { GameControlsProps } from '../types';

const GameControls: FC<GameControlsProps> = ({ onReset, onUndo, canUndo, gameWinner }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`
          flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium
          transition-all duration-300
          ${canUndo 
            ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white' 
            : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
          }
        `}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
        Undo
      </button>

      <button
        onClick={onReset}
        className="btn-primary flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {gameWinner !== null ? 'Play Again' : 'New Game'}
      </button>
    </div>
  );
};

export default GameControls;
