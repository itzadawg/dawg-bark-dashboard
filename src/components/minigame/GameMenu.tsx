
import React from 'react';
import { Gamepad2, Target, Dice1, Trophy } from 'lucide-react';

interface GameMenuProps {
  onSelectGame: (game: string) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'dawgCatcher',
      name: 'Dawg Catcher',
      description: 'Catch as many dogs as you can before time runs out!',
      icon: <Target size={40} />,
      color: 'bg-[#f8d347]',
    },
    {
      id: 'memoryMatch',
      name: 'Memory Match',
      description: 'Test your memory by matching pairs of cards!',
      icon: <Trophy size={40} />,
      color: 'bg-[#4cc9f0]',
    },
    {
      id: 'blockPuzzle',
      name: 'Block Puzzle',
      description: 'Solve puzzles by arranging blocks in the right pattern!',
      icon: <Dice1 size={40} />,
      color: 'bg-[#f15bb5]',
    },
    {
      id: 'quizChallenge',
      name: 'Quiz Challenge',
      description: 'Test your knowledge with this fun quiz game!',
      icon: <Gamepad2 size={40} />,
      color: 'bg-[#9b5de5]',
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-4xl font-black mb-2 text-center text-[#f8d347]">Dawg Games</h1>
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
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${game.color}`}>
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
