
import React from 'react';
import { Button } from '../ui/button';
import { GameDifficulty } from './types/gameTypes';

interface DifficultySelectorProps {
  selectedDifficulty: GameDifficulty;
  onSelectDifficulty: (difficulty: GameDifficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onSelectDifficulty
}) => {
  const difficultyOptions: {
    value: GameDifficulty;
    label: string;
    color: string;
  }[] = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500 hover:bg-green-600' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { value: 'hard', label: 'Hard', color: 'bg-red-500 hover:bg-red-600' }
  ];
  
  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <h3 className="text-lg font-semibold mb-2">Select Difficulty</h3>
      <div className="flex gap-3">
        {difficultyOptions.map(option => (
          <Button
            key={option.value}
            onClick={() => onSelectDifficulty(option.value)}
            className={`neo-brutal-button ${option.color} ${
              selectedDifficulty === option.value ? 'ring-2 ring-white ring-offset-2' : ''
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
