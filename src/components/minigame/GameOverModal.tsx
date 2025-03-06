
import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, highScore, onRestart }) => {
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
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="w-full max-w-md p-6 neo-brutal-box bg-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-white p-1 neo-brutal-border">
            <img 
              src="/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.png" 
              alt="Dawg" 
              className="w-full h-full object-cover rounded-full"
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
  );
};

export default GameOverModal;
