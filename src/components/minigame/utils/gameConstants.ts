
// Game constants for Dawg Dash
export const GRAVITY = 0.6;
export const JUMP_FORCE = -10;
export const GAME_SPEED = 5;
export const OBSTACLE_WIDTH = 50;
export const OBSTACLE_GAP = 300;
export const PLAYER_WIDTH = 60;
export const PLAYER_HEIGHT = 60;
export const GROUND_HEIGHT = 40;

// Calculate max jump height based on physics
export const MAX_JUMP_HEIGHT = Math.abs(JUMP_FORCE * JUMP_FORCE / (2 * GRAVITY));
