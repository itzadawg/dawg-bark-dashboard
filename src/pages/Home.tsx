
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { ShoppingCart, Gamepad2, AlertTriangle, Dog } from 'lucide-react';

const Home = () => {
  const [bgLoaded, setBgLoaded] = useState(false);
  
  return <div className="relative min-h-screen bg-dawg-light">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0">
        {!bgLoaded && <div className="w-full h-full bg-dawg-light animate-pulse"></div>}
        <img 
          src="https://i.imghippo.com/files/cja9496FU.png" 
          alt="Background"
          className={`w-full h-full object-cover transition-opacity duration-500 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setBgLoaded(true)}
        />
      </div>
      
      <div className="relative z-10 min-h-screen">
        <Header />
        
        <div className="px-4 sm:px-8 py-12 max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-4xl">
              
            </div>

          </div>
        </div>
      </div>
    </div>;
};
export default Home;
