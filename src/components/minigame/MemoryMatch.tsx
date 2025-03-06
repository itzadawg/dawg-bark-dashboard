
import React from 'react';
import { Trophy } from 'lucide-react';

const MemoryMatch: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-[#4cc9f0]">Memory Match</h1>
      <p className="text-lg text-center mb-8">
        Test your memory by matching pairs of cards!
      </p>
      
      <div className="neo-brutal-box p-12 flex flex-col items-center justify-center max-w-xl mx-auto">
        <Trophy size={80} className="mb-6 text-[#4cc9f0]" />
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="text-gray-600 mb-6">This game is under development. Check back later!</p>
      </div>
    </div>
  );
};

export default MemoryMatch;
