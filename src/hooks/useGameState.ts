import { useCallback, useState } from 'react';
import type {
  BoardWinner,
  CellValue,
  GameState,
  GameVariant,
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
  
  // Check for draw (only in classic mode - disappearing mode can't draw)
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
    xMoveOrder: [],
    oMoveOrder: [],
  }));
};

interface UseGameStateOptions {
  variant?: GameVariant;
}

export const useGameState = (options: UseGameStateOptions = {}): GameState & {
  flashingCells: Set<string>;
  getFlashingCellForBoard: (boardIndex: number) => number | null;
} => {
  const { variant = 'classic' } = options;
  
  const [boards, setBoards] = useState<SmallBoardState[]>(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [gameWinner, setGameWinner] = useState<BoardWinner>(null);
  const [gameWinLine, setGameWinLine] = useState<[number, number, number] | null>(null);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [playerNames, setPlayerNames] = useState<PlayerNames>({ X: 'Player X', O: 'Player O' });

  // Get the flashing cell for a specific board (oldest mark that will disappear)
  const getFlashingCellForBoard = useCallback((boardIndex: number): number | null => {
    if (variant !== 'disappearing') return null;
    
    const board = boards[boardIndex];
    if (!board) return null;
    
    const moveOrder = currentPlayer === 'X' ? board.xMoveOrder : board.oMoveOrder;
    
    // If player has 3 marks on this board, the oldest one will flash
    if (moveOrder.length >= 3) {
      return moveOrder[0] ?? null;
    }
    
    return null;
  }, [boards, currentPlayer, variant]);

  // Compute all flashing cells as a Set
  const flashingCells = new Set<string>();
  if (variant === 'disappearing') {
    for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
      const flashingCell = getFlashingCellForBoard(boardIndex);
      if (flashingCell !== null) {
        flashingCells.add(`${boardIndex}-${flashingCell}`);
      }
    }
  }

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
        let newXMoveOrder = [...board.xMoveOrder];
        let newOMoveOrder = [...board.oMoveOrder];
        
        // In disappearing mode, remove oldest mark if player has 3 on this board
        if (variant === 'disappearing') {
          const playerMoveOrder = currentPlayer === 'X' ? newXMoveOrder : newOMoveOrder;
          
          if (playerMoveOrder.length >= 3) {
            // Remove the oldest mark
            const oldestCellIndex = playerMoveOrder[0];
            if (oldestCellIndex !== undefined) {
              newCells[oldestCellIndex] = null;
            }
            // Remove from move order
            if (currentPlayer === 'X') {
              newXMoveOrder = newXMoveOrder.slice(1);
            } else {
              newOMoveOrder = newOMoveOrder.slice(1);
            }
          }
        }
        
        // Place the new mark
        newCells[cellIndex] = currentPlayer;
        
        // Add to move order
        if (currentPlayer === 'X') {
          newXMoveOrder = [...newXMoveOrder, cellIndex];
        } else {
          newOMoveOrder = [...newOMoveOrder, cellIndex];
        }
        
        // Check for winner (may have changed due to disappearing mark)
        const result = checkWinner(newCells);
        
        return {
          cells: newCells,
          winner: result?.winner ?? null,
          winLine: result?.line ?? null,
          xMoveOrder: newXMoveOrder,
          oMoveOrder: newOMoveOrder,
        };
      });

      // Check for game winner
      const gameResult = checkGameWinner(newBoards);
      if (gameResult !== null) {
        setGameWinner(gameResult.winner);
        setGameWinLine(gameResult.line);
      } else {
        // In disappearing mode, game winner might have been removed
        setGameWinner(null);
        setGameWinLine(null);
      }

      // Determine next active board using the NEW boards state
      const targetBoard = newBoards[cellIndex];
      if (targetBoard === undefined || targetBoard.winner !== null || targetBoard.cells.every((c): boolean => c !== null)) {
        // If target board is won or full, player can play anywhere
        setActiveBoard(null);
      } else {
        setActiveBoard(cellIndex);
      }

      return newBoards;
    });

    // Add to move history
    setMoveHistory((prev): Move[] => [...prev, { boardIndex, cellIndex, player: currentPlayer }]);

    // Switch player
    setCurrentPlayer((prev): Player => prev === 'X' ? 'O' : 'X');
    
    return true;
  }, [boards, currentPlayer, gameWinner, canPlayBoard, checkGameWinner, variant]);

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
        
        // Remove from move order
        let newXMoveOrder = [...board.xMoveOrder];
        let newOMoveOrder = [...board.oMoveOrder];
        
        if (lastMove.player === 'X') {
          newXMoveOrder = newXMoveOrder.filter(i => i !== lastMove.cellIndex);
        } else {
          newOMoveOrder = newOMoveOrder.filter(i => i !== lastMove.cellIndex);
        }
        
        // Re-check winner
        const result = checkWinner(newCells);
        
        return {
          cells: newCells,
          winner: result?.winner ?? null,
          winLine: result?.line ?? null,
          xMoveOrder: newXMoveOrder,
          oMoveOrder: newOMoveOrder,
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
    flashingCells,
    getFlashingCellForBoard,
  };
};

export default useGameState;
