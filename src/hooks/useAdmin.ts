
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
        setIsLoading(true);
        console.log('Checking admin status...');
        
        // Get current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          toast.error('Error verifying admin status');
          setIsLoading(false);
          return;
        }
        
        // If no session exists, set loading to false and return early
        if (!sessionData.session) {
          console.log('No active session found');
          toast.error('Please sign in to access admin features');
          setIsLoading(false);
          return;
        }
        
        const currentUserId = sessionData.session.user.id;
        const userEmail = sessionData.session.user.email;
        console.log('Current user ID:', currentUserId);
        console.log('User email:', userEmail);
        console.log('Auth provider:', sessionData.session.user.app_metadata.provider);
        console.log('User metadata:', sessionData.session.user.user_metadata);
        
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
          toast.error('Error checking admin permissions');
          setIsAdmin(false);
        } else {
          const adminStatus = !!data?.is_admin;
          console.log('Admin status from database:', adminStatus);
          
          if (adminStatus) {
            toast.success('Admin access granted');
          } else {
            toast.error('You do not have admin access');
          }
          
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Unexpected error checking admin status:', error);
        toast.error('Unexpected error checking admin status');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkAdminStatus();
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
        setUserId(null);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail };
};
