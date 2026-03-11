import { createClient } from '@supabase/supabase-js';

const getEnvVar = (name: string) => {
    const value = (import.meta.env && import.meta.env[name]) || 
                 (typeof process !== 'undefined' && process.env && process.env[name]) || 
                 '';
    return (value === 'undefined' || value === 'null') ? '' : value;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 ERRO DE CONFIGURAÇÃO: As chaves do Supabase não foram encontradas.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
