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
        <div className="flex flex-col md:flex-row gap-8 mb-16 items-start">
          <div className="w-full md:w-1/2">
            
          </div>
          <div className="w-full md:w-1/2 space-y-6">
            
            <Button onClick={handleApplyForPresale} className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2">
              Apply for Presale
              <Twitter className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        
      </div>
    </>;
};
export default Presale;