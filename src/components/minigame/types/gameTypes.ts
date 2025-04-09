
export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'platform' | 'hazard' | 'coin';
}

export interface GameState {
  playerY: number;
  playerVelocity: number;
  obstacles: Obstacle[];
  score: number;
  isGameOver: boolean;
}
