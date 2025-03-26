
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

  return <>
      <Header />
      <div className="min-h-screen">
        <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
          <img src="https://i.imghippo.com/files/DqSl1886eGM.png" alt="DAWG Presale Title" className="mx-auto w-full max-w-xs h-auto" />
        </div>

        {/* Hero Section */}
        <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12">
          <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-2/5 flex justify-center md:justify-start">
              <div className="neo-brutal-border p-0 inline-block">
                <img 
                  src="https://i.imghippo.com/files/HdYk9772Jys.png" 
                  alt="DAWG Presale Image" 
                  className="w-full max-w-md h-auto"
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/5 flex flex-col items-center md:items-start">
              <Button onClick={handleApplyForPresale} className="w-full md:max-w-md py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2">
                Apply for Presale
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>;
};

export default Presale;
