
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useAppSettings } from '../hooks/useAppSettings';
import PresaleDisabledPopup from '../components/presale/PresaleDisabledPopup';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@/components/ui/drawer";

const Presale = () => {
  // State management
  const { settings, loading: settingsLoading } = useAppSettings();
  const [showPopup, setShowPopup] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Auth states
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // Debugging helper
  const debugAuthFlow = (message, data = null) => {
    console.log(`[Auth Debug] ${message}`, data || '');
  };

  // X Auth handler
  const handleConnectX = async () => {
    // If presale is disabled, just show the popup
    if (!settingsLoading && settings.enable_presale_applications === false) {
      setShowPopup(true);
      return;
    }
    
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      // Following the Supabase docs for Twitter OAuth
      debugAuthFlow('Initiating Twitter auth');
      
      // Using the redirectTo parameter to specify where to return after authentication
      const origin = window.location.origin;
      const redirectTo = `${origin}/presale-application`;
      
      console.log('Using redirect URL:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo,
          scopes: 'tweet.read users.read',
        },
      });

      if (error) {
        setAuthError(`Twitter auth error: ${error.message}`);
        toast.error('Failed to connect X account: ' + error.message);
        console.error('X auth error details:', error);
      } else {
        debugAuthFlow('Auth initiated successfully, redirecting to Twitter');
        console.log('Auth initiated successfully:', data);
        // Browser will be automatically redirected to Twitter
      }
    } catch (error) {
      setAuthError(`Unexpected error: ${error.message}`);
      toast.error('An unexpected error occurred');
      console.error('X authentication error:', error);
      setIsAuthLoading(false);
    }
  };
  
  // Popup close handler
  const closePopup = () => {
    setShowPopup(false);
  };

  // Main render
  return (
    <div className="relative min-h-screen">
      {/* Background Image with slightly reduced opacity */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.imghippo.com/files/HdYk9772Jys.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover opacity-90" 
          loading="eager"
          width="1920"
          height="1080"
        />
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

          {/* Main content section */}
          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 flex-grow justify-center mb-16">
            <div className="w-full max-w-3xl flex flex-col items-center justify-center">
              {/* Initial connect display */}
              <p className="text-white text-lg font-medium mb-4">Want to apply for presale? Click the button below.</p>
              <Button 
                onClick={handleConnectX}
                disabled={isAuthLoading} 
                className="bg-dawg flex items-center justify-center gap-2 px-8 py-3 rounded-md text-lg font-medium text-white shadow-md hover:bg-dawg-dark transition-colors duration-300"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect with X'
                )}
              </Button>
              
              {/* Error display */}
              {authError && (
                <div className="p-4 mt-6 w-full neo-brutal-border bg-red-50 text-red-700">
                  <h3 className="font-bold">Authentication Error:</h3>
                  <p className="break-words">{authError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Use appropriate component based on device type for disabled popup */}
      {isMobile ? (
        <Drawer open={showPopup} onOpenChange={closePopup}>
          <DrawerOverlay />
          <DrawerContent className="h-[90%] max-h-[90vh] p-0">
            <PresaleDisabledPopup onClose={closePopup} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showPopup} onOpenChange={closePopup}>
          <DialogContent className="max-w-md p-0">
            <PresaleDisabledPopup onClose={closePopup} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Presale;
