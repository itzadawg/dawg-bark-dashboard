
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
      {/* Background Image with reduced opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imghippo.com/files/HdYk9772Jys.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="min-h-screen">
          <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
            <img src="https://i.imghippo.com/files/DqSl1886eGM.png" alt="DAWG Presale Title" className="mx-auto w-full max-w-xs h-auto" />
          </div>

          {/* Hero Section */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 mt-10">
            <div className="w-full max-w-7xl flex flex-col items-center justify-center">
              <div 
                onClick={handleApplyForPresale} 
                className="cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:brightness-110 mx-auto"
              >
                <img 
                  src="https://i.imghippo.com/files/fx8859IYo.png" 
                  alt="Apply for Presale" 
                  className="max-w-[200px] md:max-w-[250px] w-full h-auto"
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
