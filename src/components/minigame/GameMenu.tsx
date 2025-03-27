
import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'memoryMatch',
      name: 'Memory Match',
      description: 'Test your memory by matching pairs of cards!',
      icon: <Gamepad2 className="w-8 h-8 text-white" />,
      color: 'bg-[#4cc9f0]',
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-2 text-center text-dawg">Dawg Games</h1>
      <p className="text-lg text-center mb-8">
        Select a game to play!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {games.map((game) => (
          <div
            key={game.id}
            className="neo-brutal-box p-6 cursor-pointer hover:translate-y-[-4px] transition-transform"
            onClick={() => onSelectGame(game.id)}
          >
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden ${game.color} border-2 border-black`}>
              {game.icon}
            </div>
            <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
            <p className="text-gray-600">{game.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameMenu;
