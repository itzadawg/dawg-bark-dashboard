
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

  return (
    <div className="relative min-h-screen">
      {/* Background Image with full opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imghippo.com/files/HdYk9772Jys.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover opacity-100"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
            {/* Image removed from here */}
          </div>

          {/* Hero Section moved lower on the page with flex-grow to push it down */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 flex-grow justify-end mb-24">
            <div className="w-full max-w-7xl flex flex-col items-center justify-center">
              <div 
                onClick={handleApplyForPresale} 
                className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:brightness-110 mx-auto"
              >
                <img 
                  src="/lovable-uploads/5b114779-72f6-45ea-94b8-7788e75a7549.png" 
                  alt="Connect With X" 
                  className="max-w-[300px] md:max-w-[400px] w-full h-auto brightness-100 filter"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presale;
