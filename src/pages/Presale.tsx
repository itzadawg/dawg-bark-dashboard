
import React, { useState } from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Twitter, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSettings } from '../hooks/useAppSettings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Presale = () => {
  const navigate = useNavigate();
  const { settings, loading } = useAppSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleApplyForPresale = () => {
    if (settings.enable_presale_applications === true) {
      navigate('/presale-application');
    } else {
      setIsDialogOpen(true);
    }
  };
  
  return <div className="relative min-h-screen">
      {/* Background Image with slightly reduced opacity */}
      <div className="absolute inset-0 z-0">
        <img src="https://i.imghippo.com/files/HdYk9772Jys.png" alt="DAWG Background" className="w-full h-full object-cover opacity-90" />
      </div>
      
      {/* Dark overlay to improve text visibility */}
      <div className="absolute inset-0 z-0 bg-black bg-opacity-20"></div>
      
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
              </button>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Presale Applications Not Available
            </AlertDialogTitle>
            <AlertDialogDescription>
              Too early dawg, stay tuned for updates by following us on twitter <a 
                href="https://twitter.com/itzadawg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-500 hover:underline flex items-center gap-1 inline-flex"
              >
                @itzadawg
                <Twitter className="h-3 w-3" />
              </a>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

export default Presale;
