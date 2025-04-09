
import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../../hooks/use-mobile';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameOverScreen from './GameOverScreen';
import Leaderboard from './Leaderboard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Trophy } from 'lucide-react';

const DawgPacGame: React.FC = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const { isMobile } = useWindowSize();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const handleGameOver = (finalScore: number) => {
    setGameOver(true);
  };
  
  const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setLives(3);
    setLevel(1);
  };
  
  const updateScore = (points: number) => {
    setScore(prevScore => prevScore + points);
  };
  
  const updateLives = (change: number) => {
    setLives(prevLives => {
      const newLives = prevLives + change;
      if (newLives <= 0) {
        handleGameOver(score);
      }
      return newLives;
    });
  };
  
  const updateLevel = () => {
    setLevel(prevLevel => prevLevel + 1);
  };
  
  return (
    <div className="w-full h-full flex flex-col" ref={gameContainerRef}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div className="neo-brutal-box p-2 px-4">
            <span className="font-bold">Score: {score}</span>
          </div>
          <div className="neo-brutal-box p-2 px-4">
            <span className="font-bold">Lives: {lives}</span>
          </div>
          <div className="neo-brutal-box p-2 px-4">
            <span className="font-bold">Level: {level}</span>
          </div>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <button className="neo-brutal-button flex items-center gap-2">
              <Trophy size={16} />
              <span>Leaderboard</span>
            </button>
          </SheetTrigger>
          <SheetContent>
            <Leaderboard currentScore={score} />
          </SheetContent>
        </Sheet>
      </div>
      
      {gameOver ? (
        <GameOverScreen 
          score={score} 
          onRestart={resetGame} 
          onMainMenu={() => {}} 
        />
      ) : (
        <div className="flex-1 flex flex-col">
          <GameBoard
            updateScore={updateScore}
            updateLives={updateLives}
            updateLevel={updateLevel}
            level={level}
          />
          {isMobile && (
            <GameControls />
          )}
        </div>
      )}
    </div>
  );
};

export default DawgPacGame;
