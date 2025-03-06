
import React from 'react';
import { Dice1 } from 'lucide-react';

const BlockPuzzle: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-[#f15bb5]">Block Puzzle</h1>
      <p className="text-lg text-center mb-8">
        Solve puzzles by arranging blocks in the right pattern!
      </p>
      
      <div className="neo-brutal-box p-12 flex flex-col items-center justify-center max-w-xl mx-auto">
        <Dice1 size={80} className="mb-6 text-[#f15bb5]" />
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6">This game is under development. Check back later!</p>
      </div>
    </div>
  );
};

export default BlockPuzzle;
