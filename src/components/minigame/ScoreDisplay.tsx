
import React from 'react';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center mb-4 max-w-2xl mx-auto">
      <div className="neo-brutal-box p-3">
        <p className="text-lg font-bold">Score: {score}</p>
      </div>
      <div className="neo-brutal-box p-3">
        <p className="text-lg font-bold">High Score: {highScore}</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
