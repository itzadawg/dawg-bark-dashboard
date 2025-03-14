
import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'dawgCatcher',
      name: 'Dawg Catcher',
      description: 'Catch as many dogs as you can before time runs out!',
      icon: <img src="/lovable-uploads/b20f764f-39b1-4aba-967d-36ca81400ae3.png" alt="Dawg Catcher" className="w-full h-full object-cover" />,
      color: 'bg-[#1EAEDB]', // Blue background to match the reference image
    },
    {
      id: 'flappyDawg',
      name: 'Flappy Dawg',
      description: 'Guide your dawg through obstacles in this fun flying game!',
      icon: <img src="/lovable-uploads/d4d58344-3817-4b81-a535-e7fd84d0e807.png" alt="Flappy Dawg" className="w-full h-full object-cover" />,
      color: 'bg-[#4cc9f0]',
    },
    {
      id: 'dawgDash',
      name: 'Dawg Dash',
      description: 'Jump over obstacles in this fast-paced running game!',
      icon: <div className="flex items-center justify-center w-full h-full">
              <img 
                src="/lovable-uploads/d4d58344-3817-4b81-a535-e7fd84d0e807.png" 
                alt="Dawg Dash" 
                className="w-4/5 h-4/5" 
              />
            </div>,
      color: 'bg-[#1EAEDB]',
    },
    {
      id: 'whackADawg',
      name: 'Whack-A-Dawg',
      description: 'Whack the dawgs as they pop up from their holes!',
      icon: <div className="flex items-center justify-center w-full h-full">
              <img 
                src="/lovable-uploads/9b1ad62d-7684-4c97-bbea-929b0be4d290.png" 
                alt="Dawg" 
                className="w-4/5 h-4/5" 
              />
            </div>,
      color: 'bg-dawg',
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
