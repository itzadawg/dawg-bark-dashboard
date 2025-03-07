
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import GameOverModal from './GameOverModal';

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GAME_SPEED = 5;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_GAP = 300;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const GROUND_HEIGHT = 40;

const DawgDash: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerY, setPlayerY] = useState(200);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Array<{x: number, height: number, width: number, passed: boolean}>>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setPlayerY(200);
    setPlayerVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    lastTimeRef.current = 0;
    frameCountRef.current = 0;
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
      setPlayerVelocity(JUMP_FORCE);
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
      const groundY = (gameAreaRef.current?.clientHeight || 400) - PLAYER_HEIGHT - GROUND_HEIGHT;
      
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
    if (frameCountRef.current % 100 === 0) {
      const gameWidth = gameAreaRef.current?.clientWidth || 600;
      const gameHeight = gameAreaRef.current?.clientHeight || 400;
      const obstacleHeight = Math.floor(Math.random() * 50) + 50;
      const obstacleWidth = OBSTACLE_WIDTH;
      
      setObstacles(prevObstacles => [...prevObstacles, {
        x: gameWidth,
        height: obstacleHeight,
        width: obstacleWidth,
        passed: false
      }]);
    }
    
    // Update obstacles and check collisions
    setObstacles(prevObstacles => {
      const updatedObstacles = prevObstacles
        .map(obstacle => {
          const newX = obstacle.x - GAME_SPEED;
          
          // Score point when passing obstacle
          if (!obstacle.passed && newX + obstacle.width < 100) {
            setScore(prev => prev + 1);
            return { ...obstacle, x: newX, passed: true };
          }
          
          // Check collision
          const playerLeft = 100;
          const playerRight = playerLeft + PLAYER_WIDTH;
          const playerTop = playerY;
          const playerBottom = playerY + PLAYER_HEIGHT;
          
          const obstacleLeft = obstacle.x;
          const obstacleRight = obstacle.x + obstacle.width;
          const obstacleTop = (gameAreaRef.current?.clientHeight || 400) - GROUND_HEIGHT - obstacle.height;
          const obstacleBottom = (gameAreaRef.current?.clientHeight || 400) - GROUND_HEIGHT;
          
          if (
            playerRight > obstacleLeft && 
            playerLeft < obstacleRight && 
            playerBottom > obstacleTop &&
            playerTop < obstacleBottom
          ) {
            setGameOver(true);
            setIsPlaying(false);
            setHighScore(prev => Math.max(prev, score));
          }
          
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        jump();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, gameOver, isJumping]);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-[#1EAEDB]">Dawg Dash</h1>
      
      <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto">
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">Score: {score}</p>
        </div>
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">High Score: {highScore}</p>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="neo-brutal-border relative mx-auto bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden"
        style={{ width: '600px', height: '400px', cursor: 'pointer' }}
        onClick={jump}
      >
        {/* Player */}
        <div
          className="absolute transition-transform"
          style={{
            left: '100px',
            top: `${playerY}px`,
            width: `${PLAYER_WIDTH}px`,
            height: `${PLAYER_HEIGHT}px`,
            zIndex: 20
          }}
        >
          <img 
            src="/lovable-uploads/d4d58344-3817-4b81-a535-e7fd84d0e807.png" 
            alt="Dawg" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Ground */}
        <div 
          className="absolute bottom-0 w-full bg-[#a67c52] border-t-2 border-black"
          style={{ height: `${GROUND_HEIGHT}px` }}
        ></div>
        
        {/* Obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="absolute bg-[#8b5cf6] border-2 border-black rounded-md"
            style={{
              left: `${obstacle.x}px`,
              bottom: GROUND_HEIGHT,
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
            }}
          ></div>
        ))}
        
        {/* Game UI Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-30">
            {gameOver ? (
              <GameOverModal 
                score={score} 
                highScore={highScore} 
                onRestart={startGame}
                onClose={closeGameOver}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg neo-brutal-box">
                <h2 className="text-2xl font-bold mb-4">Dawg Dash</h2>
                <p className="mb-4">Press Space or click to jump over obstacles!</p>
                <Button 
                  onClick={startGame}
                  className="neo-brutal-button"
                >
                  Start Game
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg">Press Space or click to jump!</p>
      </div>
    </div>
  );
};

export default DawgDash;
