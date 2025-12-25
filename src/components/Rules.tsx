import { useState, type FC } from 'react';

const Rules: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleToggle = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-2 mx-auto text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">How to Play</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-6 p-4 glass rounded-2xl animate-fade-in max-w-xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-6">
            Ultimate Tic Tac Toe Rules
          </h3>
          
          <div className="flex flex-col gap-3 text-slate-300 text-sm">
            <div className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <p className="leading-relaxed">The game is played on a 3×3 grid of 3×3 boards. Each small board is a game of tic-tac-toe.</p>
            </div>
            
            <div className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <p className="leading-relaxed">Your move determines which board your opponent plays in next. The position of your move in the small board corresponds to the next active board.</p>
            </div>
            
            <div className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <p className="leading-relaxed">Win a small board by getting 3 in a row. If sent to a completed board, you may play anywhere.</p>
            </div>
            
            <div className="flex gap-4">
              <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-500/30 text-indigo-400 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <p className="leading-relaxed">Win the game by winning 3 small boards in a row (horizontally, vertically, or diagonally).</p>
            </div>

            <div className="mt-2 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <p className="text-indigo-300 text-xs leading-relaxed">
                <strong>Tip:</strong> The highlighted board shows where you must play. If all boards are highlighted, you can choose any available board!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;
