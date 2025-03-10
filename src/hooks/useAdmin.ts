
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      
      // Get current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError.message);
        setError('Failed to retrieve session');
        setIsAdmin(false);
        return;
      }
      
      // No active session
      if (!sessionData.session) {
        console.log('No active session found');
        setIsAdmin(false);
        return;
      }
      
      const user = sessionData.session.user;
      setUserId(user.id);
      setUserEmail(user.email);
      
      // Check admin status
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error checking admin status:', profileError.message);
        setError('Failed to verify admin status');
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(!!data?.is_admin);
      console.log('Admin status set:', !!data?.is_admin);
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
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      // Only update admin status for these events
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAdminStatus();
      } 
      else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserId(null);
        setUserEmail(null);
        setIsLoading(false);
      }
    });
    
    return () => {
      clearTimeout(timeoutId);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail, error, checkAdminStatus };
};
