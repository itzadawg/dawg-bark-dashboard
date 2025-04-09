
import React, { ReactNode, useEffect } from 'react';
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
  const [authInProgress, setAuthInProgress] = React.useState(false);

  // Check for auth redirect in URL
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.has('access_token')) {
      // Give supabase client time to process the token
      const timeout = setTimeout(() => {
        checkAdminStatus();
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [checkAdminStatus]);

  const handleTwitterSignIn = async () => {
    try {
      setAuthInProgress(true);
      toast.info('Redirecting to Twitter login...');
      
      const redirectUrl = `${window.location.origin}/admin`;
      console.log('Redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      
    } catch (error: any) {
      console.error('Twitter auth error:', error);
      toast.error('Authentication failed: ' + error.message);
      setAuthInProgress(false);
    }
  };

  // Always show the Twitter login button for ease of access
  const renderTwitterButton = () => (
    <Button 
      onClick={handleTwitterSignIn}
      disabled={authInProgress}
      className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#0c85d0] rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] border-2 border-[#0c85d0] transform hover:translate-y-[-2px] transition-all duration-200"
    >
      {authInProgress ? <Loader2 className="h-4 w-4 animate-spin" /> : <Twitter className="h-4 w-4" />}
      {authInProgress ? 'Connecting...' : 'Sign in with Twitter'}
    </Button>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="bg-white rounded-2xl border-2 border-dawg-dark p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin text-dawg mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-2 text-center">Checking Admin Status</h2>
          <p className="text-gray-600 text-center mb-6">This should only take a moment...</p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={checkAdminStatus} 
              variant="outline"
              className="rounded-xl border-2 border-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transform hover:translate-y-[-2px] transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            
            {renderTwitterButton()}
            
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:underline mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="bg-white rounded-2xl border-2 border-dawg-dark p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-md w-full">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-2 text-center">Authentication Error</h2>
          <p className="text-center max-w-md mb-6 text-gray-600">{error}</p>
          
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={checkAdminStatus} 
              variant="outline"
              className="rounded-xl border-2 border-gray-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] transform hover:translate-y-[-2px] transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            {renderTwitterButton()}
            
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:underline mt-2"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          {renderTwitterButton()}
        </div>
        {children}
      </div>
    );
  }

  // Not an admin
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-2xl border-2 border-dawg-dark p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] max-w-md w-full">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4 mx-auto" />
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Access Required</h1>
        <p className="text-center max-w-md mb-6">
          You need admin privileges to view this page. Please sign in with Twitter if you have admin access.
        </p>
        
        <div className="flex flex-col items-center gap-4">
          {renderTwitterButton()}
          
          {userEmail && (
            <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.05)] text-center w-full">
              <p>Signed in as: <strong>{userEmail}</strong></p>
              <p className="text-sm text-gray-500">This account doesn't have admin permissions.</p>
            </div>
          )}
          
          <Link to="/" className="text-dawg hover:underline mt-2">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
