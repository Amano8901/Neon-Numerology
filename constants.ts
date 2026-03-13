import { WinType } from './types';

export const GRID_ROWS = 5;
export const GRID_COLS = 3;
export const INITIAL_CREDITS = 1000;
export const MIN_BET = 10;
export const MAX_BET = 100;
export const BET_STEP = 10;
export const ANIMATION_DURATION_MS = 2000; // Total spin time
export const STAGGER_DELAY_MS = 200; // Delay between rows stopping

export const PAYOUTS: Record<WinType, number> = {
  [WinType.TRIPLE_SEVEN]: 500,
  [WinType.THREE_OF_A_KIND]: 50,
  [WinType.STRAIGHT]: 30,
  [WinType.SUM_21]: 25,
  [WinType.PAIR]: 2,
  [WinType.NONE]: 0
};

export const WIN_DESCRIPTIONS: Record<WinType, string> = {
  [WinType.TRIPLE_SEVEN]: "JACKPOT! TRIPLE SEVENS!",
  [WinType.THREE_OF_A_KIND]: "Perfect Match!",
  [WinType.STRAIGHT]: "Numeric Harmony (Straight)",
  [WinType.SUM_21]: "Blackjack Sum (21)",
  [WinType.PAIR]: "A modest pair",
  [WinType.NONE]: ""
};
