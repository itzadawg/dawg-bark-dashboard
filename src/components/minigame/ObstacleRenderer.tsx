
import React from 'react';
import { Obstacle } from './types/gameTypes';
import { COIN_SIZE } from './utils/gameConstants';

interface ObstacleRendererProps {
  obstacles: Obstacle[];
  gameHeight: number;
}

const ObstacleRenderer: React.FC<ObstacleRendererProps> = ({ obstacles, gameHeight }) => {
  return (
    <>
      {obstacles.map((obstacle) => {
        if (obstacle.type === 'platform') {
          return (
            <div
              key={obstacle.id}
              className="absolute bg-[#8a6d4b] border-2 border-black"
              style={{
                left: `${obstacle.x}px`,
                bottom: `${obstacle.height}px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
              }}
            />
          );
        } else if (obstacle.type === 'hazard') {
          // Hazard (spikes)
          return (
            <div
              key={obstacle.id}
              className="absolute"
              style={{
                left: `${obstacle.x}px`,
                bottom: `0px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
              }}
            >
              <div className="flex justify-around w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-red-600 border border-black" 
                    style={{ 
                      height: `${obstacle.height * 0.8}px',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  />
                ))}
              </div>
            </div>
          );
        } else {
          // Coin
          return (
            <div
              key={obstacle.id}
              className="absolute animate-bounce"
              style={{
                left: `${obstacle.x}px`,
                bottom: `${obstacle.height}px`,
                width: `${COIN_SIZE}px`,
                height: `${COIN_SIZE}px`,
                zIndex: 10
              }}
            >
              <div className="w-full h-full rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center shadow-lg animate-spin-slow">
                <div className="text-yellow-800 font-bold text-sm">$</div>
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default ObstacleRenderer;
