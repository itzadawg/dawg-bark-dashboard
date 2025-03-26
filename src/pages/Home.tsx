
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { ShoppingCart, Gamepad2, AlertTriangle, Dog } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/d7a028b8-bd7f-4c8d-8862-a4652f1d8e28.png')"
        }}
      />
      
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10">
            <div className="text-center bg-white/80 p-4 sm:p-6 rounded-lg neo-brutal-border backdrop-blur-sm w-full max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-black text-dawg-dark mb-2 sm:mb-4">Welcome to Dawg</h1>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Your premier destination for tracking and participating in the Dawg ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-4xl">
              <Link 
                to="/shameboard" 
                className="flex flex-col items-center p-4 sm:p-8 neo-brutal-border bg-white/90 hover:bg-white transition-colors backdrop-blur-sm"
              >
                <AlertTriangle size={36} className="mb-3 sm:mb-4 text-dawg" />
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Shameboard</h2>
                <p className="text-center text-gray-600 text-sm sm:text-base">
                  Track performance and see who's fumbling.
                </p>
              </Link>

              <Link 
                to="/presale" 
                className="flex flex-col items-center p-4 sm:p-8 neo-brutal-border bg-white/90 hover:bg-white transition-colors backdrop-blur-sm"
              >
                <ShoppingCart size={36} className="mb-3 sm:mb-4 text-dawg" />
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Presale</h2>
                <p className="text-center text-gray-600 text-sm sm:text-base">
                  Get early access to upcoming Dawg offerings.
                </p>
              </Link>

              <Link 
                to="/minigame" 
                className="flex flex-col items-center p-4 sm:p-8 neo-brutal-border bg-white/90 hover:bg-white transition-colors backdrop-blur-sm"
              >
                <Gamepad2 size={36} className="mb-3 sm:mb-4 text-dawg" />
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Minigame</h2>
                <p className="text-center text-gray-600 text-sm sm:text-base">
                  Have fun with interactive Dawg experiences.
                </p>
              </Link>
            </div>

            <div className="mt-6 sm:mt-12 flex items-center space-x-4 bg-white/90 p-3 sm:p-4 rounded-full neo-brutal-border backdrop-blur-sm">
              <Dog size={20} className="text-dawg" />
              <p className="text-base sm:text-lg text-gray-600">Join the pack today!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
