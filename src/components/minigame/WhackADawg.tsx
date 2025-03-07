import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import GameOverModal from './GameOverModal';

interface Hole {
  id: number;
  active: boolean;
  whacked: boolean;
}

const WhackADawg: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [holes, setHoles] = useState<Hole[]>(
    Array(9).fill(null).map((_, index) => ({
      id: index,
      active: false,
      whacked: false
    }))
  );
  
  const gameIntervalRef = useRef<number | null>(null);
  const popupIntervalRef = useRef<number | null>(null);
  
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
    setHoles(Array(9).fill(null).map((_, index) => ({
      id: index,
      active: false,
      whacked: false
    })));
    
    gameIntervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    popupIntervalRef.current = window.setInterval(() => {
      showRandomDawg();
    }, 850);
  };
  
  const endGame = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
    
    setIsPlaying(false);
    setGameOver(true);
    
    if (score > highScore) {
      setHighScore(score);
      toast({
        title: "New High Score!",
        description: `You scored ${score} points!`,
      });
    }
  };
  
  const closeGameOver = () => {
    setGameOver(false);
  };
  
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
    };
  }, []);
  
  const showRandomDawg = () => {
    setHoles(prev => 
      prev.map(hole => 
        hole.whacked ? { ...hole, active: false, whacked: false } : hole
      )
    );
    
    const inactiveHoles = holes.filter(hole => !hole.active && !hole.whacked);
    
    if (inactiveHoles.length > 0) {
      const randomIndex = Math.floor(Math.random() * inactiveHoles.length);
      const randomHoleId = inactiveHoles[randomIndex].id;
      
      setHoles(prev => 
        prev.map(hole => 
          hole.id === randomHoleId 
            ? { ...hole, active: true } 
            : hole
        )
      );
      
      setTimeout(() => {
        setHoles(prev => 
          prev.map(hole => 
            hole.id === randomHoleId && hole.active && !hole.whacked
              ? { ...hole, active: false }
              : hole
          )
        );
      }, 1500);
    }
  };
  
  const whackDawg = (id: number) => {
    if (!isPlaying) return;
    
    const targetHole = holes.find(hole => hole.id === id);
    
    if (targetHole && targetHole.active && !targetHole.whacked) {
      setScore(prev => prev + 1);
      
      setHoles(prev => 
        prev.map(hole => 
          hole.id === id 
            ? { ...hole, whacked: true } 
            : hole
        )
      );
    }
  };
  
  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-dawg">Whack-A-Dawg</h1>
      <p className="text-lg text-center mb-8">
        Whack the dawgs as they pop up! Score as many points as you can in 30 seconds.
      </p>
      
      <div className="flex justify-between items-center mb-4 max-w-md mx-auto">
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">Score: {score}</p>
        </div>
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">Time: {timeLeft}s</p>
        </div>
        <div className="neo-brutal-box p-3">
          <p className="text-lg font-bold">High: {highScore}</p>
        </div>
      </div>
      
      <div className="neo-brutal-border p-6 max-w-xl mx-auto bg-dawg-secondary relative">
        {!isPlaying && !gameOver && (
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
            <Button 
              onClick={startGame}
              className="neo-brutal-button bg-dawg hover:bg-dawg-accent text-dawg-dark"
            >
              Start Game
            </Button>
          </div>
        )}
        
        {gameOver && (
          <GameOverModal 
            score={score} 
            highScore={highScore} 
            onRestart={startGame} 
            onClose={closeGameOver}
          />
        )}
        
        <div className="grid grid-cols-3 gap-4">
          {holes.map((hole) => (
            <div 
              key={hole.id} 
              className={`aspect-square relative bg-dawg-accent/30 rounded-full overflow-hidden border-4 border-black ${
                hole.whacked ? 'ring-4 ring-offset-2 ring-green-500 ring-opacity-75 transition-all duration-300' : ''
              }`}
              onClick={() => whackDawg(hole.id)}
            >
              <div 
                className={`absolute inset-0 bg-dawg-light rounded-b-full transition-all duration-200 ease-out ${
                  hole.active ? 'bottom-0' : 'bottom-full'
                }`}
              >
                {/* Grass/hole cover */}
              </div>
              <div 
                className={`absolute left-0 right-0 bottom-0 flex items-center justify-center transition-all duration-200 ease-out cursor-pointer ${
                  hole.active ? 'translate-y-[20%]' : 'translate-y-full'
                }`}
              >
                <img 
                  src="/lovable-uploads/9b1ad62d-7684-4c97-bbea-929b0be4d290.png"
                  alt="Dawg" 
                  className={`w-3/4 transform ${hole.whacked ? 'rotate-12 brightness-110' : ''}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhackADawg;
