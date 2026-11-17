import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wqtavzkfwbnhefabgzou.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_f3ZUFQrn3vbW7BCKmZrcBQ_wO_MbntT';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to test connectivity safely
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    return {
      connected: !error || error.code === 'PGRST205',
      endpoint: supabaseUrl,
      error: error ? error.message : null
    };
  } catch (err) {
    return {
      connected: false,
      endpoint: supabaseUrl,
      error: err.message
    };
  }
};
