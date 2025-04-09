import React, { useState } from 'react';
import Header from '../components/dashboard/Header';
import GameMenu from '../components/minigame/GameMenu';
import DawgPacGame from '../components/minigame/DawgPac/DawgPacGame';
const Minigame = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const handleBackToMenu = () => {
    setSelectedGame(null);
  };
  return <>
      <Header />
      
    </>;
};
export default Minigame;