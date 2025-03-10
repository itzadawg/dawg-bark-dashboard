
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://pibsyclrftbwwkkgztek.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYnN5Y2xyZnRid3dra2d6dGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1OTU2NjgsImV4cCI6MjA1NzE3MTY2OH0.iqkvsiGNLojybh4Jhje9khmNRgksu3p_0FBGDkAeREM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
