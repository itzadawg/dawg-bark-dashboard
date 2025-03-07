
import { Obstacle } from "../types/gameTypes";
import { MAX_JUMP_HEIGHT, OBSTACLE_WIDTH, PLAYER_WIDTH, PLAYER_HEIGHT } from "./gameConstants";

export const generateObstacle = (
  gameWidth: number, 
  gameHeight: number, 
  groundY: number
): Obstacle => {
  const obstacleType = Math.random() > 0.3 ? 'platform' : 'hazard';
  
  let obstacleHeight;
  
  if (obstacleType === 'platform') {
    // Platform heights - ensure they are reachable
    // Either ground level or a height that can be reached with a jump
    const possibleHeights = [
      40, // Ground level platform
      40 + Math.random() * (MAX_JUMP_HEIGHT * 0.7) // Reachable with jump (70% of max jump)
    ];
    obstacleHeight = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
  } else {
    // Hazards (spikes) - always at ground level
    obstacleHeight = 40;
  }
  
  return {
    x: gameWidth,
    height: obstacleHeight,
    width: OBSTACLE_WIDTH,
    passed: false,
    type: obstacleType
  };
};

export const checkCollision = (
  playerY: number, 
  obstacle: Obstacle, 
  gameHeight: number,
  playerVelocity: number,
  setPlayerY: (value: React.SetStateAction<number>) => void,
  setPlayerVelocity: (value: React.SetStateAction<number>) => void,
  setIsJumping: (value: React.SetStateAction<boolean>) => void,
  setGameOver: (value: React.SetStateAction<boolean>) => void,
  setIsPlaying: (value: React.SetStateAction<boolean>) => void,
  setHighScore: (value: React.SetStateAction<number>) => void,
  score: number
): boolean => {
  const playerLeft = 100;
  const playerRight = playerLeft + PLAYER_WIDTH;
  const playerTop = playerY;
  const playerBottom = playerY + PLAYER_HEIGHT;
  
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  
  // For platforms, only the top surface matters for collision
  if (obstacle.type === 'platform') {
    const obstacleSurfaceY = gameHeight - obstacle.height;
    
    // Check if player is landing on top of platform
    if (
      playerRight > obstacleLeft && 
      playerLeft < obstacleRight &&
      playerBottom >= obstacleSurfaceY - 5 && // Small tolerance for landing
      playerBottom <= obstacleSurfaceY + 5 && // Small tolerance for landing
      playerVelocity > 0 // Moving downward
    ) {
      // Land on platform
      setPlayerY(obstacleSurfaceY - PLAYER_HEIGHT);
      setPlayerVelocity(0);
      setIsJumping(false);
      return false; // Not a game-ending collision
    }
  } else if (obstacle.type === 'hazard') {
    // For hazards, any collision is game over
    const obstacleTop = gameHeight - obstacle.height;
    
    if (
      playerRight > obstacleLeft && 
      playerLeft < obstacleRight && 
      playerBottom > obstacleTop
    ) {
      // Collision with hazard
      setGameOver(true);
      setIsPlaying(false);
      setHighScore(prev => Math.max(prev, score));
      return true; // Game-ending collision
    }
  }
  
  return false; // No collision
};
