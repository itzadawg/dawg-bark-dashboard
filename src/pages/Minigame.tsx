
import React from 'react';
import Header from '../components/dashboard/Header';
import DogCatcher from '../components/minigame/DogCatcher';

const Minigame = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-dawg-light p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-dawg-dark mb-6 text-center">Dawg Catcher</h1>
          <p className="text-lg text-center mb-8">
            Catch as many dogs as you can before time runs out!
          </p>
          
          <DogCatcher />
        </div>
      </div>
    </>
  );
};

export default Minigame;
