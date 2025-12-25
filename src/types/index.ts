// Player types
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardWinner = Player | 'draw' | null;

// Win result from checking a board
export interface WinResult {
  winner: Player | 'draw';
  line: [number, number, number] | null;
}

// Small board state
export interface SmallBoardState {
  cells: CellValue[];
  winner: BoardWinner;
  winLine: [number, number, number] | null;
}

// Move history entry
export interface Move {
  boardIndex: number;
  cellIndex: number;
  player: Player;
}

// Player names
export interface PlayerNames {
  X: string;
  O: string;
}

// Game state returned by the hook
export interface GameState {
  boards: SmallBoardState[];
  currentPlayer: Player;
  activeBoard: number | null;
  gameWinner: BoardWinner;
  gameWinLine: [number, number, number] | null;
  playerNames: PlayerNames;
  setPlayerNames: React.Dispatch<React.SetStateAction<PlayerNames>>;
  canPlayBoard: (boardIndex: number) => boolean;
  makeMove: (boardIndex: number, cellIndex: number) => boolean;
  resetGame: () => void;
  undoMove: () => void;
  moveHistory: Move[];
}

// Component props
export interface CellProps {
  value: CellValue;
  onClick: () => void;
  isPlayable: boolean;
  index: number;
}

export interface SmallBoardProps {
  board: SmallBoardState;
  boardIndex: number;
  isActive: boolean;
  isPlayable: boolean;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
}

export interface GameBoardProps {
  boards: SmallBoardState[];
  activeBoard: number | null;
  canPlayBoard: (boardIndex: number) => boolean;
  onCellClick: (boardIndex: number, cellIndex: number) => void;
  gameWinner: BoardWinner;
  gameWinLine: [number, number, number] | null;
}

export interface PlayerIndicatorProps {
  currentPlayer: Player;
  playerNames: PlayerNames;
}

export interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
  gameWinner: BoardWinner;
}

// Particle for background animation
export interface Particle {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  size: string;
}
