
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Started checking admin status...');
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // If no session exists, set loading to false and return early
        if (!sessionData.session) {
          console.log('No active session found');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        const currentUserId = sessionData.session.user.id;
        const userEmail = sessionData.session.user.email;
        
        console.log('Current user ID:', currentUserId);
        console.log('User email:', userEmail);
        
        setUserId(currentUserId);
        setUserEmail(userEmail);
        
        // Check if user is admin
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUserId)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        const adminStatus = !!data?.is_admin;
        console.log('Admin status from database:', adminStatus);
        setIsAdmin(adminStatus);
        
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
        console.log('Finished checking admin status');
      }
    };
    
    checkAdminStatus();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsLoading(true);
        await checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserId(null);
        setUserEmail(null);
        setIsLoading(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail };
};
