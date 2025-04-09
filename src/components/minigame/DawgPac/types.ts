
export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface GameEntity {
  id: number;
  position: Position;
  color: string;
  direction?: Direction;
}

// 0 = empty space, 1 = wall
export type GameMap = number[][];

export interface LevelData {
  map: GameMap;
  playerStart: Position;
  ghosts: GameEntity[];
  dots: Position[];
  powerUps: Position[];
}
