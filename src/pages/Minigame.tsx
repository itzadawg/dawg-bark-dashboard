
import React from 'react';
import Header from '../components/dashboard/Header';

const Minigame = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-dawg-light p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-6 text-center text-dawg">Games Coming Soon</h1>
            <p className="text-lg text-center mb-8">
              We're working on some exciting new games. Check back soon!
            </p>
            
            <div className="neo-brutal-box p-12 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Stay Tuned!</h2>
              <p className="text-gray-600">Our team is developing fun and interactive games for the community.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Minigame;
