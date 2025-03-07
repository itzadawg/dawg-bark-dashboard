
import React, { useEffect, useRef } from 'react';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from './utils/gameConstants';

interface PlayerProps {
  y: number;
  isInvincible?: boolean;
  velocity?: number;
}

const Player: React.FC<PlayerProps> = ({ y, isInvincible = false, velocity = 0 }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Add flashing effect during invincibility
  useEffect(() => {
    if (!playerRef.current) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isInvincible) {
      let visible = true;
      intervalId = setInterval(() => {
        if (playerRef.current) {
          playerRef.current.style.opacity = visible ? '0.5' : '1';
          visible = !visible;
        }
      }, 150);
    } else {
      playerRef.current.style.opacity = '1';
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (playerRef.current) playerRef.current.style.opacity = '1';
    };
  }, [isInvincible]);
  
  // Calculate rotation based on velocity
  const rotation = Math.min(Math.max(velocity * 2, -30), 30);
  
  return (
    <div 
      ref={playerRef}
      className={`absolute transition-transform ${isInvincible ? 'after:absolute after:inset-0 after:bg-yellow-300 after:animate-pulse after:rounded-full after:opacity-30 after:-z-10' : ''}`}
      style={{
        left: '100px',
        top: `${y}px`,
        width: `${PLAYER_WIDTH}px`,
        height: `${PLAYER_HEIGHT}px`,
        transform: `rotate(${rotation}deg)`,
        zIndex: 20,
        transition: 'opacity 0.15s ease-in-out'
      }}
    >
      <img 
        src="/lovable-uploads/311c90d1-3b76-4522-8532-bdb805985a2d.png" 
        alt="Dawg" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Player;
