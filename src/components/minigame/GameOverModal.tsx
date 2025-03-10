
import React from 'react';
import { Button } from '@/components/ui/button';

export interface GameOverModalProps {
  score: number;
  highScore: number;
  level?: number;
  coins?: number;
  difficulty?: string;
  onRestart: () => void;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  score, 
  highScore, 
  level = 1, 
  coins = 0, 
  difficulty = 'normal',
  onRestart, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white neo-brutal-box p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-dawg-dark">Game Over!</h2>
        <div className="space-y-4 mb-6">
          <p className="text-xl">Score: <span className="font-bold">{score}</span></p>
          <p className="text-lg">High Score: <span className="font-bold">{highScore}</span></p>
          {level && <p className="text-lg">Level Reached: <span className="font-bold">{level}</span></p>}
          {coins > 0 && <p className="text-lg">Coins Collected: <span className="font-bold">{coins}</span></p>}
          {difficulty && <p className="text-lg">Difficulty: <span className="font-bold capitalize">{difficulty}</span></p>}
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={onRestart}
            className="flex-1 bg-dawg hover:bg-dawg-secondary neo-brutal-border"
          >
            Play Again
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1 neo-brutal-border"
          >
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
