
import React from 'react';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from './utils/gameConstants';

interface PlayerProps {
  y: number;
}

const Player: React.FC<PlayerProps> = ({ y }) => {
  return (
    <div
      className="absolute transition-transform"
      style={{
        left: '100px',
        top: `${y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        zIndex: 20
      }}
    >
      <img 
        src="/lovable-uploads/d4d58344-3817-4b81-a535-e7fd84d0e807.png" 
        alt="Dawg" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Player;
