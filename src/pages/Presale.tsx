import React, { useState, useEffect, useRef } from 'react';
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
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
} from "@/components/ui/drawer";

const Presale = () => {
  const { settings, loading: settingsLoading } = useAppSettings();
  const [showPopup, setShowPopup] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [authError, setAuthError] = useState(null);
  const sessionChecked = useRef(false);
  const sessionCheckTimeout = useRef(null);
  
  const debugAuthFlow = (message, data = null) => {
    console.log(`[Auth Debug] ${message}`, data || '');
  };

  useEffect(() => {
    if (sessionCheckTimeout.current) {
      clearTimeout(sessionCheckTimeout.current);
    }
    
    sessionCheckTimeout.current = setTimeout(() => {
      debugAuthFlow('Session check timed out after 3 seconds, forcing completion');
      sessionChecked.current = true;
      setIsAuthLoading(false);
    }, 3000);
    
    const checkExistingSession = async () => {
      try {
        setIsAuthLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        if (data?.session) {
          debugAuthFlow('Found existing session', data.session.user.id);
          setIsAuthenticated(true);
          setUserInfo(data.session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        sessionChecked.current = true;
        setIsAuthLoading(false);
        clearTimeout(sessionCheckTimeout.current);
      }
    };
    
    checkExistingSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      debugAuthFlow('Auth state changed', { event, userId: session?.user?.id });
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setUserInfo(session.user);
        navigate('/presale-application');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserInfo(null);
      }
    });
    
    return () => {
      clearTimeout(sessionCheckTimeout.current);
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleConnectX = async () => {
    if (!settingsLoading && settings.enable_presale_applications === false) {
      setShowPopup(true);
      return;
    }
    
    if (isAuthenticated) {
      debugAuthFlow('User already authenticated, navigating to application page');
      navigate('/presale-application');
      return;
    }
    
    setIsAuthLoading(true);
    setAuthError(null);
    
    try {
      debugAuthFlow('Initiating Twitter auth');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: window.location.origin + '/presale-application'
        }
      });

      if (error) {
        setAuthError(`Twitter auth error: ${error.message}`);
        toast.error('Failed to connect X account: ' + error.message);
        console.error('X auth error details:', error);
      } else {
        debugAuthFlow('Auth initiated successfully, browser should redirect to Twitter');
      }
    } catch (error) {
      setAuthError(`Unexpected error: ${error.message}`);
      toast.error('An unexpected error occurred');
      console.error('X authentication error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };
  
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/9cf97d27-5e5e-4f9f-8fad-4cf840895af6.png" 
          alt="DAWG Background" 
          className="w-full h-full object-cover opacity-90 md:object-center object-right-top sm:object-center" 
          loading="eager"
          width="1920"
          height="1080"
        />
      </div>
      
      <div className="absolute inset-0 z-0 bg-black bg-opacity-20"></div>
      
      <div className="relative z-10">
        <Header />
        <div className="min-h-screen flex flex-col">
          <div className="text-center max-w-7xl mx-auto px-4 md:px-8 mb-0">
          </div>

          <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-12 flex-grow justify-center mb-16">
            <div className="w-full max-w-3xl flex flex-col items-center justify-center">
              {isAuthenticated ? (
                <div className="w-full max-w-md clay-card bg-white/80 p-6 rounded-lg shadow-lg backdrop-blur-sm">
                  <p className="text-center text-lg font-medium mb-6">
                    You're connected with X as {userInfo?.user_metadata?.preferred_username || 'user'}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => navigate('/presale-application')}
                      className="bg-dawg flex items-center justify-center gap-2 px-8 py-3 rounded-md text-lg font-medium text-white shadow-md hover:bg-dawg-dark transition-colors duration-300"
                    >
                      Go to Application
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white text-lg font-medium mb-4 text-shadow-sm">Want to apply for presale? Click the button below.</p>
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
                </>
              )}
              
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
      
      {isMobile ? (
        <Drawer open={showPopup} onOpenChange={closePopup}>
          <DrawerOverlay />
          <DrawerContent className="h-[90%] max-h-[90vh] p-0">
            <PresaleDisabledPopup onClose={closePopup} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showPopup} onOpenChange={closePopup}>
          <DialogContent className="max-w-2xl p-0 border-0 bg-transparent shadow-none">
            <DialogTitle className="sr-only">Presale Disabled</DialogTitle>
            <PresaleDisabledPopup onClose={closePopup} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Presale;
