/**
 * Supabase Admin Client - Server Side
 * Uses the service role key for admin operations on Supabase Auth
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL is missing from environment variables');
}

// Admin client (uses secret key) - for server-side operations like verifying users
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Public client (uses publishable key) - for auth operations
export const supabasePublic = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY };
