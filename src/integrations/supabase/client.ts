
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pibsyclrftbwwkkgztek.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnN5Y2xyZnRid3dra2d6dGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTU2NjgsImV4cCI6MjA1NzE3MTY2OH0.iqkvsiGNLojybh4Jhje9khmNRgksu3p_0FBGDkAeREM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'dawg-auth-token',
      autoRefreshToken: true,
    }
  }
);
