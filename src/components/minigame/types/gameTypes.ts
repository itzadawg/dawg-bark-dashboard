
// Shared types for Dawg Dash

export interface Obstacle {
  id: string;
  x: number;
  height: number;
  width: number;
  passed: boolean;
  type: 'platform' | 'hazard' | 'coin';
}

export interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
  level: number;
  coins: number;
}

export interface PlayerState {
  y: number;
  velocity: number;
  isJumping: boolean;
  isInvincible: boolean;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';
