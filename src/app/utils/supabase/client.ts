import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xiqwtbsjgchmpbupunra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcXd0YnNqZ2NobXBidXB1bnJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzc5NDMsImV4cCI6MjA3OTY1Mzk0M30.VNN7Dp0CkPv8ZVoX9IRSw6uso_2BM3msX3c7rEloxIY';

// Create a singleton Supabase client with proper auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use PKCE flow (more secure, returns code in URL query)
    flowType: 'pkce',
    // Automatically detect session from URL on page load
    detectSessionInUrl: true,
    // Store session in localStorage
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
    // Auto refresh tokens
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Export these for API calls
export { supabaseUrl, supabaseAnonKey };