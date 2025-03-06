
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const DAWG_WIDTH = 60;
const DAWG_HEIGHT = 60;
// Define a smaller hitbox for collision detection
const HITBOX_OFFSET_X = 15; // pixels from left side
const HITBOX_OFFSET_Y = 15; // pixels from top
const HITBOX_WIDTH = DAWG_WIDTH - (HITBOX_OFFSET_X * 2); // smaller than the actual image
const HITBOX_HEIGHT = DAWG_HEIGHT - (HITBOX_OFFSET_Y * 2); // smaller than the actual image

const FlappyDawg: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dawgPosition, setDawgPosition] = useState(250);
  const [dawgVelocity, setDawgVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{x: number, height: number, passed: boolean}>>([]);
  const [isColliding, setIsColliding] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Initialize the game
  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDawgPosition(250);
    setDawgVelocity(0);
    setPipes([]);
    setIsColliding(false);
    lastTimeRef.current = 0;
    frameCountRef.current = 0;
  };

  // Handle jump action
  const jump = () => {
    if (gameOver) return;
    
    if (!isPlaying) {
      startGame();
      return;
    }
    
    // Only allow jumping if not colliding with a pipe
    if (!isColliding) {
      setDawgVelocity(JUMP_FORCE);
    }
  };

  // Game animation loop
  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (!isPlaying || gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    // Check if dawg is currently colliding
    let currentlyColliding = false;
    let gameOverNow = false;

    // Check if dawg would hit ceiling or floor next frame
    const nextPosition = dawgPosition + dawgVelocity;
    if (nextPosition < 0 || nextPosition > (gameAreaRef.current?.clientHeight || 500) - DAWG_HEIGHT) {
      setGameOver(true);
      setIsPlaying(false);
      setHighScore(prev => Math.max(prev, score));
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Update dawg position with gravity only if not colliding
    if (!isColliding) {
      setDawgPosition(prevPos => {
        return prevPos + dawgVelocity;
      });
      
      // Update dawg velocity (gravity)
      setDawgVelocity(prev => prev + GRAVITY);
    }
    
    // Generate new pipes
    frameCountRef.current += 1;
    if (frameCountRef.current % 100 === 0) {
      const height = Math.floor(Math.random() * 200) + 100;
      setPipes(prevPipes => [...prevPipes, {
        x: gameAreaRef.current?.clientWidth || 600,
        height,
        passed: false
      }]);
    }
    
    // Update pipes position and check collisions
    setPipes(prevPipes => {
      const updatedPipes = prevPipes
        .map(pipe => {
          // Only move pipes if the dawg is not colliding
          const newX = isColliding ? pipe.x : pipe.x - PIPE_SPEED;
          
          // Check if dawg passed the pipe
          if (!pipe.passed && newX + PIPE_WIDTH < 100) {
            setScore(prev => prev + 1);
            return { ...pipe, x: newX, passed: true };
          }
          
          // Use hitbox for collision detection instead of full image dimensions
          const dawgHitboxLeft = 100 + HITBOX_OFFSET_X;
          const dawgHitboxRight = dawgHitboxLeft + HITBOX_WIDTH;
          const dawgHitboxTop = dawgPosition + HITBOX_OFFSET_Y;
          const dawgHitboxBottom = dawgHitboxTop + HITBOX_HEIGHT;
          
          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;
          
          const topPipeBottom = pipe.height;
          const bottomPipeTop = pipe.height + PIPE_GAP;
          
          // Check for collision with pipes
          if (
            dawgHitboxRight > pipeLeft && 
            dawgHitboxLeft < pipeRight && 
            (dawgHitboxTop < topPipeBottom || dawgHitboxBottom > bottomPipeTop)
          ) {
            currentlyColliding = true;
            
            // If we've been colliding for a few frames, end the game
            if (isColliding) {
              gameOverNow = true;
            }
          }
          
          return { ...pipe, x: newX };
        })
        .filter(pipe => pipe.x > -PIPE_WIDTH); // Remove pipes that are off-screen
      
      return updatedPipes;
    });
    
    // Update collision state
    setIsColliding(currentlyColliding);
    
    // End game if needed
    if (gameOverNow) {
      setGameOver(true);
      setIsPlaying(false);
      setHighScore(prev => Math.max(prev, score));
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  // Set up and clean up the game loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, gameOver, dawgVelocity, isColliding]); // Added isColliding to dependencies

  // Handle keyboard input
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
  }, [isPlaying, gameOver, isColliding]); // Added isColliding to dependencies

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-[#4cc9f0]">Flappy Dawg</h1>
      
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
        className="neo-brutal-box relative mx-auto bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden"
        style={{ width: '600px', height: '500px', cursor: 'pointer' }}
        onClick={jump}
      >
        {/* Game character */}
        <div
          className="absolute transition-transform"
          style={{
            left: '100px',
            top: `${dawgPosition}px`,
            width: `${DAWG_WIDTH}px`,
            height: `${DAWG_HEIGHT}px`,
            transform: `rotate(${dawgVelocity * 2}deg)`,
            zIndex: 20
          }}
        >
          <img 
            src="/lovable-uploads/d4d58344-3817-4b81-a535-e7fd84d0e807.png" 
            alt="Flappy Dawg" 
            className="w-full h-full object-contain"
          />
          
          {/* Debug hitbox - uncomment to see the hitbox
          <div
            className="absolute border-2 border-red-500 opacity-50"
            style={{
              left: `${HITBOX_OFFSET_X}px`,
              top: `${HITBOX_OFFSET_Y}px`,
              width: `${HITBOX_WIDTH}px`,
              height: `${HITBOX_HEIGHT}px`,
            }}
          />
          */}
        </div>
        
        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500 rounded-b-lg border-2 border-black"
              style={{
                left: `${pipe.x}px`,
                top: 0,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.height}px`,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500 rounded-t-lg border-2 border-black"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.height + PIPE_GAP}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${(gameAreaRef.current?.clientHeight || 500) - (pipe.height + PIPE_GAP)}px`,
              }}
            />
          </React.Fragment>
        ))}
        
        {/* Start/Game Over message */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded-lg neo-brutal-box">
              <h2 className="text-2xl font-bold mb-4">
                {gameOver ? 'Game Over!' : 'Flappy Dawg'}
              </h2>
              <p className="mb-4">
                {gameOver 
                  ? `Your score: ${score}`
                  : 'Click or press Space to start!'}
              </p>
              <Button 
                onClick={startGame}
                className="neo-brutal-button"
              >
                {gameOver ? 'Play Again' : 'Start Game'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg">Click or press Space to make the dawg jump!</p>
      </div>
    </div>
  );
};

export default FlappyDawg;
