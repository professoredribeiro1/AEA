import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY : '');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase environment variables! Check if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
