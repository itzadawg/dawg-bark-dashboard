
import React, { useRef, useEffect } from 'react';
import { Trophy, RefreshCw, X, Award, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameDifficulty } from './types/gameTypes';

interface GameOverModalProps {
  score: number;
  highScore: number;
  level: number;
  coins: number;
  difficulty: GameDifficulty;
  onRestart: (difficulty: GameDifficulty) => void;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ 
  score, 
  highScore, 
  level,
  coins,
  difficulty,
  onRestart, 
  onClose 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  let message = "Nice try!";
  let achievement = "";
  
  if (score === 0) {
    message = "Better luck next time!";
  } else if (score >= highScore && score > 50) {
    message = "Amazing job! New high score!";
    achievement = "High Score Champion";
  } else if (level >= 3) {
    message = "Wow! You're a natural!";
    achievement = "Level Master";
  } else if (coins >= 10) {
    message = "Impressive coin collection!";
    achievement = "Coin Collector";
  } else if (score > 20) {
    message = "Good job!";
  }
  
  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="w-full max-w-md p-6 bg-white neo-brutal-border shadow-brutal relative" 
        style={{ transform: 'none', pointerEvents: 'auto' }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden neo-brutal-border bg-gradient-to-r from-amber-300 to-yellow-500 flex items-center justify-center">
            <img 
              src="/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.png" 
              alt="Dawg" 
              className="w-3/4 h-3/4 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <p className="text-lg mb-2">{message}</p>
          
          {achievement && (
            <div className="mb-4 flex items-center justify-center gap-2 text-amber-600">
              <Award size={18} />
              <p className="font-semibold">{achievement}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center neo-brutal-box p-3">
              <div className="flex items-center justify-center gap-1">
                <Trophy size={16} className="text-dawg" />
                <p className="text-sm text-gray-600">Score</p>
              </div>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="text-center neo-brutal-box p-3">
              <div className="flex items-center justify-center gap-1">
                <Trophy size={16} className="text-orange-500" />
                <p className="text-sm text-gray-600">High Score</p>
              </div>
              <p className="text-3xl font-bold">{highScore}</p>
            </div>
            <div className="text-center neo-brutal-box p-3">
              <div className="flex items-center justify-center gap-1">
                <CreditCard size={16} className="text-yellow-500" />
                <p className="text-sm text-gray-600">Coins</p>
              </div>
              <p className="text-3xl font-bold">{coins}</p>
            </div>
            <div className="text-center neo-brutal-box p-3">
              <div className="flex items-center justify-center gap-1">
                <Award size={16} className="text-purple-500" />
                <p className="text-sm text-gray-600">Level</p>
              </div>
              <p className="text-3xl font-bold">{level}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => onRestart(difficulty)}
              className="neo-brutal-button bg-dawg hover:bg-dawg-accent text-white flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
