
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sessionChecked = useRef(false);

  const checkAdminStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      if (!session) {
        console.log('No active session found');
        setIsAdmin(false);
        setUserEmail(null);
        setUserId(null);
        return;
      }

      // Set user info from session
      setUserId(session.user.id);
      setUserEmail(session.user.email);
      
      // Check if the user has admin privileges in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      // Set admin status based on profile data
      setIsAdmin(profileData?.is_admin || false);
      console.log('Admin status set to', profileData?.is_admin);
      sessionChecked.current = true;
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Immediate check
    checkAdminStatus();
    
    // Set a fail-safe timeout
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Request timed out. Please refresh the page or try again.');
        console.warn('Admin status check timed out after 5 seconds');
      }
    }, 5000);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        checkAdminStatus();
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail, error, checkAdminStatus };
};
