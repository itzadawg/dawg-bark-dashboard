
export interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  playerY: number;
  playerVelocity: number;
  obstacles: Obstacle[];
  score: number;
  isGameOver: boolean;
}
