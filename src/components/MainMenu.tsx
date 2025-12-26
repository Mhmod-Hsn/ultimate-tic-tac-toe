import type { FC } from 'react';
import { useState } from 'react';
import type { Difficulty, GameMode, GameVariant } from '../types';

interface MainMenuProps {
  onStartGame: (mode: GameMode, difficulty?: Difficulty, variant?: GameVariant) => void;
}

const MainMenu: FC<MainMenuProps> = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState<'multiplayer' | 'computer' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [variant, setVariant] = useState<GameVariant>('classic');
  const [showVariantSelect, setShowVariantSelect] = useState(false);

  const handleModeSelect = (mode: 'multiplayer' | 'computer'): void => {
    setSelectedMode(mode);
    setShowVariantSelect(true);
  };

  const handleStartGame = (): void => {
    if (selectedMode === 'multiplayer') {
      onStartGame('multiplayer', undefined, variant);
    } else {
      onStartGame('computer', difficulty, variant);
    }
  };

  const handleBack = (): void => {
    if (selectedMode === 'computer' && showVariantSelect) {
      setShowVariantSelect(false);
    } else {
      setSelectedMode(null);
      setShowVariantSelect(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-rose-500/20 to-blue-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* Game Title */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
            Ultimate
          </h1>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Tic Tac Toe
          </h2>
          <p className="text-slate-400 text-lg">
            The strategic multiplayer challenge
          </p>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="space-y-4">
            {/* Multiplayer Button */}
            <button
              onClick={() => handleModeSelect('multiplayer')}
              className="w-full py-5 px-6 glass rounded-2xl text-white font-semibold text-xl
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                         hover:shadow-purple-500/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-purple-500/10 
                              opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Play with Friend</span>
              </div>
              <p className="text-slate-400 text-sm mt-2 relative">Two players on the same device</p>
            </button>

            {/* Computer Button */}
            <button
              onClick={() => handleModeSelect('computer')}
              className="w-full py-5 px-6 glass rounded-2xl text-white font-semibold text-xl
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                         hover:shadow-blue-500/20 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 
                              opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Play vs Computer</span>
              </div>
              <p className="text-slate-400 text-sm mt-2 relative">Challenge the AI opponent</p>
            </button>
          </div>
        )}

        {/* Variant & Settings Selection */}
        {selectedMode && (
          <div className="glass rounded-2xl p-6 space-y-6 animate-fade-in">
            {/* Mode indicator */}
            <div className="text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700/50 text-sm">
                {selectedMode === 'computer' ? (
                  <>
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-300">vs Computer</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-slate-300">Multiplayer</span>
                  </>
                )}
              </span>
            </div>

            {/* Game Variant Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white text-center">Choose Game Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setVariant('classic')}
                  className={`py-4 px-4 rounded-xl font-medium transition-all duration-200 text-left
                              ${variant === 'classic' 
                                ? 'bg-indigo-500/30 text-indigo-400 ring-2 ring-indigo-500/50' 
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
                >
                  <div className="font-semibold">Classic</div>
                  <div className="text-xs mt-1 opacity-70">Standard rules</div>
                </button>
                <button
                  onClick={() => setVariant('disappearing')}
                  className={`py-4 px-4 rounded-xl font-medium transition-all duration-200 text-left
                              ${variant === 'disappearing' 
                                ? 'bg-orange-500/30 text-orange-400 ring-2 ring-orange-500/50' 
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
                >
                  <div className="font-semibold">Disappearing</div>
                  <div className="text-xs mt-1 opacity-70">3 marks max per board</div>
                </button>
              </div>
              <div className="text-center text-slate-400 text-sm">
                {variant === 'classic' && "📋 Traditional Ultimate Tic Tac Toe"}
                {variant === 'disappearing' && "✨ Oldest marks vanish after your 4th move!"}
              </div>
            </div>

            {/* Difficulty Selection (only for computer mode) */}
            {selectedMode === 'computer' && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white text-center">AI Difficulty</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200
                                ${difficulty === 'easy' 
                                  ? 'bg-green-500/30 text-green-400 ring-2 ring-green-500/50' 
                                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200
                                ${difficulty === 'medium' 
                                  ? 'bg-yellow-500/30 text-yellow-400 ring-2 ring-yellow-500/50' 
                                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-200
                                ${difficulty === 'hard' 
                                  ? 'bg-red-500/30 text-red-400 ring-2 ring-red-500/50' 
                                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'}`}
                  >
                    Hard
                  </button>
                </div>
                <div className="text-center text-slate-400 text-sm">
                  {difficulty === 'easy' && "🎮 Random moves - great for beginners"}
                  {difficulty === 'medium' && "🧠 Smart but beatable - a fair challenge"}
                  {difficulty === 'hard' && "🔥 Full AI power - can you beat it?"}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-700/50 text-slate-300 
                           font-medium transition-all duration-200 hover:bg-slate-600/50"
              >
                Back
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                           text-white font-semibold transition-all duration-200 
                           hover:from-indigo-600 hover:to-purple-600 hover:scale-[1.02]"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm space-y-2 pt-8">
          <p>
            Made with ❤️ by{' '}
            <a 
              href="https://mhmodhsn.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Mahmoud Hassan
            </a>
            {' • '}
            <a 
              href="https://github.com/Mhmod-Hsn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MainMenu;
