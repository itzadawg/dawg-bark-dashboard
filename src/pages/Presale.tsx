
import React, { useEffect, useState } from 'react';
import Header from '../components/dashboard/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://pibsyclrftbwwkkgztek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnN5Y2xyZnRid3dra2d6dGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTU2NjgsImV4cCI6MjA1NzE3MTY2OH0.iqkvsiGNLojybh4Jhje9khmNRgksu3p_0FBGDkAeREM';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Presale = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Check for auth errors in URL params
  useEffect(() => {
    // Debug: Log full URL
    console.log('Current URL:', window.location.href);
    
    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get('error');
    const errorDescription = url.searchParams.get('error_description');
    const code = url.searchParams.get('code');
    
    // Log parameters to help diagnose
    setDebugInfo({
      error: errorParam,
      errorDescription: errorDescription,
      hasCode: !!code,
      host: window.location.host,
      origin: window.location.origin
    });
    
    if (errorParam) {
      toast.error(`Authentication error: ${errorDescription || errorParam}`);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnectX = async () => {
    try {
      setIsRedirecting(true);
      toast.info("Connecting to X...");
      
      // Get current absolute URL for the redirect
      const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
      
      // Make sure it's an absolute URL and correctly formatted
      const baseUrl = isLocalhost 
        ? window.location.origin 
        : 'https://itzadawg.com';
      
      const redirectUrl = `${baseUrl}/presale-application`;
      console.log('Redirecting to:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
          // Ensure we don't have any URL issues with encoding
          scopes: 'tweet.read users.read',
        },
      });

      if (error) {
        setIsRedirecting(false);
        toast.error('Failed to connect X account: ' + error.message);
        console.error('Twitter auth error:', error);
      } else {
        console.log('Auth started successfully:', data);
      }
    } catch (error) {
      setIsRedirecting(false);
      toast.error('An unexpected error occurred');
      console.error('X authentication error:', error);
    }
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

        {/* Debug information - Only show in development */}
        {Object.keys(debugInfo).length > 0 && import.meta.env.DEV && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h3 className="font-bold">Debug Info:</h3>
            <pre className="text-xs overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

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
              onClick={handleConnectX}
              disabled={isRedirecting}
              className="w-full py-6 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2"
            >
              <Twitter className="h-5 w-5" />
              {isRedirecting ? 'Connecting...' : 'Connect your X account'}
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
            onClick={handleConnectX}
            disabled={isRedirecting}
            className="py-6 px-8 text-lg neo-brutal-border bg-dawg hover:bg-dawg-secondary flex items-center justify-center gap-2 mx-auto"
          >
            {isRedirecting ? 'Connecting...' : 'Connect with X'} <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>;
};

export default Presale;
