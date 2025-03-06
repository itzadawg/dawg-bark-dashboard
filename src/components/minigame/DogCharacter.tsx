
import React, { useState, useEffect } from 'react';
import { Dog } from 'lucide-react';

interface DogCharacterProps {
  id: number;
  x: number;
  y: number;
  speed: number;
  onCatch: (id: number) => void;
}

const DogCharacter: React.FC<DogCharacterProps> = ({ id, x, y, speed, onCatch }) => {
  const [position, setPosition] = useState({ x, y });
  const [direction, setDirection] = useState({ x: Math.random() > 0.5 ? 1 : -1, y: Math.random() > 0.5 ? 1 : -1 });
  
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        // Random direction change occasionally
        if (Math.random() < 0.05) {
          setDirection(prev => ({
            x: Math.random() > 0.5 ? 1 : -1,
            y: Math.random() > 0.5 ? 1 : -1
          }));
        }
        
        const newX = prev.x + direction.x * speed;
        const newY = prev.y + direction.y * speed;
        
        // Bounce off edges
        let newDirX = direction.x;
        let newDirY = direction.y;
        
        if (newX < 0 || newX > 750) {
          newDirX = -direction.x;
          setDirection(prev => ({ ...prev, x: newDirX }));
        }
        
        if (newY < 0 || newY > 350) {
          newDirY = -direction.y;
          setDirection(prev => ({ ...prev, y: newDirY }));
        }
        
        return {
          x: Math.max(0, Math.min(750, newX)),
          y: Math.max(0, Math.min(350, newY))
        };
      });
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [speed, direction]);
  
  const handleClick = () => {
    onCatch(id);
  };
  
  return (
    <div
      className="absolute cursor-pointer transform transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: direction.x > 0 ? 'scaleX(1)' : 'scaleX(-1)',
      }}
      onClick={handleClick}
    >
      <div className="neo-brutal-border bg-dawg p-2 rounded-full">
        <Dog size={24} className="text-dawg-dark" />
      </div>
    </div>
  );
};

export default DogCharacter;
