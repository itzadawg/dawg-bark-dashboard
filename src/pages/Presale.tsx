
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
      <div className="min-h-screen px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="mb-4 text-center">
          <img src="https://i.imghippo.com/files/DqSl1886eGM.png" alt="DAWG Presale Title" className="mx-auto w-full max-w-xs h-auto" />
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <div className="w-full space-y-6">
            <div className="text-center mb-4">
              <img 
                src="https://i.imghippo.com/files/HdYk9772Jys.png" 
                alt="DAWG Presale Image" 
                className="w-full h-auto mx-auto"
              />
            </div>
            
            <div className="max-w-md mx-auto">
              <Button onClick={handleApplyForPresale} className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2">
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
