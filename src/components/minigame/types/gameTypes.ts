
// Shared types for Dawg Dash

export interface Obstacle {
  x: number;
  height: number;
  width: number;
  passed: boolean;
  type: 'platform' | 'hazard';
}

export interface GameState {
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  highScore: number;
}
