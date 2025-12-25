import type { FC } from 'react';
import {
    GameBoard,
    GameControls,
    Header,
    Particles,
    PlayerIndicator,
    Rules
} from './components';
import { useGameState } from './hooks/useGameState';

const App: FC = () => {
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

  const handleCellClick = (boardIndex: number, cellIndex: number): void => {
    makeMove(boardIndex, cellIndex);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <Particles />
      
      <div className="relative z-10 w-full max-w-2xl space-y-8">
        <Header />

        <PlayerIndicator 
          currentPlayer={currentPlayer} 
          playerNames={playerNames} 
        />

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
          onUndo={undoMove}
          canUndo={moveHistory.length > 0 && gameWinner === null}
          gameWinner={gameWinner}
        />

        <Rules />

        <footer className="text-center text-slate-500 text-sm">
          <p>Play with a friend on the same device</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
