
import React, { useState, useEffect, useRef } from 'react';
import { Target, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import DogCharacter from './DogCharacter';
import GameOverModal from './GameOverModal';

const DogCatcher = () => {
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dogs, setDogs] = useState<Array<{id: number, x: number, y: number, speed: number}>>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('dawgCatcherHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameTimerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const nextIdRef = useRef(1);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setDogs([]);
    setShowGameOver(false);
    nextIdRef.current = 1;

    // Start timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    
    gameTimerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    spawnTimerRef.current = window.setInterval(spawnDog, 1000);
    
    toast({
      title: "Game Started!",
      description: "Catch those dawgs!",
    });
  };

  const endGame = () => {
    setGameActive(false);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('dawgCatcherHighScore', score.toString());
      toast({
        title: "New High Score!",
        description: `You set a new record: ${score}!`,
      });
    }
    
    setShowGameOver(true);
  };

  const spawnDog = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const maxX = gameArea.width - 50;
    const maxY = gameArea.height - 50;
    
    const newDog = {
      id: nextIdRef.current++,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      speed: 1 + Math.random() * 2,
    };
    
    setDogs(prev => [...prev, newDog]);
    
    // Limit max dogs
    if (dogs.length > 12) {
      setDogs(prev => prev.slice(1));
    }
  };

  const catchDog = (id: number) => {
    setDogs(prev => prev.filter(dog => dog.id !== id));
    setScore(prev => prev + 1);
    
    // Play sound or visual feedback
    if (score % 5 === 4) {
      toast({
        title: "Good job!",
        description: "You're on a roll!",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-4 flex justify-between items-center p-4 neo-brutal-border bg-white">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-dawg" />
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-dawg" />
          <span className="font-bold">Best: {highScore}</span>
        </div>
        <div className={`font-bold ${timeLeft <= 10 ? 'text-dawg-red animate-pulse' : ''}`}>
          Time: {timeLeft}s
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="w-full max-w-3xl h-[400px] relative neo-brutal-border bg-white overflow-hidden"
      >
        {!gameActive && !showGameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dawg-light/80">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 neo-brutal-border bg-dawg p-2">
              <img 
                src="/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.png" 
                alt="Dawg" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to Catch Some Dawgs?</h2>
            <Button 
              onClick={startGame}
              className="neo-brutal-button"
            >
              Start Game
            </Button>
          </div>
        )}
        
        {gameActive && dogs.map(dog => (
          <DogCharacter 
            key={dog.id}
            id={dog.id}
            x={dog.x}
            y={dog.y}
            speed={dog.speed}
            onCatch={catchDog}
          />
        ))}
      </div>
      
      {showGameOver && (
        <GameOverModal 
          score={score} 
          highScore={highScore} 
          onRestart={startGame} 
        />
      )}
    </div>
  );
};

export default DogCatcher;
