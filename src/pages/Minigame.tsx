
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
          backgroundImage: 'url("/lovable-uploads/f1a2b995-12c2-445a-bcb8-9248e67569ab.png")',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {renderGame()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minigame;
