
import React from 'react';
import { Dog } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'dawgPac',
      name: 'Dawg-Pac',
      description: 'Navigate the maze, collect bones and avoid the animal control officers!',
      icon: <Dog className="w-8 h-8 text-white" />,
      color: 'bg-[#FFC107]',
    }
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-2 text-center text-dawg">Dawg Games</h1>
      <p className="text-lg text-center mb-8">
        {games.length > 0 
          ? "Select a game to play!" 
          : "No games available at the moment. Check back soon!"}
      </p>
      
      {games.length > 0 ? (
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
      ) : (
        <div className="neo-brutal-box p-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
          <p className="text-gray-600">New games are being developed. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default GameMenu;
