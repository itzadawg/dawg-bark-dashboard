
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { ShoppingCart, Gamepad2, AlertTriangle, Dog } from 'lucide-react';

const Home = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-dawg-light px-8 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-10">
          <div className="text-center">
            <h1 className="text-5xl font-black text-dawg-dark mb-4">Welcome to Dawg</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your premier destination for tracking and participating in the Dawg ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <Link 
              to="/shameboard" 
              className="flex flex-col items-center p-8 neo-brutal-border bg-white hover:bg-gray-50 transition-colors"
            >
              <AlertTriangle size={48} className="mb-4 text-dawg" />
              <h2 className="text-2xl font-bold mb-2">Shameboard</h2>
              <p className="text-center text-gray-600">
                Track performance and see who's fumbling.
              </p>
            </Link>

            <Link 
              to="/presale" 
              className="flex flex-col items-center p-8 neo-brutal-border bg-white hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart size={48} className="mb-4 text-dawg" />
              <h2 className="text-2xl font-bold mb-2">Presale</h2>
              <p className="text-center text-gray-600">
                Get early access to upcoming Dawg offerings.
              </p>
            </Link>

            <Link 
              to="/minigame" 
              className="flex flex-col items-center p-8 neo-brutal-border bg-white hover:bg-gray-50 transition-colors"
            >
              <Gamepad2 size={48} className="mb-4 text-dawg" />
              <h2 className="text-2xl font-bold mb-2">Minigame</h2>
              <p className="text-center text-gray-600">
                Have fun with interactive Dawg experiences.
              </p>
            </Link>
          </div>

          <div className="mt-12 flex items-center space-x-4">
            <Dog size={24} className="text-dawg" />
            <p className="text-lg text-gray-600">Join the pack today!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
