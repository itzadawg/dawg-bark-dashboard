
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        console.log('Checking admin status...');
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }
        
        // If no session exists, set loading to false and return early
        if (!sessionData.session) {
          console.log('No active session found');
          setIsLoading(false);
          return;
        }
        
        const currentUserId = sessionData.session.user.id;
        console.log('Current user ID:', currentUserId);
        setUserId(currentUserId);
        
        // Check if user is admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUserId)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!data?.is_admin;
          console.log('Admin status from database:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => {
      await checkAdminStatus();
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId };
};
