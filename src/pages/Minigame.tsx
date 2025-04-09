
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
          backgroundImage: 'url("/lovable-uploads/e7e866b2-dd46-4a46-a944-7a35f891b4ca.png")',
          backgroundSize: 'cover',
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
      
      {/* Coming Soon Image - positioned at the absolute bottom of the page */}
      <div className="relative z-10 flex justify-center w-full fixed bottom-0 mb-2">
        <img 
          src="/lovable-uploads/8e7442aa-242d-4292-8a5c-dd0a11882580.png" 
          alt="Coming Soon" 
          className="w-64 md:w-80 h-auto"
        />
      </div>
    </div>
  );
};

export default Minigame;
