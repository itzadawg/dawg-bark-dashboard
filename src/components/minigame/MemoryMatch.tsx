
import React, { useState, useEffect } from 'react';
import ScoreDisplay from './ScoreDisplay';
import { Trophy } from 'lucide-react';

const MemoryMatch: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  useEffect(() => {
    // Load high score from localStorage if available
    const savedHighScore = localStorage.getItem('memoryMatchHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <ScoreDisplay score={score} highScore={highScore} />
      
      <div className="neo-brutal-box p-12 flex flex-col items-center justify-center mx-auto my-8">
        <Trophy size={80} className="text-[#ffcc00] mb-4" />
        <h2 className="text-2xl font-bold mb-2">Memory Match Game</h2>
        <p className="text-center mb-4">Match pairs of cards before time runs out!</p>
        <p className="text-center text-gray-700">Game implementation coming soon</p>
      </div>
      
      <div className="mt-8 neo-brutal-box p-6">
        <h3 className="text-xl font-bold mb-4">How to Play:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Click on cards to flip them over</li>
          <li>Find matching pairs to earn points</li>
          <li>Complete the board before time runs out</li>
          <li>Earn bonus points for fast matches</li>
        </ul>
      </div>
    </div>
  );
};

export default MemoryMatch;
