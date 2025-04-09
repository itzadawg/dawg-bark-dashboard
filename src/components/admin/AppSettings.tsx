
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AppSetting {
  id: string;
  key: string;
  value: boolean | string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

const AppSettings = () => {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) throw error;
      
      if (data) {
        // Process data to ensure values are correctly typed
        const processedSettings = data.map((setting: any) => ({
          ...setting,
          value: setting.value === 'true' ? true : 
                 setting.value === 'false' ? false : 
                 setting.value
        }));
        
        setSettings(processedSettings);
      } else if (!data || data.length === 0) {
        // If no settings exist, we'll create default ones
        await initializeDefaultSettings();
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load application settings');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSettings = async () => {
    const defaultSettings = [
      {
        key: 'enable_presale_applications',
        value: true,
        description: 'Enable/disable the ability to apply for presale'
      }
    ];

    try {
      const { error } = await supabase
        .from('app_settings')
        .insert(defaultSettings.map(setting => ({
          key: setting.key,
          value: String(setting.value), // Convert boolean to string
          description: setting.description
        })));

      if (error) throw error;
      
      await fetchSettings();
    } catch (error) {
      console.error('Error initializing settings:', error);
      toast.error('Failed to initialize application settings');
    }
  };

  const updateSetting = async (id: string, value: boolean | string) => {
    const settingToUpdate = settings.find(s => s.id === id);
    if (!settingToUpdate) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('app_settings')
        .update({ value: String(value) }) // Convert to string
        .eq('id', id);

      if (error) throw error;
      
      setSettings(settings.map(s => 
        s.id === id ? { ...s, value } : s
      ));
      
      toast.success(`Setting updated successfully`);
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSetting = (id: string, currentValue: boolean) => {
    updateSetting(id, !currentValue);
  };

  const resetAllSettings = async () => {
    try {
      setSaving(true);
      
      // Delete all existing settings
      const { error: deleteError } = await supabase
        .from('app_settings')
        .delete()
        .neq('id', '0'); // Delete all records
        
      if (deleteError) throw deleteError;
      
      // Re-initialize default settings
      await initializeDefaultSettings();
      
      toast.success('Settings reset to defaults');
      setIsResetDialogOpen(false);
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-dawg" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Application Settings</h2>
        <Button 
          variant="outline" 
          onClick={() => setIsResetDialogOpen(true)}
          className="border-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          Reset to Defaults
        </Button>
      </div>

      <div className="space-y-4">
        {settings.map(setting => (
          <div key={setting.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]">
            <div>
              <Label htmlFor={`setting-${setting.id}`} className="text-lg font-medium">
                {setting.key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Label>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <Switch
              id={`setting-${setting.id}`}
              disabled={saving}
              checked={typeof setting.value === 'boolean' ? setting.value : setting.value === 'true'}
              onCheckedChange={() => handleToggleSetting(
                setting.id, 
                typeof setting.value === 'boolean' ? setting.value : setting.value === 'true'
              )}
              className="data-[state=checked]:bg-dawg"
            />
          </div>
        ))}
      </div>

      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Settings?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all application settings to their default values. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={resetAllSettings}
              className="bg-red-500 hover:bg-red-600"
            >
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppSettings;
