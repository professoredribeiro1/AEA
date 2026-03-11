import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
    // Tenta primeiro o padrão do Vite, depois o padrão do Node/Vercel
    return import.meta.env[key] || (process.env as any)[key] || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('🚨 ERRO DE CONFIGURAÇÃO: As chaves do Supabase não foram encontradas.');
    console.log('Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configuradas corretamente.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
