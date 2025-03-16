import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//export const supabase = createClient(supabaseUrl, supabaseAnonKey, {auth: { persistSession: false, autoRefreshToken: false }});
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {global: { }});
