import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Environment configuration with development fallbacks
const config = {
  url: import.meta.env.VITE_SUPABASE_URL || (import.meta.env.DEV ? 'https://alhehmvhhrktxomiwvwq.supabase.co' : ''),
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || (import.meta.env.DEV ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsaGVobXZoaHJrdHhvbWl3dndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5NDQzMzgsImV4cCI6MjA0OTUyMDMzOH0.n7o2xW7pE07ux07pSNMKBAy7IRejANgJQQSTHAh-7q0' : ''),
  isDevelopment: import.meta.env.DEV,
} as const;

// Validate configuration
if (!config.isDevelopment && (!config.url || !config.anonKey)) {
  throw new Error('Missing required Supabase environment variables in production');
} else if (config.isDevelopment && (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY)) {
  console.warn(
    'Missing Supabase environment variables in development. Using fallback values.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create and export the Supabase client
export const supabase = createClient<Database>(config.url, config.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});