
import { createClient } from '@supabase/supabase-js';

const getEnvVar = (name: string) => {
    const value = (import.meta.env && import.meta.env[name]) ||
        (typeof process !== 'undefined' && process.env && process.env[name]) ||
        '';
    return (value === 'undefined' || value === 'null') ? '' : value;
};

// Fallback values specific to your project pyuivdaujlynvjmtjzjb
const FALLBACK_URL = 'https://pyuivdaujlynvjmtjzjb.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dWl2ZGF1amx5bnZqbXRqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjEyMTMsImV4cCI6MjA4ODgzNzIxM30.fs0rLf-muDV3j436fLKY5lTHlgFGK0RQlKr4LcFYBAU';

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || FALLBACK_KEY;

if (!getEnvVar('VITE_SUPABASE_URL')) {
    console.warn('⚠️ VITE_SUPABASE_URL não encontrada. Usando fallback do projeto pyuivdaujlynvjmtjzjb.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
