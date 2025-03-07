
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import GameOverModal from './GameOverModal';

// Game constants
const GRAVITY = 0.6;
const JUMP_FORCE = -10;
const GAME_SPEED = 5;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_GAP = 200; // Gap between obstacles
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const GROUND_HEIGHT = 40;

const DawgDash: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerY, setPlayerY] = useState(0); // Will be set to ground level on init
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Array<{x: number, height: number, width: number, passed: boolean, type: string, isHighPlatform: boolean}>>([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [isOnPlatform, setIsOnPlatform] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const groundYRef = useRef<number>(0);
  const obstacleGenerationRef = useRef<number>(0);

  // Initialize ground position when component mounts or gameArea changes
  useEffect(() => {
    if (gameAreaRef.current) {
      const gameHeight = gameAreaRef.current.clientHeight;
      const groundY = gameHeight - PLAYER_HEIGHT - GROUND_HEIGHT;
      groundYRef.current = groundY;
      setPlayerY(groundY); // Start on ground
    }
  }, [gameAreaRef.current]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDistanceTraveled(0);
    setPlayerVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    lastTimeRef.current = 0;
    frameCountRef.current = 0;
    obstacleGenerationRef.current = 0;
    
    // Make sure player starts on ground
    if (gameAreaRef.current) {
      const gameHeight = gameAreaRef.current.clientHeight;
      const groundY = gameHeight - PLAYER_HEIGHT - GROUND_HEIGHT;
      groundYRef.current = groundY;
      setPlayerY(groundY);
    }
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
    
    if (!isJumping || isOnPlatform) {
      setPlayerVelocity(JUMP_FORCE);
      setIsJumping(true);
      setIsOnPlatform(false);
    }
  };

  // Generate random obstacle type
  const generateObstacleType = () => {
    const types = ['spike', 'block', 'saw'];
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
  };

  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (!isPlaying || gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Increase distance traveled (progress meter)
    setDistanceTraveled(prev => prev + GAME_SPEED);

    // Reset isOnPlatform for this frame
    let onPlatformThisFrame = false;
    
    // Check if player is on a platform
    const playerLeft = 100;
    const playerRight = playerLeft + PLAYER_WIDTH;
    const playerBottom = playerY + PLAYER_HEIGHT;
    
    const gameHeight = gameAreaRef.current?.clientHeight || 400;

    // Check if player is on any platform
    obstacles.forEach(obstacle => {
      if (obstacle.type === 'block') {
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;
        const obstacleTop = gameHeight - GROUND_HEIGHT - obstacle.height;
        
        // Check if player is directly above the platform and within horizontal bounds
        if (
          playerRight > obstacleLeft &&
          playerLeft < obstacleRight &&
          Math.abs(playerBottom - obstacleTop) < 5 && // Within 5px of platform top
          playerVelocity >= 0 // Moving downward
        ) {
          onPlatformThisFrame = true;
          setPlayerY(obstacleTop - PLAYER_HEIGHT);
          setPlayerVelocity(0);
        }
      }
    });

    setIsOnPlatform(onPlatformThisFrame);
    
    // Update player position if not on a platform
    if (!onPlatformThisFrame) {
      setPlayerY(prevY => {
        const newY = prevY + playerVelocity;
        
        if (newY >= groundYRef.current) {
          setIsJumping(false);
          setPlayerVelocity(0);
          return groundYRef.current;
        }
        
        return newY;
      });
      
      // Apply gravity if jumping or falling
      if (isJumping) {
        setPlayerVelocity(prev => prev + GRAVITY);
      }
    }
    
    // Generate obstacles more rhythmically
    obstacleGenerationRef.current += GAME_SPEED;
    if (obstacleGenerationRef.current >= OBSTACLE_GAP) {
      obstacleGenerationRef.current = 0;
      
      const gameWidth = gameAreaRef.current?.clientWidth || 600;
      
      // Randomly determine obstacle type and height
      const obstacleHeight = Math.floor(Math.random() * 50) + 50; // Random height
      const obstacleWidth = OBSTACLE_WIDTH;
      const obstacleType = generateObstacleType();
      
      // Determine if it's a high platform (unreachable) or a regular platform
      const isHighPlatform = Math.random() > 0.7; // 30% chance to be a high platform
      const finalHeight = isHighPlatform ? obstacleHeight + 100 : obstacleHeight;
      
      setObstacles(prevObstacles => [...prevObstacles, {
        x: gameWidth,
        height: finalHeight,
        width: obstacleWidth,
        passed: false,
        type: obstacleType,
        isHighPlatform
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
          
          // Check collision with spikes and saws, but not blocks
          if (obstacle.type !== 'block') {
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
  }, [isPlaying, gameOver, playerVelocity, isJumping, isOnPlatform]);

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
  }, [isPlaying, gameOver, isJumping, isOnPlatform]);

  // Calculate progress percentage (no limit since it's infinite)
  const progressPercentage = Math.min(100, Math.floor((distanceTraveled / 5000) * 100));

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-[#1EAEDB]">Dawg Dash</h1>
      
      <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto">
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">Score: {score}</p>
        </div>
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">Progress: {progressPercentage}%</p>
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
            zIndex: 20,
            transform: isJumping ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.1s ease-out'
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
            className={`absolute border-2 border-black rounded-md ${
              obstacle.type === 'spike' ? 'bg-red-500' : 
              obstacle.type === 'saw' ? 'bg-gray-400 rounded-full' : 
              obstacle.isHighPlatform ? 'bg-sky-700' : 'bg-[#8b5cf6]'
            }`}
            style={{
              left: `${obstacle.x}px`,
              bottom: GROUND_HEIGHT,
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
              // For spike, use clip path to create triangle
              clipPath: obstacle.type === 'spike' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            }}
          ></div>
        ))}
        
        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
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
        <p className="text-md mt-2">Stand on purple platforms and jump over obstacles!</p>
      </div>
    </div>
  );
};

export default DawgDash;
