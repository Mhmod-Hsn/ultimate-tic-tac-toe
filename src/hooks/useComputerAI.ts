import { useCallback } from 'react';
import type { CellValue, Difficulty, GameVariant, Player, SmallBoardState } from '../types';

interface AIMove {
  boardIndex: number;
  cellIndex: number;
}

// Check if there's a winner in a 3x3 grid
const checkWinner = (cells: CellValue[]): Player | 'draw' | null => {
  const lines: [number, number, number][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];

  for (const [a, b, c] of lines) {
    const cellA = cells[a];
    const cellB = cells[b];
    const cellC = cells[c];
    if (cellA !== null && cellA !== undefined && cellA === cellB && cellA === cellC) {
      return cellA;
    }
  }

  if (cells.every((cell): cell is Player => cell !== null)) {
    return 'draw';
  }

  return null;
};

// Get all valid moves given current state
const getValidMoves = (
  boards: SmallBoardState[],
  activeBoard: number | null
): AIMove[] => {
  const moves: AIMove[] = [];

  const boardsToCheck = activeBoard !== null ? [activeBoard] : boards.map((_, i) => i);

  for (const boardIndex of boardsToCheck) {
    const board = boards[boardIndex];
    if (!board || board.winner !== null) continue;

    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      if (board.cells[cellIndex] === null) {
        moves.push({ boardIndex, cellIndex });
      }
    }
  }

  return moves;
};

// Simulate making a move and return new board state
const simulateMove = (
  boards: SmallBoardState[],
  boardIndex: number,
  cellIndex: number,
  player: Player,
  variant: GameVariant = 'classic'
): SmallBoardState[] => {
  return boards.map((board, idx) => {
    if (idx !== boardIndex) return board;

    const newCells = [...board.cells];
    let newXMoveOrder = [...board.xMoveOrder];
    let newOMoveOrder = [...board.oMoveOrder];

    // In disappearing mode, remove oldest mark if player has 3 on this board
    if (variant === 'disappearing') {
      const playerMoveOrder = player === 'X' ? newXMoveOrder : newOMoveOrder;
      
      if (playerMoveOrder.length >= 3) {
        const oldestCellIndex = playerMoveOrder[0];
        if (oldestCellIndex !== undefined) {
          newCells[oldestCellIndex] = null;
        }
        if (player === 'X') {
          newXMoveOrder = newXMoveOrder.slice(1);
        } else {
          newOMoveOrder = newOMoveOrder.slice(1);
        }
      }
    }

    newCells[cellIndex] = player;

    // Update move order
    if (player === 'X') {
      newXMoveOrder = [...newXMoveOrder, cellIndex];
    } else {
      newOMoveOrder = [...newOMoveOrder, cellIndex];
    }

    const winner = checkWinner(newCells);

    return {
      cells: newCells,
      winner: winner,
      winLine: null,
      xMoveOrder: newXMoveOrder,
      oMoveOrder: newOMoveOrder,
    };
  });
};

// Get the next active board after a move
const getNextActiveBoard = (
  boards: SmallBoardState[],
  cellIndex: number
): number | null => {
  const targetBoard = boards[cellIndex];
  if (!targetBoard || targetBoard.winner !== null || 
      targetBoard.cells.every(c => c !== null)) {
    return null; // Can play anywhere
  }
  return cellIndex;
};

// Evaluate the overall game position
const evaluateGameState = (boards: SmallBoardState[]): Player | 'draw' | null => {
  const boardWinners = boards.map(b => b.winner === 'draw' ? null : b.winner);
  return checkWinner(boardWinners);
};

// Heuristic evaluation for a position (positive = good for O, negative = good for X)
const evaluatePosition = (boards: SmallBoardState[], variant: GameVariant = 'classic'): number => {
  const gameResult = evaluateGameState(boards);
  
  if (gameResult === 'O') return 10000;
  if (gameResult === 'X') return -10000;
  if (gameResult === 'draw') return 0;

  let score = 0;

  // Count board wins
  for (const board of boards) {
    if (board.winner === 'O') score += 100;
    else if (board.winner === 'X') score -= 100;
  }

  // In disappearing mode, having more marks is valuable (potential for future wins)
  if (variant === 'disappearing') {
    for (const board of boards) {
      score += board.oMoveOrder.length * 5;
      score -= board.xMoveOrder.length * 5;
    }
  }

  // Evaluate lines in the meta-game
  const lines: [number, number, number][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    const winners = [boards[a]?.winner, boards[b]?.winner, boards[c]?.winner];
    const oCount = winners.filter(w => w === 'O').length;
    const xCount = winners.filter(w => w === 'X').length;
    const openCount = winners.filter(w => w === null).length;

    // Two in a row with one open = strong position
    if (oCount === 2 && openCount === 1) score += 50;
    if (xCount === 2 && openCount === 1) score -= 50;

    // One with two open = weak potential
    if (oCount === 1 && openCount === 2) score += 10;
    if (xCount === 1 && openCount === 2) score -= 10;
  }

  // Center board bonus
  if (boards[4]?.winner === 'O') score += 30;
  if (boards[4]?.winner === 'X') score -= 30;

  // Corner boards bonus
  const corners = [0, 2, 6, 8];
  for (const corner of corners) {
    if (boards[corner]?.winner === 'O') score += 15;
    if (boards[corner]?.winner === 'X') score -= 15;
  }

  return score;
};

// Minimax with alpha-beta pruning
const minimax = (
  boards: SmallBoardState[],
  activeBoard: number | null,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  variant: GameVariant = 'classic'
): number => {
  const gameResult = evaluateGameState(boards);
  
  if (gameResult !== null || depth === 0) {
    return evaluatePosition(boards, variant);
  }

  const validMoves = getValidMoves(boards, activeBoard);
  
  if (validMoves.length === 0) {
    return evaluatePosition(boards, variant);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of validMoves) {
      const newBoards = simulateMove(boards, move.boardIndex, move.cellIndex, 'O', variant);
      const nextActive = getNextActiveBoard(newBoards, move.cellIndex);
      const evalScore = minimax(newBoards, nextActive, depth - 1, alpha, beta, false, variant);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of validMoves) {
      const newBoards = simulateMove(boards, move.boardIndex, move.cellIndex, 'X', variant);
      const nextActive = getNextActiveBoard(newBoards, move.cellIndex);
      const evalScore = minimax(newBoards, nextActive, depth - 1, alpha, beta, true, variant);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
};

// Get AI move based on difficulty
const getAIMove = (
  boards: SmallBoardState[],
  activeBoard: number | null,
  difficulty: Difficulty,
  variant: GameVariant = 'classic'
): AIMove | null => {
  const validMoves = getValidMoves(boards, activeBoard);
  
  if (validMoves.length === 0) return null;

  if (difficulty === 'easy') {
    // Random move
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex] ?? null;
  }

  if (difficulty === 'medium') {
    // Mix of random and strategic (50% chance of best move)
    if (Math.random() < 0.5) {
      const randomIndex = Math.floor(Math.random() * validMoves.length);
      return validMoves[randomIndex] ?? null;
    }
    // Limited depth minimax
    let bestMove: AIMove | null = null;
    let bestScore = -Infinity;

    for (const move of validMoves) {
      const newBoards = simulateMove(boards, move.boardIndex, move.cellIndex, 'O', variant);
      const nextActive = getNextActiveBoard(newBoards, move.cellIndex);
      const score = minimax(newBoards, nextActive, 2, -Infinity, Infinity, false, variant);
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  // Hard difficulty - full minimax with deeper search
  let bestMove: AIMove | null = null;
  let bestScore = -Infinity;

  // Adaptive depth based on number of moves available
  const depth = validMoves.length > 20 ? 3 : validMoves.length > 10 ? 4 : 5;

  for (const move of validMoves) {
    const newBoards = simulateMove(boards, move.boardIndex, move.cellIndex, 'O', variant);
    const nextActive = getNextActiveBoard(newBoards, move.cellIndex);
    const score = minimax(newBoards, nextActive, depth, -Infinity, Infinity, false, variant);
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

export const useComputerAI = () => {
  const computeMove = useCallback((
    boards: SmallBoardState[],
    activeBoard: number | null,
    difficulty: Difficulty,
    variant: GameVariant = 'classic'
  ): AIMove | null => {
    return getAIMove(boards, activeBoard, difficulty, variant);
  }, []);

  return { computeMove };
};

export default useComputerAI;
