
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
      <div className="min-h-screen px-4 md:px-8 py-12 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-dawg-dark mb-4">DAWG Presale</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get early access to the DAWG token before public launch
          </p>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
          <div className="w-full md:w-1/2">
            <div className="neo-brutal-border overflow-hidden">
              <img alt="DAWG Token" className="w-full h-auto" src="/lovable-uploads/a10d58f1-ba3c-4807-b77d-57792190f4fd.png" />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            <div className="p-2 neo-brutal-border bg-transparent flex justify-center items-center">
              <img 
                src="/lovable-uploads/718d6294-9f6e-450a-a348-8e6978c36b54.png" 
                alt="DAWG mascot" 
                className="w-64 h-auto"
              />
            </div>
            <Button 
              onClick={handleApplyForPresale}
              className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2"
            >
              Apply for Presale
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="neo-brutal-border bg-dawg/10 p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join the DAWG pack?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Don't miss out on this exclusive opportunity to get DAWG tokens at the lowest possible price before public launch
          </p>
          <Button 
            onClick={handleApplyForPresale}
            className="py-6 px-8 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 mx-auto"
          >
            Apply Now <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>;
};

export default Presale;
