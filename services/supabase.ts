import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL) : '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) : '');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Missing Supabase environment variables! Check if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel.');
}

// Use a placeholder if variables are missing to avoid top-level crash, but log a clear error.
const placeholderUrl = 'https://missing-project-url.supabase.co';
const placeholderKey = 'missing-anon-key';

export const supabase = createClient(
    supabaseUrl || placeholderUrl,
    supabaseAnonKey || placeholderKey
);
