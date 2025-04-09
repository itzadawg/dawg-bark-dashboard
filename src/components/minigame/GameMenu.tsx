
import React from 'react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Mini Games</h1>
        <p className="text-xl mb-6">Select a game to play</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          className="neo-brutal-box p-6 cursor-pointer flex flex-col items-center"
          onClick={() => onSelectGame('memory')}
        >
          <h3 className="text-2xl font-bold mb-2">Memory Match</h3>
          <p className="text-gray-700 mb-4">Match pairs of cards before time runs out</p>
          <button className="neo-brutal-button">Play Now</button>
        </div>
        
        <div className="neo-brutal-box p-6 flex flex-col items-center">
          <img 
            src="/lovable-uploads/80a3a80b-1e83-412c-b2bf-617c44ac7543.png" 
            alt="Coming Soon" 
            className="max-w-full max-h-64 mb-4"
          />
          <h3 className="text-2xl font-bold mb-2">More Games Coming Soon</h3>
          <p className="text-gray-700">Stay tuned for more exciting mini-games!</p>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
