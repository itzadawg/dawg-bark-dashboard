
import React from 'react';
import { Trophy, CreditCard, Zap } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  level?: number;
  coins?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  highScore, 
  level = 1, 
  coins = 0 
}) => {
  return (
    <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto">
      <div className="neo-brutal-box p-3 flex items-center gap-2">
        <Trophy size={18} className="text-yellow-500" />
        <p className="text-lg font-bold">Score: {score}</p>
      </div>
      
      <div className="neo-brutal-box p-3 flex items-center gap-2">
        <Zap size={18} className="text-purple-500" />
        <p className="text-lg font-bold">Level: {level}</p>
      </div>
      
      <div className="neo-brutal-box p-3 flex items-center gap-2">
        <CreditCard size={18} className="text-yellow-500" />
        <p className="text-lg font-bold">Coins: {coins}</p>
      </div>
      
      <div className="neo-brutal-box p-3 flex items-center gap-2">
        <Trophy size={18} className="text-orange-500" />
        <p className="text-lg font-bold">Best: {highScore}</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
