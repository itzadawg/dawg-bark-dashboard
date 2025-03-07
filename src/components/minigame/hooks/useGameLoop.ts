
import { useState, useEffect, useRef } from 'react';
import { Obstacle } from '../types/gameTypes';
import { GRAVITY, GAME_SPEED } from '../utils/gameConstants';
import { generateObstacle, checkCollision } from '../utils/gameLogic';

export const useGameLoop = (groundY: number) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerY, setPlayerY] = useState(0); // Will be set to ground level on init
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setPlayerVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    lastTimeRef.current = 0;
    frameCountRef.current = 0;
    setPlayerY(groundY);
  };
  
  const closeGameOver = () => {
    setGameOver(false);
  };
  
  const jump = () => {
    if (gameOver) return;
    
    if (!isPlaying) {
      startGame();
      return;
    }
    
    if (!isJumping) {
      setPlayerVelocity(-10); // JUMP_FORCE
      setIsJumping(true);
    }
  };
  
  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (!isPlaying || gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Update player position
    setPlayerY(prevY => {
      const newY = prevY + playerVelocity;
      
      if (newY >= groundY) {
        setIsJumping(false);
        setPlayerVelocity(0);
        return groundY;
      }
      
      return newY;
    });
    
    // Apply gravity if jumping
    if (isJumping) {
      setPlayerVelocity(prev => prev + GRAVITY);
    }
    
    // Generate obstacles
    frameCountRef.current += 1;
    if (frameCountRef.current % 100 === 0 && gameAreaRef.current) {
      const gameWidth = gameAreaRef.current.clientWidth || 600;
      const gameHeight = gameAreaRef.current.clientHeight || 400;
      
      const newObstacle = generateObstacle(gameWidth, gameHeight, groundY);
      setObstacles(prev => [...prev, newObstacle]);
    }
    
    // Update obstacles and check collisions
    setObstacles(prevObstacles => {
      if (!gameAreaRef.current) return prevObstacles;
      
      const gameHeight = gameAreaRef.current.clientHeight || 400;
      
      const updatedObstacles = prevObstacles
        .map(obstacle => {
          const newX = obstacle.x - GAME_SPEED;
          
          // Score point when passing obstacle
          if (!obstacle.passed && newX + obstacle.width < 100) {
            setScore(prev => prev + 1);
            return { ...obstacle, x: newX, passed: true };
          }
          
          // Check collision
          checkCollision(
            playerY, 
            obstacle, 
            gameHeight,
            playerVelocity,
            setPlayerY,
            setPlayerVelocity,
            setIsJumping,
            setGameOver,
            setIsPlaying,
            setHighScore,
            score
          );
          
          return { ...obstacle, x: newX };
        })
        .filter(obstacle => obstacle.x > -obstacle.width);
      
      return updatedObstacles;
    });
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, gameOver, playerVelocity, isJumping]);
  
  return {
    gameAreaRef,
    isPlaying,
    gameOver,
    score,
    highScore,
    playerY,
    obstacles,
    startGame,
    closeGameOver,
    jump,
    setGameAreaRef: (ref: HTMLDivElement | null) => {
      gameAreaRef.current = ref;
    }
  };
};
