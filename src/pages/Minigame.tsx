
import React, { useState } from 'react';
import Header from '../components/dashboard/Header';
import DogCatcher from '../components/minigame/DogCatcher';
import GameMenu from '../components/minigame/GameMenu';
import FlappyDawg from '../components/minigame/FlappyDawg';
import BlockPuzzle from '../components/minigame/BlockPuzzle';
import WhackADawg from '../components/minigame/WhackADawg';

const Minigame = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  const handleBackToMenu = () => {
    setSelectedGame(null);
  };
  
  return (
    <>
      <Header />
      <div className="min-h-screen bg-dawg-light p-6">
        <div className="max-w-7xl mx-auto">
          {!selectedGame ? (
            <GameMenu onSelectGame={setSelectedGame} />
          ) : (
            <div>
              <button 
                onClick={handleBackToMenu}
                className="neo-brutal-button mb-4 flex items-center gap-2"
              >
                ← Back to Games
              </button>
              
              {selectedGame === 'dawgCatcher' && <DogCatcher />}
              {selectedGame === 'flappyDawg' && <FlappyDawg />}
              {selectedGame === 'blockPuzzle' && <BlockPuzzle />}
              {selectedGame === 'whackADawg' && <WhackADawg />}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Minigame;
