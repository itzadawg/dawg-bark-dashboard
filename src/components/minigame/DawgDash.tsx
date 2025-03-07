
import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import GameOverModal from './GameOverModal';
import Player from './Player';
import Ground from './Ground';
import ObstacleRenderer from './ObstacleRenderer';
import ScoreDisplay from './ScoreDisplay';
import { GROUND_HEIGHT } from './utils/gameConstants';
import { useGameLoop } from './hooks/useGameLoop';

const DawgDash: React.FC = () => {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const groundYRef = useRef<number>(0);
  
  // Initialize ground position when component mounts
  useEffect(() => {
    if (gameAreaRef.current) {
      const gameHeight = gameAreaRef.current.clientHeight;
      const groundY = gameHeight - 60 - GROUND_HEIGHT; // 60 is PLAYER_HEIGHT
      groundYRef.current = groundY;
    }
  }, [gameAreaRef.current]);
  
  const {
    isPlaying,
    gameOver,
    score,
    highScore,
    playerY,
    obstacles,
    startGame,
    closeGameOver,
    jump,
    setGameAreaRef
  } = useGameLoop(groundYRef.current);
  
  // Update the gameAreaRef when it changes
  useEffect(() => {
    if (gameAreaRef.current) {
      setGameAreaRef(gameAreaRef.current);
    }
  }, [gameAreaRef.current]);
  
  // Add keyboard event listener for jumping
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
      <h1 className="text-4xl font-black mb-6 text-center text-[#1EAEDB]">Dawg Dash</h1>
      
      <ScoreDisplay score={score} highScore={highScore} />
      
      <div 
        ref={gameAreaRef}
        className="neo-brutal-border relative mx-auto bg-gradient-to-b from-sky-300 to-sky-500 overflow-hidden"
        style={{ width: '600px', height: '400px', cursor: 'pointer' }}
        onClick={jump}
      >
        {/* Player */}
        <Player y={playerY} />
        
        {/* Ground */}
        <Ground />
        
        {/* Obstacles */}
        <ObstacleRenderer obstacles={obstacles} />
        
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
