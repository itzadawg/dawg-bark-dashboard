
// Game constants for Dawg Dash

// Physics
export const GRAVITY = 0.6;
export const JUMP_FORCE = -12;
export const GAME_SPEED_BASE = 5;
export const SPEED_INCREASE_PER_LEVEL = 0.5;

// Dimensions
export const OBSTACLE_WIDTH = 60;
export const OBSTACLE_GAP = 250;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 60;
export const GROUND_HEIGHT = 40;
export const COIN_SIZE = 30;

// Game mechanics
export const POINTS_PER_OBSTACLE = 10;
export const COINS_PER_LEVEL = 10;
export const LEVEL_UP_SCORE = 100;
export const INVINCIBILITY_DURATION = 1500;

// Calculate max jump height based on physics
export const MAX_JUMP_HEIGHT = Math.abs(JUMP_FORCE * JUMP_FORCE / (2 * GRAVITY));

// Background colors for different game levels
export const LEVEL_BACKGROUNDS = [
  'from-sky-300 to-sky-500',          // Level 1
  'from-purple-300 to-purple-500',    // Level 2
  'from-pink-300 to-pink-500',        // Level 3
  'from-orange-300 to-orange-500',    // Level 4
  'from-green-300 to-green-500',      // Level 5
  'from-blue-400 to-blue-600',        // Level 6
  'from-red-400 to-red-600',          // Level 7
  'from-yellow-300 to-yellow-500',    // Level 8
  'from-indigo-400 to-indigo-600',    // Level 9
  'from-emerald-300 to-emerald-500',  // Level 10+
];

// Game difficulty settings
export const DIFFICULTY_SETTINGS = {
  easy: {
    hazardFrequency: 0.2,
    platformFrequency: 0.6,
    coinFrequency: 0.2,
    speedMultiplier: 0.8
  },
  medium: {
    hazardFrequency: 0.3,
    platformFrequency: 0.5,
    coinFrequency: 0.2,
    speedMultiplier: 1.0
  },
  hard: {
    hazardFrequency: 0.4,
    platformFrequency: 0.4,
    coinFrequency: 0.2,
    speedMultiplier: 1.2
  }
};
