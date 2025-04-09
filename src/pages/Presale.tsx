
import React from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Presale = () => {
  const navigate = useNavigate();
  const handleApplyForPresale = () => {
    navigate('/presale-application');
  };

  return <div className="relative min-h-screen">
      {/* Background Image with full opacity */}
      <div className="absolute inset-0 z-0">
        <img src="https://i.imghippo.com/files/HdYk9772Jys.png" alt="DAWG Background" className="w-full h-full object-cover opacity-100" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
            {/* Image removed from here */}
          </div>

          {/* Adjusted positioning - changed justify-end to center and reduced bottom margin */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 flex-grow justify-center mb-16">
            <div className="w-full max-w-7xl flex flex-col items-center justify-center">
              <p className="text-white text-lg font-medium mb-4">Want to apply for presale? Click the button below.</p>
              <button onClick={handleApplyForPresale} className="bg-dawg flex items-center justify-center gap-2 px-8 py-3 rounded-md text-lg font-medium text-white shadow-md hover:bg-dawg-dark transition-colors duration-300">
                Connect with X
                <Twitter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

export default Presale;
