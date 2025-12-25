import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
    GameBoard,
    GameControls,
    Header,
    MainMenu,
    Particles,
    PlayerIndicator,
    Rules
} from './components';
import { useComputerAI } from './hooks/useComputerAI';
import { useGameState } from './hooks/useGameState';
import type { Difficulty, GameMode } from './types';

const App: FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiThinkingRef = useRef(false);

  const {
    boards,
    currentPlayer,
    activeBoard,
    gameWinner,
    gameWinLine,
    playerNames,
    canPlayBoard,
    makeMove,
    resetGame,
    undoMove,
    moveHistory,
  } = useGameState();

  const { computeMove } = useComputerAI();

  // Handle AI moves when it's computer's turn
  useEffect(() => {
    if (gameMode !== 'computer') return;
    if (currentPlayer !== 'O') return;
    if (gameWinner !== null) return;
    if (aiThinkingRef.current) return;

    aiThinkingRef.current = true;
    setIsAIThinking(true);

    // Add a small delay to make AI moves feel more natural
    const timeoutId = setTimeout(() => {
      const aiMove = computeMove(boards, activeBoard, difficulty);
      if (aiMove) {
        makeMove(aiMove.boardIndex, aiMove.cellIndex);
      }
      aiThinkingRef.current = false;
      setIsAIThinking(false);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      aiThinkingRef.current = false;
      setIsAIThinking(false);
    };
  }, [gameMode, currentPlayer, gameWinner, boards, activeBoard, difficulty, computeMove, makeMove]);

  const handleStartGame = (mode: GameMode, selectedDifficulty?: Difficulty): void => {
    setGameMode(mode);
    if (selectedDifficulty) {
      setDifficulty(selectedDifficulty);
    }
    resetGame();
  };

  const handleBackToMenu = (): void => {
    setGameMode('menu');
    resetGame();
  };

  const handleCellClick = (boardIndex: number, cellIndex: number): void => {
    // Prevent player from clicking during AI's turn
    if (gameMode === 'computer' && currentPlayer === 'O') return;
    if (isAIThinking) return;
    
    makeMove(boardIndex, cellIndex);
  };

  const handleUndo = (): void => {
    if (gameMode === 'computer') {
      // In computer mode, undo both player and AI moves
      undoMove(); // Undo AI move
      undoMove(); // Undo player move
    } else {
      undoMove();
    }
  };

  // Show main menu
  if (gameMode === 'menu') {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  // Get display name for current player
  const getPlayerIndicatorNames = () => {
    if (gameMode === 'computer') {
      return { X: 'You', O: 'Computer' };
    }
    return playerNames;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <Particles />
      
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <Header />

        {/* Mode indicator */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm">
            {gameMode === 'computer' ? (
              <>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-300">
                  vs Computer ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
                </span>
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

        <PlayerIndicator 
          currentPlayer={currentPlayer} 
          playerNames={getPlayerIndicatorNames()} 
        />

        {/* AI thinking indicator - fixed height to prevent layout shift */}
        <div className="h-10 flex items-center justify-center">
          <span 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 transition-opacity duration-200
                        ${isAIThinking && gameMode === 'computer' ? 'opacity-100' : 'opacity-0'}`}
          >
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Computer is thinking...
          </span>
        </div>

        <GameBoard
          boards={boards}
          activeBoard={activeBoard}
          canPlayBoard={canPlayBoard}
          onCellClick={handleCellClick}
          gameWinner={gameWinner}
          gameWinLine={gameWinLine}
        />

        <GameControls
          onReset={resetGame}
          onUndo={handleUndo}
          canUndo={moveHistory.length > 0 && gameWinner === null && !isAIThinking}
          gameWinner={gameWinner}
        />

        {/* Back to Menu button */}
        <div className="text-center">
          <button
            onClick={handleBackToMenu}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl glass text-slate-300 
                       hover:text-white transition-all duration-200 hover:bg-slate-700/50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Menu
          </button>
        </div>

        <Rules />

        <footer className="text-center text-slate-500 text-sm space-y-2">
          <p>
            {gameMode === 'computer' 
              ? 'Challenge the AI opponent' 
              : 'Play with a friend on the same device'}
          </p>
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

export default App;
