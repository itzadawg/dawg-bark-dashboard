
import React from 'react';
import { Trophy } from 'lucide-react';

const MemoryMatch: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="neo-brutal-box p-12 flex flex-col items-center justify-center mx-auto">
        <Trophy size={80} className="text-[#4cc9f0]" />
      </div>
    </div>
  );
};

export default MemoryMatch;
