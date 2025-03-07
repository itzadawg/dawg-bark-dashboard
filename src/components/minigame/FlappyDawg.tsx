import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import GameOverModal from './GameOverModal';

const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const DAWG_WIDTH = 60;
const DAWG_HEIGHT = 60;
const HITBOX_OFFSET_X = 15;
const HITBOX_OFFSET_Y = 15;
const HITBOX_WIDTH = DAWG_WIDTH - (HITBOX_OFFSET_X * 2);
const HITBOX_HEIGHT = DAWG_HEIGHT - (HITBOX_OFFSET_Y * 2);

const FlappyDawg: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [dawgPosition, setDawgPosition] = useState(250);
  const [dawgVelocity, setDawgVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{x: number, height: number, passed: boolean}>>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setDawgPosition(250);
    setDawgVelocity(0);
    setPipes([]);
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
    
    setDawgVelocity(JUMP_FORCE);
  };

  const gameLoop = (timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    if (!isPlaying || gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    setDawgPosition(prevPos => {
      const newPos = prevPos + dawgVelocity;
      
      if (newPos < 0 || newPos > (gameAreaRef.current?.clientHeight || 500) - DAWG_HEIGHT) {
        setGameOver(true);
        setIsPlaying(false);
        setHighScore(prev => Math.max(prev, score));
        return prevPos;
      }
      
      return newPos;
    });
    
    setDawgVelocity(prev => prev + GRAVITY);
    
    frameCountRef.current += 1;
    if (frameCountRef.current % 100 === 0) {
      const height = Math.floor(Math.random() * 200) + 100;
      setPipes(prevPipes => [...prevPipes, {
        x: gameAreaRef.current?.clientWidth || 600,
        height,
        passed: false
      }]);
    }
    
    setPipes(prevPipes => {
      const updatedPipes = prevPipes
        .map(pipe => {
          const newX = pipe.x - PIPE_SPEED;
          
          if (!pipe.passed && newX + PIPE_WIDTH < 100) {
            setScore(prev => prev + 1);
            return { ...pipe, x: newX, passed: true };
          }
          
          const dawgHitboxLeft = 100 + HITBOX_OFFSET_X;
          const dawgHitboxRight = dawgHitboxLeft + HITBOX_WIDTH;
          const dawgHitboxTop = dawgPosition + HITBOX_OFFSET_Y;
          const dawgHitboxBottom = dawgHitboxTop + HITBOX_HEIGHT;
          
          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;
          
          const topPipeBottom = pipe.height;
          const bottomPipeTop = pipe.height + PIPE_GAP;
          
          if (
            dawgHitboxRight > pipeLeft && 
            dawgHitboxLeft < pipeRight && 
            (dawgHitboxTop < topPipeBottom || dawgHitboxBottom > bottomPipeTop)
          ) {
            setGameOver(true);
            setIsPlaying(false);
            setHighScore(prev => Math.max(prev, score));
          }
          
          return { ...pipe, x: newX };
        })
        .filter(pipe => pipe.x > -PIPE_WIDTH);
      
      return updatedPipes;
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
  }, [isPlaying, gameOver, dawgVelocity]);

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
  }, [isPlaying, gameOver]);

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
        className="neo-brutal-border relative mx-auto bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden"
        style={{ width: '600px', height: '500px', cursor: 'pointer' }}
        onClick={jump}
      >
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
        </div>
        
        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute bg-green-500 rounded-b-lg border-2 border-black"
              style={{
                left: `${pipe.x}px`,
                top: 0,
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.height}px`,
              }}
            />
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
                <h2 className="text-2xl font-bold mb-4">Flappy Dawg</h2>
                <p className="mb-4">Click or press Space to start!</p>
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
        <p className="text-lg">Click or press Space to make the dawg jump!</p>
      </div>
    </div>
  );
};

export default FlappyDawg;
