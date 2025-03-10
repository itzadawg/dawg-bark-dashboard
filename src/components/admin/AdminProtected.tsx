
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, AlertTriangle, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedProps {
  children: ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdmin, isLoading, userEmail } = useAdmin();
  const navigate = useNavigate();
  const [authInProgress, setAuthInProgress] = useState(false);

  const handleTwitterSignIn = async () => {
    try {
      setAuthInProgress(true);
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
        setAuthInProgress(false);
      } else {
        console.log('Twitter auth initiated:', data);
        // Don't set authInProgress to false here as we're redirecting
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthInProgress(false);
    }
  };

  useEffect(() => {
    console.log('AdminProtected: isAdmin =', isAdmin, 'isLoading =', isLoading, 'userEmail =', userEmail);
    
    // Only redirect if we're not loading and the user is not an admin
    if (!isLoading && !isAdmin) {
      console.log('User is not an admin. Will show non-admin content.');
      // Don't navigate automatically - we'll show the admin access required screen instead
    }
  }, [isAdmin, isLoading, navigate]);

  // Show loading state
  if (isLoading || authInProgress) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-dawg mb-4" />
        <span>{isLoading ? "Checking admin status..." : "Authenticating with Twitter..."}</span>
        <p className="text-sm text-gray-500 mt-2">
          {isLoading ? "This should only take a moment..." : "You will be redirected to Twitter..."}
        </p>
      </div>
    );
  }

  // User is admin, show children and the Twitter sign-in button
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

  // Show not admin message and Twitter sign-in button
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
