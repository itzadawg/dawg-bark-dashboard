
import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from '@/hooks/use-mobile';
import { Direction, GameEntity, GameMap, Position } from './types';
import { CELL_SIZE, GHOST_SPEED, PLAYER_SPEED } from './constants';
import { loadLevel, checkCollision } from './utils';

interface GameBoardProps {
  updateScore: (points: number) => void;
  updateLives: (change: number) => void;
  updateLevel: () => void;
  level: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  updateScore, 
  updateLives, 
  updateLevel,
  level
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameMap, setGameMap] = useState<GameMap | null>(null);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('right');
  const [ghosts, setGhosts] = useState<GameEntity[]>([]);
  const [dots, setDots] = useState<Position[]>([]);
  const [powerUps, setPowerUps] = useState<Position[]>([]);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const animationRef = useRef<number>(0);
  
  // Initialize game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setPlayerDirection('up');
          break;
        case 'ArrowDown':
          setPlayerDirection('down');
          break;
        case 'ArrowLeft':
          setPlayerDirection('left');
          break;
        case 'ArrowRight':
          setPlayerDirection('right');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  // Load level
  useEffect(() => {
    const levelData = loadLevel(level);
    setGameMap(levelData.map);
    setPlayerPosition(levelData.playerStart);
    setGhosts(levelData.ghosts);
    setDots(levelData.dots);
    setPowerUps(levelData.powerUps);
  }, [level]);
  
  // Main game loop
  useEffect(() => {
    if (!gameMap) return;
    
    const gameLoop = () => {
      if (!canvasRef.current) return;
      
      // Move player
      const newPosition = { ...playerPosition };
      switch (playerDirection) {
        case 'up':
          newPosition.y -= PLAYER_SPEED;
          break;
        case 'down':
          newPosition.y += PLAYER_SPEED;
          break;
        case 'left':
          newPosition.x -= PLAYER_SPEED;
          break;
        case 'right':
          newPosition.x += PLAYER_SPEED;
          break;
      }
      
      // Check wall collision
      if (!checkCollision(newPosition, gameMap)) {
        setPlayerPosition(newPosition);
      }
      
      // Check dot collection
      setDots(prevDots => {
        const newDots = prevDots.filter(dot => {
          const collected = Math.abs(dot.x - playerPosition.x) < CELL_SIZE / 2 &&
                           Math.abs(dot.y - playerPosition.y) < CELL_SIZE / 2;
          if (collected) {
            updateScore(10);
          }
          return !collected;
        });
        
        // If all dots collected, go to next level
        if (newDots.length === 0 && powerUps.length === 0) {
          updateLevel();
        }
        
        return newDots;
      });
      
      // Check power-up collection
      setPowerUps(prevPowerUps => {
        const newPowerUps = prevPowerUps.filter(powerUp => {
          const collected = Math.abs(powerUp.x - playerPosition.x) < CELL_SIZE / 2 &&
                           Math.abs(powerUp.y - playerPosition.y) < CELL_SIZE / 2;
          if (collected) {
            setIsPoweredUp(true);
            updateScore(50);
            setTimeout(() => setIsPoweredUp(false), 5000);
          }
          return !collected;
        });
        return newPowerUps;
      });
      
      // Move ghosts
      setGhosts(prevGhosts => {
        return prevGhosts.map(ghost => {
          // Simple AI for ghosts - they just move randomly for now
          const directions: Direction[] = ['up', 'down', 'left', 'right'];
          const randomDirection = directions[Math.floor(Math.random() * directions.length)];
          
          const newPosition = { ...ghost.position };
          switch (randomDirection) {
            case 'up':
              newPosition.y -= GHOST_SPEED;
              break;
            case 'down':
              newPosition.y += GHOST_SPEED;
              break;
            case 'left':
              newPosition.x -= GHOST_SPEED;
              break;
            case 'right':
              newPosition.x += GHOST_SPEED;
              break;
          }
          
          if (!checkCollision(newPosition, gameMap)) {
            return { ...ghost, position: newPosition };
          }
          return ghost;
        });
      });
      
      // Check ghost collision
      ghosts.forEach(ghost => {
        const collision = Math.abs(ghost.position.x - playerPosition.x) < CELL_SIZE / 2 &&
                         Math.abs(ghost.position.y - playerPosition.y) < CELL_SIZE / 2;
        
        if (collision) {
          if (isPoweredUp) {
            // Remove the ghost and add points
            setGhosts(prevGhosts => 
              prevGhosts.filter(g => g.id !== ghost.id)
            );
            updateScore(200);
          } else {
            // Player loses a life
            updateLives(-1);
            
            // Reset player position
            setPlayerPosition(loadLevel(level).playerStart);
          }
        }
      });
      
      // Draw game
      renderGame();
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [playerPosition, playerDirection, ghosts, dots, powerUps, gameMap, isPoweredUp, level, updateScore, updateLives, updateLevel]);
  
  // Render game
  const renderGame = () => {
    if (!canvasRef.current || !gameMap) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw walls
    ctx.fillStyle = '#333';
    gameMap.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      });
    });
    
    // Draw dots
    ctx.fillStyle = '#FFD700';
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, CELL_SIZE / 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw power-ups
    ctx.fillStyle = '#FF4500';
    powerUps.forEach(powerUp => {
      ctx.beginPath();
      ctx.arc(powerUp.x, powerUp.y, CELL_SIZE / 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw ghosts
    ghosts.forEach(ghost => {
      ctx.fillStyle = isPoweredUp ? '#6495ED' : ghost.color;
      ctx.beginPath();
      ctx.arc(ghost.position.x, ghost.position.y, CELL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw player (Pac-Man style)
    ctx.fillStyle = '#FFC107';
    ctx.beginPath();
    
    // Calculate mouth angle based on direction
    let startAngle = 0.2 * Math.PI;
    let endAngle = 1.8 * Math.PI;
    
    if (playerDirection === 'right') {
      startAngle = 0.2 * Math.PI;
      endAngle = 1.8 * Math.PI;
    } else if (playerDirection === 'left') {
      startAngle = 1.2 * Math.PI;
      endAngle = 0.8 * Math.PI;
    } else if (playerDirection === 'up') {
      startAngle = 1.7 * Math.PI;
      endAngle = 1.3 * Math.PI;
    } else if (playerDirection === 'down') {
      startAngle = 0.7 * Math.PI;
      endAngle = 0.3 * Math.PI;
    }
    
    ctx.arc(
      playerPosition.x, 
      playerPosition.y, 
      CELL_SIZE / 2, 
      startAngle, 
      endAngle
    );
    ctx.lineTo(playerPosition.x, playerPosition.y);
    ctx.fill();
  };
  
  return (
    <div className="flex-1 relative overflow-hidden bg-slate-100 neo-brutal-box">
      <canvas
        ref={canvasRef}
        width={windowWidth - 40}
        height={windowHeight - 200}
        className="block mx-auto"
      />
    </div>
  );
};

export default GameBoard;
