export interface QuizItem {
  character: string;
  pinyin: string;
  initial: string; // The part before the final (e.g., 'ch' for 'chuan')
  definition: string;
  correctFinal: string;
  options: string[];
}

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  pairs: string[]; // e.g., ["in", "ing"]
  color: string;
  opponentId: number; // National Dex ID for the sprite
  opponentName: string;
  bgGradient: string;
}

export enum GameState {
  MENU,
  LOADING,
  PLAYING,
  RESULT,
  GAME_OVER,
  ERROR
}