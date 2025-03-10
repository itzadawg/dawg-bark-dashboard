
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, AlertTriangle, Twitter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdmin, isLoading, userEmail, error, checkAdminStatus } = useAdmin();
  const navigate = useNavigate();
  const [isTwitterAuthInProgress, setIsTwitterAuthInProgress] = useState(false);

  const handleTwitterSignIn = async () => {
    try {
      setIsTwitterAuthInProgress(true);
      const redirectUrl = window.location.origin + '/admin';
      console.log('Redirect URL for Twitter auth:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Twitter auth error:', error);
        toast.error('Twitter authentication failed. Please try again.');
        setIsTwitterAuthInProgress(false);
      } else {
        console.log('Twitter auth initiated:', data);
        // Don't set authInProgress to false here as we're redirecting
        // The page will reload after auth, which will reset this state
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed. Please try again.');
      setIsTwitterAuthInProgress(false);
    }
  };

  const handleRetry = () => {
    setIsTwitterAuthInProgress(false);
    checkAdminStatus();
  };

  useEffect(() => {
    // Check for auth callback in URL to detect returning from Twitter auth
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.has('access_token')) {
      console.log('Detected auth callback in URL');
      // Give a moment for auth state to update before checking admin status
      const timer = setTimeout(() => {
        checkAdminStatus();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [checkAdminStatus]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
        <span>Checking admin status...</span>
        <p className="text-sm text-gray-500 mt-2">
          This should only take a moment...
        </p>
        <Button 
          variant="outline" 
          onClick={handleRetry} 
          className="mt-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (isTwitterAuthInProgress) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
        <span>Authenticating with Twitter...</span>
        <p className="text-sm text-gray-500 mt-2">
          You will be redirected to Twitter...
        </p>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
        <p className="text-center max-w-md mb-4 text-gray-600">{error}</p>
        <div className="flex space-x-4">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
          <Button 
            onClick={handleTwitterSignIn}
            className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0c85d0]"
          >
            <Twitter className="h-4 w-4" />
            Sign in with Twitter
          </Button>
        </div>
      </div>
    );
  }

  // User is admin, show children with the Twitter sign-in button in the top right
  if (isAdmin) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={handleTwitterSignIn}
            className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0c85d0]"
            size="sm"
          >
            <Twitter className="h-4 w-4" />
            Twitter Sign In
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // User is not an admin, show access required message with the Twitter sign-in button
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
      <p className="text-center max-w-md mb-6">
        You need admin privileges to view this page. Please sign in with Twitter if you have admin access.
      </p>
      
      <Button 
        onClick={handleTwitterSignIn}
        className="mb-4 flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0c85d0]"
      >
        <Twitter className="h-5 w-5" />
        Sign in with Twitter
      </Button>
      
      {userEmail && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p>Signed in as: <strong>{userEmail}</strong></p>
          <p className="text-sm text-gray-500">This account doesn't have admin permissions.</p>
        </div>
      )}
      
      <Link to="/" className="text-dawg hover:underline">
        Return to Home
      </Link>
    </div>
  );
};
