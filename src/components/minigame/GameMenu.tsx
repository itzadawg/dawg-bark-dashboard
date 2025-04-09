
import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-6 text-center text-dawg-dark">
        Brawl of Dawgs
      </h1>
      <p className="text-xl text-center mb-8">
        Choose a game to play and earn rewards!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div 
          onClick={() => onSelectGame('memory')}
          className="neo-brutal-box p-6 hover:cursor-pointer flex flex-col items-center"
        >
          <Gamepad2 size={64} className="mb-4 text-dawg" />
          <h3 className="text-xl font-bold mb-2">Memory Match</h3>
          <p className="text-gray-600">
            Test your memory by matching pairs of cards!
          </p>
        </div>
        
        <div className="neo-brutal-box p-6 flex flex-col items-center bg-gray-100/50">
          <Gamepad2 size={64} className="mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
          <p className="text-gray-600">
            More games are on the way!
          </p>
        </div>
      </div>
      
      <div className="mt-12 p-4 bg-dawg/10 rounded-lg">
        <h4 className="font-bold mb-2">Game Rewards</h4>
        <p className="text-gray-700">
          Playing games will earn you BARK tokens that can be used for in-game items and NFT upgrades.
          Stay tuned for more information about the reward system!
        </p>
      </div>
    </div>
  );
};

export default GameMenu;
