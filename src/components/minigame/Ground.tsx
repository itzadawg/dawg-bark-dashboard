
import React from 'react';
import { GROUND_HEIGHT } from './utils/gameConstants';

interface GroundProps {
  level?: number;
}

const Ground: React.FC<GroundProps> = ({ level = 1 }) => {
  // Choose ground color based on level
  const getGroundColor = () => {
    const colors = [
      'bg-[#a67c52]', // Level 1
      'bg-[#8a6d4b]', // Level 2
      'bg-[#6d553d]', // Level 3
      'bg-[#5a4531]', // Level 4
      'bg-[#483626]', // Level 5+
    ];
    
    return colors[Math.min(level - 1, 4)];
  };
  
  return (
    <div 
      className={`absolute bottom-0 w-full ${getGroundColor()} border-t-2 border-black`}
      style={{ height: `${GROUND_HEIGHT}px` }}
    ></div>
  );
};

export default Ground;
