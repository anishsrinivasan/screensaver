// Video player configuration
export const VIDEO_PLAYER_CONFIG = {
  PLAY_ATTEMPTS: 3,
  PLAY_RETRY_DELAY: 1000,
  LOADING_DELAY: 2000,
  CONTROLS_TIMEOUT: 3000,
} as const;

// Environment configuration
export const ENV_CONFIG = {
  DEVELOPMENT: import.meta.env.DEV,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const;

// Supabase configuration
export const SUPABASE_CONFIG = {
  AUTH: {
    PERSIST_SESSION: true,
    AUTO_REFRESH_TOKEN: true,
  },
} as const;