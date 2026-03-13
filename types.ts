export interface Cell {
  id: string;
  value: number;
  isMatch: boolean;
  isSpinning: boolean;
}

export type Row = Cell[];
export type Grid = Row[];

export enum WinType {
  NONE = 'NONE',
  TRIPLE_SEVEN = 'JACKPOT', // 7-7-7
  THREE_OF_A_KIND = 'MATCH_3', // e.g. 5-5-5
  STRAIGHT = 'STRAIGHT', // e.g. 1-2-3
  SUM_21 = 'BLACKJACK', // Sum of row is 21
  PAIR = 'PAIR' // e.g. 5-5-2 (Small win)
}

export interface RowResult {
  rowIndex: number;
  winType: WinType;
  payout: number;
  winningIndices: number[]; // 0, 1, 2
}

export interface GameState {
  grid: Grid;
  isSpinning: boolean;
  credits: number;
  betPerLine: number;
  lastWinAmount: number;
  winningRows: RowResult[];
  history: string[];
}

export interface OracleResponse {
  message: string;
  mood: 'mystical' | 'excited' | 'ominous' | 'neutral';
}
