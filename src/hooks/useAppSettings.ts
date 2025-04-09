
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface AppSetting {
  id: string;
  key: string;
  value: boolean | string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) throw error;
      
      if (data) {
        // Convert array of settings to an object for easier access
        const settingsObject = data.reduce((acc: Record<string, any>, setting: any) => {
          // For boolean settings stored as strings, convert them to actual booleans
          if (setting.value === 'true' || setting.value === 'false') {
            acc[setting.key] = setting.value === 'true';
          } else {
            acc[setting.key] = setting.value;
          }
          return acc;
        }, {});
        
        setSettings(settingsObject);
      }
    } catch (err: any) {
      console.error('Error fetching app settings:', err);
      setError(err.message || 'Failed to load application settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Set up a subscription to listen for changes in the app_settings table
    const subscription = supabase
      .channel('app_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'app_settings' },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { 
    settings, 
    loading, 
    error,
    refetch: fetchSettings
  };
};
