import { GoogleGenAI } from "@google/genai";
import { Grid, OracleResponse, RowResult } from '../types';

let genAI: GoogleGenAI | null = null;

// Initialize securely with environment variable
try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI", error);
}

export const consultOracle = async (
  grid: Grid, 
  results: RowResult[], 
  totalWin: number
): Promise<OracleResponse> => {
  if (!genAI) {
    return {
      message: "The Oracle is silent (API Key missing).",
      mood: 'neutral'
    };
  }

  // Prepare a string representation of the grid for the AI
  const gridString = grid.map(row => `[${row.map(c => c.value).join(', ')}]`).join('\n');
  const winContext = totalWin > 0 
    ? `The user WON ${totalWin} credits! Winning rows: ${results.length}.`
    : `The user lost this round.`;

  const prompt = `
    You are the "Neon Oracle", a cyberpunk AI overseeing a game of numerical chance.
    Here is the current grid of 5 rows (3 numbers each):
    ${gridString}

    Game Outcome: ${winContext}

    Task: Provide a short, 1-sentence commentary on the numbers. 
    - If they won big, be ecstatic and mystical.
    - If they lost, be encouraging but cryptic (mention patterns that *almost* happened).
    - Use terms like "entropy", "algorithm", "flux", "singularity", "variance".
    - Do NOT describe the rules of the game, just interpret the "vibe" of the numbers.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return {
      message: response.text.trim(),
      mood: totalWin > 100 ? 'excited' : (totalWin > 0 ? 'mystical' : 'neutral')
    };
  } catch (error) {
    console.error("Oracle error:", error);
    return {
      message: "Static interference in the datastream...",
      mood: 'neutral'
    };
  }
};
