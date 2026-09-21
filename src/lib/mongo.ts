import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export function getSupabaseClient() {
  const url = supabaseUrl;
  const key = supabaseServiceKey || supabaseAnonKey;

  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

export async function getMenuCollection() {
  const supabase = getSupabaseClient();
  return supabase.from('menu_state');
}
