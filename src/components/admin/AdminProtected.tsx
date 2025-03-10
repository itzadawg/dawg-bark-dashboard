
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminProtectedProps {
  children: ReactNode;
}

export const AdminProtected: React.FC<AdminProtectedProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AdminProtected: isAdmin =', isAdmin, 'isLoading =', isLoading);
    
    // If we're done loading and the user is not an admin, show a toast message
    if (!isLoading && !isAdmin) {
      toast.error('Admin access required');
      navigate('/', { replace: true });
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
    return null; // We're handling the redirect in the useEffect
  }

  return <>{children}</>;
};
