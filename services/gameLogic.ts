import { Grid, Row, Cell, RowResult, WinType } from '../types';
import { GRID_ROWS, GRID_COLS, PAYOUTS } from '../constants';

export const generateRandomNumber = (): number => Math.floor(Math.random() * 9) + 1; // 1-9

export const createInitialGrid = (): Grid => {
  return Array.from({ length: GRID_ROWS }, (_, rIndex) =>
    Array.from({ length: GRID_COLS }, (_, cIndex) => ({
      id: `${rIndex}-${cIndex}`,
      value: generateRandomNumber(),
      isMatch: false,
      isSpinning: false
    }))
  );
};

export const evaluateRow = (row: Row, rowIndex: number, bet: number): RowResult | null => {
  const values = row.map(c => c.value);
  
  // Check for Triple Seven
  if (values.every(v => v === 7)) {
    return {
      rowIndex,
      winType: WinType.TRIPLE_SEVEN,
      payout: PAYOUTS[WinType.TRIPLE_SEVEN] * (bet / 10), // Scale with bet
      winningIndices: [0, 1, 2]
    };
  }

  // Check for Three of a Kind
  if (values.every(v => v === values[0])) {
    return {
      rowIndex,
      winType: WinType.THREE_OF_A_KIND,
      payout: PAYOUTS[WinType.THREE_OF_A_KIND] * (bet / 10),
      winningIndices: [0, 1, 2]
    };
  }

  // Check for Straight (Ascending or Descending)
  const isAscending = values[1] === values[0] + 1 && values[2] === values[1] + 1;
  const isDescending = values[1] === values[0] - 1 && values[2] === values[1] - 1;
  
  if (isAscending || isDescending) {
    return {
      rowIndex,
      winType: WinType.STRAIGHT,
      payout: PAYOUTS[WinType.STRAIGHT] * (bet / 10),
      winningIndices: [0, 1, 2]
    };
  }

  // Check Sum 21
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum === 21) {
    return {
      rowIndex,
      winType: WinType.SUM_21,
      payout: PAYOUTS[WinType.SUM_21] * (bet / 10),
      winningIndices: [0, 1, 2]
    };
  }

  // Check Pair (First two, Last two, or Ends)
  if (values[0] === values[1]) return { rowIndex, winType: WinType.PAIR, payout: PAYOUTS[WinType.PAIR] * (bet / 10), winningIndices: [0, 1] };
  if (values[1] === values[2]) return { rowIndex, winType: WinType.PAIR, payout: PAYOUTS[WinType.PAIR] * (bet / 10), winningIndices: [1, 2] };
  if (values[0] === values[2]) return { rowIndex, winType: WinType.PAIR, payout: PAYOUTS[WinType.PAIR] * (bet / 10), winningIndices: [0, 2] };

  return null;
};

export const calculateResults = (grid: Grid, bet: number): { results: RowResult[], totalWin: number } => {
  const results: RowResult[] = [];
  let totalWin = 0;

  grid.forEach((row, index) => {
    const result = evaluateRow(row, index, bet);
    if (result) {
      results.push(result);
      totalWin += result.payout;
    }
  });

  return { results, totalWin };
};
