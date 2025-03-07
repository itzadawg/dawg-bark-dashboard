
import React from 'react';
import { Obstacle } from './types/gameTypes';

interface ObstacleRendererProps {
  obstacles: Obstacle[];
}

const ObstacleRenderer: React.FC<ObstacleRendererProps> = ({ obstacles }) => {
  return (
    <>
      {obstacles.map((obstacle, index) => (
        <div
          key={index}
          className={`absolute border-2 border-black rounded-md ${
            obstacle.type === 'platform' ? 'bg-[#8b5cf6]' : 'bg-[#ef4444]'
          }`}
          style={{
            left: `${obstacle.x}px`,
            bottom: 0,
            width: `${obstacle.width}px`,
            height: `${obstacle.height}px`,
          }}
        ></div>
      ))}
    </>
  );
};

export default ObstacleRenderer;
