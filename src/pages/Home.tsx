
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { ShoppingCart, Gamepad2, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '../components/common/OptimizedImage';

const Home = () => {
  return <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <OptimizedImage 
          src="/lovable-uploads/0bfd5d0a-98bb-4d65-b908-60d9337659de.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover object-center brightness-105" 
          loading="eager" 
          width={1920} 
          height={1080} 
        />
      </div>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 z-0 bg-black bg-opacity-10"></div>
      
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
