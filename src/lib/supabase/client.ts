import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { ENV_CONFIG, SUPABASE_CONFIG } from '@/config/constants';

// Validate environment variables
if (!ENV_CONFIG.DEVELOPMENT && (!ENV_CONFIG.VITE_SUPABASE_URL || !ENV_CONFIG.VITE_SUPABASE_ANON_KEY)) {
  throw new Error('Missing required Supabase environment variables in production');
} else if (ENV_CONFIG.DEVELOPMENT && (!ENV_CONFIG.VITE_SUPABASE_URL || !ENV_CONFIG.VITE_SUPABASE_ANON_KEY)) {
  console.warn(
    'Missing Supabase environment variables in development.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create and export the Supabase client
export const supabase = createClient<Database>(
  ENV_CONFIG.VITE_SUPABASE_URL || '',
  ENV_CONFIG.VITE_SUPABASE_ANON_KEY || '',
  {
    auth: SUPABASE_CONFIG.AUTH,
  }
);