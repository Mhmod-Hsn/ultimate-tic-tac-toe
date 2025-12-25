import { useCallback, useState } from 'react';
import type {
    BoardWinner,
    CellValue,
    GameState,
    Move,
    Player,
    PlayerNames,
    SmallBoardState,
    WinResult
} from '../types';

// Check if there's a winner in a 3x3 grid
const checkWinner = (cells: CellValue[]): WinResult | null => {
  const lines: [number, number, number][] = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];
    if (cellA !== null && cellA !== undefined && cellA === cellB && cellA === cellC) {
      return { winner: cellA, line: [a, b, c] };
    }
  }
  
  // Check for draw
  if (cells.every((cell): cell is Player => cell !== null)) {
    return { winner: 'draw', line: null };
  }
  
  return null;
};

// Create initial board state
const createInitialBoard = (): SmallBoardState[] => {
  return Array.from({ length: 9 }, (): SmallBoardState => ({
    cells: Array<CellValue>(9).fill(null),
    winner: null,
    winLine: null,
  }));
};

export const useGameState = (): GameState => {
  const [boards, setBoards] = useState<SmallBoardState[]>(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [gameWinner, setGameWinner] = useState<BoardWinner>(null);
  const [gameWinLine, setGameWinLine] = useState<[number, number, number] | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [playerNames, setPlayerNames] = useState<PlayerNames>({ X: 'Player X', O: 'Player O' });

  // Check if a board can be played
  const canPlayBoard = useCallback((boardIndex: number): boolean => {
    if (gameWinner !== null) return false;
    const board = boards[boardIndex];
    if (board === undefined || board.winner !== null) return false;
    if (activeBoard === null) return true;
    return activeBoard === boardIndex;
  }, [activeBoard, boards, gameWinner]);

  // Check if the overall game has a winner
  const checkGameWinner = useCallback((updatedBoards: SmallBoardState[]): WinResult | null => {
    const boardWinners: CellValue[] = updatedBoards.map(
      (b): CellValue => b.winner === 'draw' ? null : b.winner
    );
    return checkWinner(boardWinners);
  }, []);

  // Make a move
  const makeMove = useCallback((boardIndex: number, cellIndex: number): boolean => {
    if (gameWinner !== null) return false;
    if (!canPlayBoard(boardIndex)) return false;
    
    const currentBoard = boards[boardIndex];
    if (currentBoard === undefined) return false;
    
    const currentCell = currentBoard.cells[cellIndex];
    if (currentCell !== null) return false;

    setBoards((prevBoards): SmallBoardState[] => {
      const newBoards = prevBoards.map((board, idx): SmallBoardState => {
        if (idx !== boardIndex) return board;
        
        const newCells = [...board.cells];
        newCells[cellIndex] = currentPlayer;
        
        const result = checkWinner(newCells);
        
        return {
          cells: newCells,
          winner: result?.winner ?? null,
          winLine: result?.line ?? null,
        };
      });

      // Check for game winner
      const gameResult = checkGameWinner(newBoards);
      if (gameResult !== null) {
        setGameWinner(gameResult.winner);
        setGameWinLine(gameResult.line);
      }

      return newBoards;
    });

    // Add to move history
    setMoveHistory((prev): Move[] => [...prev, { boardIndex, cellIndex, player: currentPlayer }]);

    // Determine next active board
    const targetBoard = boards[cellIndex];
    if (targetBoard === undefined || targetBoard.winner !== null || targetBoard.cells.every((c): boolean => c !== null)) {
      // If target board is won or full, player can play anywhere
      setActiveBoard(null);
    } else {
      setActiveBoard(cellIndex);
    }

    // Switch player
    setCurrentPlayer((prev): Player => prev === 'X' ? 'O' : 'X');
    
    return true;
  }, [boards, currentPlayer, gameWinner, canPlayBoard, checkGameWinner]);

  // Reset the game
  const resetGame = useCallback((): void => {
    setBoards(createInitialBoard);
    setCurrentPlayer('X');
    setActiveBoard(null);
    setGameWinner(null);
    setGameWinLine(null);
    setMoveHistory([]);
  }, []);

  // Undo last move
  const undoMove = useCallback((): void => {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory[moveHistory.length - 1];
    if (lastMove === undefined) return;
    
    setBoards((prevBoards): SmallBoardState[] => {
      return prevBoards.map((board, idx): SmallBoardState => {
        if (idx !== lastMove.boardIndex) return board;
        
        const newCells = [...board.cells];
        newCells[lastMove.cellIndex] = null;
        
        return {
          cells: newCells,
          winner: null,
          winLine: null,
        };
      });
    });

    setCurrentPlayer(lastMove.player);
    setGameWinner(null);
    setGameWinLine(null);
    
    // Determine previous active board
    if (moveHistory.length > 1) {
      const previousMove = moveHistory[moveHistory.length - 2];
      if (previousMove !== undefined) {
        setActiveBoard(previousMove.cellIndex);
      }
    } else {
      setActiveBoard(null);
    }

    setMoveHistory((prev): Move[] => prev.slice(0, -1));
  }, [moveHistory]);

  return {
    boards,
    currentPlayer,
    activeBoard,
    gameWinner,
    gameWinLine,
    playerNames,
    setPlayerNames,
    canPlayBoard,
    makeMove,
    resetGame,
    undoMove,
    moveHistory,
  };
};

export default useGameState;
