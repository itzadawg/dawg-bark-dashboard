
import React from 'react';
import { GROUND_HEIGHT } from './utils/gameConstants';

const Ground: React.FC = () => {
  return (
    <div 
      className="absolute bottom-0 w-full bg-[#a67c52] border-t-2 border-black"
      style={{ height: `${GROUND_HEIGHT}px` }}
    ></div>
  );
};

export default Ground;
