
import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => onSelectGame('memory')}
          className="neo-brutal-box p-6 hover:cursor-pointer flex flex-col items-center"
        >
          <Gamepad2 size={64} className="mb-4 text-dawg" />
        </div>
        
        <div className="neo-brutal-box p-6 flex flex-col items-center bg-gray-100/50">
          <Gamepad2 size={64} className="mb-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
