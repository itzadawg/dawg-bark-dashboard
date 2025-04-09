
import React, { useState } from 'react';
import Header from '../components/dashboard/Header';
import GameMenu from '../components/minigame/GameMenu';
import MemoryMatch from '../components/minigame/MemoryMatch';

const Game = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [comingSoonLoaded, setComingSoonLoaded] = useState(false);
  
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
    <div className="min-h-screen flex flex-col relative bg-dawg-light">
      {/* Background Image with loading state */}
      <div className="fixed inset-0 z-0 bg-cover bg-center">
        {!bgLoaded && <div className="w-full h-full bg-dawg-light animate-pulse"></div>}
        <img 
          src="/lovable-uploads/e7e866b2-dd46-4a46-a944-7a35f891b4ca.png"
          alt="Game Background"
          className={`w-full h-full object-cover transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setBgLoaded(true)}
          style={{ objectPosition: 'center', backgroundAttachment: 'fixed' }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {renderGame()}
          </div>
        </div>
      </div>
      
      {/* Coming Soon Image with loading state */}
      <div className="relative z-10 flex justify-center w-full fixed bottom-0 mb-2">
        {!comingSoonLoaded && <div className="w-64 md:w-80 h-20 bg-dawg-light/50 rounded-lg animate-pulse"></div>}
        <img 
          src="/lovable-uploads/8e7442aa-242d-4292-8a5c-dd0a11882580.png" 
          alt="Coming Soon" 
          className={`w-64 md:w-80 h-auto transition-opacity duration-500 ${comingSoonLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setComingSoonLoaded(true)}
        />
      </div>
    </div>
  );
};

export default Game;
