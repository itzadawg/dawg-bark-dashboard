
import React from 'react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Second empty box is kept */}
        <div className="neo-brutal-box p-6 flex flex-col items-center bg-gray-100/50">
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
