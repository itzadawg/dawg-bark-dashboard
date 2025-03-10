
import React, { ReactNode, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, AlertTriangle, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface AdminProtectedProps {
  children: ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdmin, isLoading, userEmail } = useAdmin();
  const navigate = useNavigate();

  const handleTwitterSignIn = async () => {
    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      console.log('Redirect URL for Twitter auth:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Twitter auth error:', error);
      } else {
        console.log('Twitter auth initiated:', data);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  useEffect(() => {
    console.log('AdminProtected: isAdmin =', isAdmin, 'isLoading =', isLoading, 'userEmail =', userEmail);
    
    if (!isLoading && !isAdmin) {
      const redirectTimer = setTimeout(() => navigate('/', { replace: true }), 2000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-dawg" />
        <span className="ml-2">Checking admin status...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
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
  }

  return <>{children}</>;
};
