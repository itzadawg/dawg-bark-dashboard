
import React, { useState } from 'react';
import Header from '../components/dashboard/Header';
import GameMenu from '../components/minigame/GameMenu';
import MemoryMatch from '../components/minigame/MemoryMatch';

const Minigame = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  
  const handleBackToMenu = () => {
    setSelectedGame(null);
  };
  
  const renderGame = () => {
    switch (selectedGame) {
      case 'memory':
        return <MemoryMatch />;
      default:
        return <GameMenu onSelectGame={setSelectedGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/de32c026-c4bd-4f04-954a-004c1fe48fc7.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content with Glass Effect */}
      <div className="relative z-10 flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg neo-brutal-border shadow-brutal">
            {selectedGame && (
              <button 
                onClick={handleBackToMenu}
                className="mb-6 neo-brutal-button"
              >
                ← Back to Games
              </button>
            )}
            {renderGame()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minigame;
