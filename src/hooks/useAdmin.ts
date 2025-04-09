
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

  // Admin credentials - in a real app, these would be stored securely in a database
  const ADMIN_USERNAME = "TristanenTeun";
  const ADMIN_PASSWORD = "TristanenTeunopAvans2007#@!";

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

      // Simple admin authentication based on localStorage
      // We'll mark the user as admin directly based on localStorage
      // This is still using localStorage but at least verifies against the hardcoded credentials
      // during login in AdminProtected.tsx
      setIsAdmin(true);
      setUserId('admin');
      setUserEmail('admin@example.com');
      console.log('Admin status set to true');
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
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return { isAdmin, isLoading, userId, userEmail, error, checkAdminStatus };
};
