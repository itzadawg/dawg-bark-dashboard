
import React, { useRef, useEffect } from 'react';
import { Trophy, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onClose: () => void; // Add onClose prop
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  let message = "Nice try!";
  
  if (score === 0) {
    message = "Better luck next time!";
  } else if (score >= highScore && score > 10) {
    message = "Amazing job! New high score!";
  } else if (score > 15) {
    message = "Wow! You're a natural!";
  } else if (score > 5) {
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
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
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden neo-brutal-border">
            <img 
              src="/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.png" 
              alt="Dawg" 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
          <p className="text-lg mb-4">{message}</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Your Score</p>
              <p className="text-3xl font-bold">{score}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Trophy size={16} className="text-dawg" />
                <p className="text-sm text-gray-600">High Score</p>
              </div>
              <p className="text-3xl font-bold">{highScore}</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={onRestart}
              className="neo-brutal-button flex items-center gap-2"
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
