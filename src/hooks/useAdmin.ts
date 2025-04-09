
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
      
      // Check if authenticated from localStorage
      const isAuthenticated = localStorage.getItem('admin_authenticated') === 'true';
      
      if (!isAuthenticated) {
        console.log('No active session found');
        setIsAdmin(false);
        return;
      }

      // Create a temporary session in Supabase
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password: 'TristanenTeunopAvans2007#@!'
      });

      if (authError) {
        console.error('Auth error:', authError);
        setError('Authentication failed');
        setIsAdmin(false);
        localStorage.removeItem('admin_authenticated');
        return;
      }

      if (user) {
        // Check admin status in profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          setError('Failed to verify admin status');
          setIsAdmin(false);
          return;
        }

        setIsAdmin(profile?.is_admin || false);
        setUserId(user.id);
        setUserEmail('admin@example.com');
        console.log('Admin status set:', profile?.is_admin);
        sessionChecked.current = true;
      }
      
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
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail, error, checkAdminStatus };
};
