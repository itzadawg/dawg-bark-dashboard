
import { v4 as uuidv4 } from 'uuid';
import { Obstacle, GameDifficulty, PlayerState } from "../types/gameTypes";
import { 
  MAX_JUMP_HEIGHT, 
  OBSTACLE_WIDTH, 
  PLAYER_WIDTH, 
  PLAYER_HEIGHT,
  GRAVITY,
  GAME_SPEED_BASE,
  SPEED_INCREASE_PER_LEVEL,
  DIFFICULTY_SETTINGS,
  COIN_SIZE
} from "./gameConstants";

export const generateObstacle = (
  gameWidth: number, 
  gameHeight: number, 
  groundY: number,
  difficulty: GameDifficulty = 'medium',
  level: number = 1
): Obstacle => {
  const difficultySettings = DIFFICULTY_SETTINGS[difficulty];
  const random = Math.random();
  
  // Determine obstacle type based on probabilities
  let obstacleType: 'platform' | 'hazard' | 'coin';
  
  if (random < difficultySettings.hazardFrequency) {
    obstacleType = 'hazard';
  } else if (random < difficultySettings.hazardFrequency + difficultySettings.platformFrequency) {
    obstacleType = 'platform';
  } else {
    obstacleType = 'coin';
  }
  
  let obstacleHeight;
  let obstacleWidth = OBSTACLE_WIDTH;
  
  if (obstacleType === 'platform') {
    // Platform heights - ensure they are reachable
    // Either ground level or a height that can be reached with a jump
    const possibleHeights = [
      40, // Ground level platform
      40 + Math.random() * (MAX_JUMP_HEIGHT * 0.7) // Reachable with jump (70% of max jump)
    ];
    obstacleHeight = possibleHeights[Math.floor(Math.random() * possibleHeights.length)];
  } else if (obstacleType === 'hazard') {
    // Hazards (spikes) - always at ground level
    obstacleHeight = 40;
  } else {
    // Coins are smaller and can be at varying heights
    obstacleHeight = Math.random() * (MAX_JUMP_HEIGHT * 0.9) + 50;
    obstacleWidth = COIN_SIZE;
  }
  
  return {
    id: uuidv4(),
    x: gameWidth,
    height: obstacleHeight,
    width: obstacleWidth,
    passed: false,
    type: obstacleType
  };
};

export const calculateGameSpeed = (level: number, difficulty: GameDifficulty = 'medium'): number => {
  const baseSpeed = GAME_SPEED_BASE * DIFFICULTY_SETTINGS[difficulty].speedMultiplier;
  return baseSpeed + (level - 1) * SPEED_INCREASE_PER_LEVEL;
};

export const checkCollision = (
  playerState: PlayerState,
  obstacle: Obstacle,
  gameHeight: number,
): { 
  collision: boolean; 
  collisionType: 'none' | 'platform' | 'hazard' | 'coin'; 
  newPlayerState?: Partial<PlayerState>;
} => {
  const { y, isInvincible } = playerState;
  
  const playerLeft = 100;
  const playerRight = playerLeft + PLAYER_WIDTH;
  const playerTop = y;
  const playerBottom = y + PLAYER_HEIGHT;
  
  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  
  // No collision detection during invincibility (except for platforms and coins)
  if (isInvincible && obstacle.type === 'hazard') {
    return { collision: false, collisionType: 'none' };
  }
  
  // For platforms, only the top surface matters for collision
  if (obstacle.type === 'platform') {
    const obstacleSurfaceY = gameHeight - obstacle.height;
    
    // Check if player is landing on top of platform
    if (
      playerRight > obstacleLeft && 
      playerLeft < obstacleRight &&
      playerBottom >= obstacleSurfaceY - 5 && // Small tolerance for landing
      playerBottom <= obstacleSurfaceY + 5 && // Small tolerance for landing
      playerState.velocity > 0 // Moving downward
    ) {
      // Land on platform
      return { 
        collision: true, 
        collisionType: 'platform',
        newPlayerState: {
          y: obstacleSurfaceY - PLAYER_HEIGHT,
          velocity: 0,
          isJumping: false
        }
      };
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
      return { collision: true, collisionType: 'hazard' };
    }
  } else if (obstacle.type === 'coin') {
    // For coins, check if player intersects with the coin
    const coinCenterX = obstacle.x + obstacle.width / 2;
    const coinCenterY = gameHeight - obstacle.height;
    
    const coinLeft = coinCenterX - COIN_SIZE / 2;
    const coinRight = coinCenterX + COIN_SIZE / 2;
    const coinTop = coinCenterY - COIN_SIZE / 2;
    const coinBottom = coinCenterY + COIN_SIZE / 2;
    
    if (
      playerRight > coinLeft && 
      playerLeft < coinRight && 
      playerBottom > coinTop &&
      playerTop < coinBottom
    ) {
      // Collected coin
      return { collision: true, collisionType: 'coin' };
    }
  }
  
  return { collision: false, collisionType: 'none' };
};

export const applyGravity = (playerState: PlayerState, groundY: number): PlayerState => {
  const { y, velocity, isJumping } = playerState;
  
  // Apply gravity to velocity
  const newVelocity = isJumping ? velocity + GRAVITY : velocity;
  
  // Calculate new position
  let newY = y + newVelocity;
  
  // Check if player has landed on the ground
  if (newY >= groundY) {
    return {
      ...playerState,
      y: groundY,
      velocity: 0,
      isJumping: false
    };
  }
  
  return {
    ...playerState,
    y: newY,
    velocity: newVelocity
  };
};
