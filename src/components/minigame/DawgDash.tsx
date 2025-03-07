
import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Play, Info } from 'lucide-react';
import GameOverModal from './GameOverModal';
import Player from './Player';
import Ground from './Ground';
import ObstacleRenderer from './ObstacleRenderer';
import ScoreDisplay from './ScoreDisplay';
import DifficultySelector from './DifficultySelector';
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
  }, []);
  
  const {
    gameState,
    playerState,
    obstacles,
    difficulty,
    backgroundClass,
    startGame,
    closeGameOver,
    jump,
    setDifficulty,
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
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
        Dawg Dash
      </h1>
      
      <ScoreDisplay 
        score={gameState.score} 
        highScore={gameState.highScore} 
        level={gameState.level}
        coins={gameState.coins}
      />
      
      <div 
        ref={gameAreaRef}
        className={`neo-brutal-border relative mx-auto bg-gradient-to-b ${backgroundClass} overflow-hidden`}
        style={{ width: '600px', height: '400px', cursor: 'pointer' }}
        onClick={jump}
      >
        {/* Player */}
        <Player 
          y={playerState.y} 
          isInvincible={playerState.isInvincible}
          velocity={playerState.velocity}
        />
        
        {/* Ground */}
        <Ground level={gameState.level} />
        
        {/* Obstacles */}
        {gameAreaRef.current && (
          <ObstacleRenderer 
            obstacles={obstacles} 
            gameHeight={gameAreaRef.current.clientHeight}
          />
        )}
        
        {/* Level indicator */}
        {gameState.isPlaying && (
          <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-md text-sm font-semibold">
            Level {gameState.level}
          </div>
        )}
        
        {/* Coin indicator */}
        {gameState.isPlaying && gameState.coins > 0 && (
          <div className="absolute top-2 right-2 bg-yellow-400 px-2 py-1 rounded-full text-sm font-semibold flex items-center">
            <span className="mr-1">×{gameState.coins}</span>
            <div className="w-4 h-4 rounded-full bg-yellow-300 border border-yellow-600 flex items-center justify-center">
              <span className="text-yellow-800 text-xs">$</span>
            </div>
          </div>
        )}
        
        {/* Game UI Overlay */}
        {!gameState.isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-30">
            {gameState.gameOver ? (
              <GameOverModal 
                score={gameState.score} 
                highScore={gameState.highScore}
                level={gameState.level}
                coins={gameState.coins}
                difficulty={difficulty}
                onRestart={startGame}
                onClose={closeGameOver}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg neo-brutal-box">
                <h2 className="text-2xl font-bold mb-2">Dawg Dash</h2>
                <p className="mb-4">Jump over obstacles, collect coins and reach new levels!</p>
                
                <DifficultySelector 
                  selectedDifficulty={difficulty}
                  onSelectDifficulty={setDifficulty}
                />
                
                <Button 
                  onClick={() => startGame(difficulty)}
                  className="neo-brutal-button bg-dawg hover:bg-dawg-accent text-white w-full flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Start Game
                </Button>
                
                <div className="mt-4 text-sm text-gray-600 flex items-center gap-1 justify-center">
                  <Info size={14} />
                  <span>Press Space or click to jump</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-lg">Press Space or click to jump! Avoid hazards and collect coins.</p>
      </div>
    </div>
  );
};

export default DawgDash;
