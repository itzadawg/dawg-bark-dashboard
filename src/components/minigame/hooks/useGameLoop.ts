
import { useState, useEffect, useRef } from 'react';
import { Obstacle, GameState, PlayerState, GameDifficulty } from '../types/gameTypes';
import { 
  JUMP_FORCE, 
  OBSTACLE_GAP,
  POINTS_PER_OBSTACLE,
  LEVEL_UP_SCORE,
  COINS_PER_LEVEL,
  INVINCIBILITY_DURATION
} from '../utils/gameConstants';
import { 
  generateObstacle, 
  checkCollision, 
  applyGravity,
  calculateGameSpeed 
} from '../utils/gameLogic';

export const useGameLoop = (groundY: number) => {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    coins: 0
  });
  
  // Player state
  const [playerState, setPlayerState] = useState<PlayerState>({
    y: 0,
    velocity: 0,
    isJumping: false,
    isInvincible: false
  });
  
  // Game elements
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [difficulty, setDifficulty] = useState<GameDifficulty>('medium');
  const [backgroundClass, setBackgroundClass] = useState('from-sky-300 to-sky-500');
  
  // Refs for animation frame and timing
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const obstacleTimerRef = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const invincibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sound effects refs
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const coinSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const levelUpSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Effects for sound initialization
  useEffect(() => {
    jumpSoundRef.current = new Audio("/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.mp3");
    coinSoundRef.current = new Audio("/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.mp3");
    gameOverSoundRef.current = new Audio("/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.mp3");
    levelUpSoundRef.current = new Audio("/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.mp3");
    
    // Preload sounds
    jumpSoundRef.current.load();
    coinSoundRef.current.load();
    gameOverSoundRef.current.load();
    levelUpSoundRef.current.load();
    
    return () => {
      // Cleanup timers on unmount
      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
      }
    };
  }, []);
  
  // Update background based on level
  useEffect(() => {
    const levelIndex = Math.min(gameState.level - 1, 9); // Max 10 backgrounds
    setBackgroundClass(`from-${levelIndex < 10 ? 'sky' : 'emerald'}-300 to-${levelIndex < 10 ? 'sky' : 'emerald'}-500`);
  }, [gameState.level]);
  
  const startGame = (selectedDifficulty: GameDifficulty = 'medium') => {
    setGameState({
      isPlaying: true,
      gameOver: false,
      score: 0,
      highScore: gameState.highScore,
      level: 1,
      coins: 0
    });
    
    setPlayerState({
      y: groundY,
      velocity: 0,
      isJumping: false,
      isInvincible: false
    });
    
    setDifficulty(selectedDifficulty);
    setObstacles([]);
    lastTimeRef.current = 0;
    obstacleTimerRef.current = 0;
  };
  
  const closeGameOver = () => {
    setGameState(prev => ({ ...prev, gameOver: false }));
  };
  
  const jump = () => {
    if (gameState.gameOver) return;
    
    if (!gameState.isPlaying) {
      startGame(difficulty);
      return;
    }
    
    if (!playerState.isJumping) {
      // Play jump sound
      if (jumpSoundRef.current) {
        jumpSoundRef.current.currentTime = 0;
        jumpSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
      
      setPlayerState(prev => ({
        ...prev,
        velocity: JUMP_FORCE,
        isJumping: true
      }));
    }
  };
  
  const makePlayerInvincible = () => {
    setPlayerState(prev => ({ ...prev, isInvincible: true }));
    
    // Clear existing timer if any
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
    }
    
    // Set invincibility timeout
    invincibilityTimerRef.current = setTimeout(() => {
      setPlayerState(prev => ({ ...prev, isInvincible: false }));
    }, INVINCIBILITY_DURATION);
  };
  
  const gameOver = () => {
    if (gameOverSoundRef.current) {
      gameOverSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    setGameState(prev => {
      const newHighScore = Math.max(prev.highScore, prev.score);
      return {
        ...prev,
        isPlaying: false,
        gameOver: true,
        highScore: newHighScore
      };
    });
  };
  
  const levelUp = () => {
    if (levelUpSoundRef.current) {
      levelUpSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
    
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1
    }));
    
    // Brief invincibility on level up
    makePlayerInvincible();
  };
  
  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (!gameState.isPlaying || gameState.gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Generate obstacles based on time and difficulty
    obstacleTimerRef.current += deltaTime;
    if (obstacleTimerRef.current > OBSTACLE_GAP / calculateGameSpeed(gameState.level, difficulty) * 16 && gameAreaRef.current) {
      obstacleTimerRef.current = 0;
      const gameWidth = gameAreaRef.current.clientWidth || 600;
      const gameHeight = gameAreaRef.current.clientHeight || 400;
      
      const newObstacle = generateObstacle(
        gameWidth, 
        gameHeight, 
        groundY,
        difficulty,
        gameState.level
      );
      
      setObstacles(prev => [...prev, newObstacle]);
    }
    
    // Apply physics to player
    setPlayerState(prev => applyGravity(prev, groundY));
    
    // Update obstacles and check collisions
    setObstacles(prevObstacles => {
      if (!gameAreaRef.current) return prevObstacles;
      
      const gameHeight = gameAreaRef.current.clientHeight || 400;
      const gameSpeed = calculateGameSpeed(gameState.level, difficulty);
      
      const updatedObstacles = prevObstacles
        .map(obstacle => {
          const newX = obstacle.x - gameSpeed;
          
          // Score point when passing obstacle
          if (!obstacle.passed && newX + obstacle.width < 100) {
            if (obstacle.type === 'platform' || obstacle.type === 'hazard') {
              setGameState(prev => {
                const newScore = prev.score + POINTS_PER_OBSTACLE;
                
                // Check for level up
                if (Math.floor(newScore / LEVEL_UP_SCORE) > Math.floor(prev.score / LEVEL_UP_SCORE)) {
                  levelUp();
                }
                
                return {
                  ...prev,
                  score: newScore
                };
              });
            }
            
            return { ...obstacle, x: newX, passed: true };
          }
          
          // Check collision
          const collisionResult = checkCollision(
            playerState,
            { ...obstacle, x: newX },
            gameHeight
          );
          
          if (collisionResult.collision) {
            if (collisionResult.collisionType === 'platform' && collisionResult.newPlayerState) {
              setPlayerState(prev => ({
                ...prev,
                ...collisionResult.newPlayerState
              }));
            } else if (collisionResult.collisionType === 'hazard') {
              gameOver();
            } else if (collisionResult.collisionType === 'coin') {
              // Play coin sound
              if (coinSoundRef.current) {
                coinSoundRef.current.currentTime = 0;
                coinSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
              }
              
              setGameState(prev => {
                const newCoins = prev.coins + 1;
                
                // Power-up for collecting COINS_PER_LEVEL coins
                if (newCoins % COINS_PER_LEVEL === 0) {
                  makePlayerInvincible();
                }
                
                return {
                  ...prev,
                  coins: newCoins
                };
              });
              
              // Coins disappear when collected
              return null;
            }
          }
          
          return { ...obstacle, x: newX };
        })
        .filter(Boolean) // Remove null items (collected coins)
        .filter(obstacle => obstacle!.x > -obstacle!.width) as Obstacle[]; // Remove obstacles that are off-screen
      
      return updatedObstacles;
    });
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Start and cleanup game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, playerState, difficulty]);
  
  return {
    gameState,
    playerState,
    obstacles,
    difficulty,
    backgroundClass,
    startGame,
    closeGameOver,
    jump,
    setDifficulty,
    setGameAreaRef: (ref: HTMLDivElement | null) => {
      gameAreaRef.current = ref;
      
      // Set initial player position when game area is available
      if (ref && groundY) {
        setPlayerState(prev => ({ ...prev, y: groundY }));
      }
    }
  };
};
