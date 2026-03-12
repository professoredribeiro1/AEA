
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
    console.error('🚨 ERRO DE CONFIGURAÇÃO: As chaves do Supabase não foram encontradas. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

// Usamos um placeholder se as variáveis estiverem ausentes para evitar crash imediato no import,
// mas o cliente não funcionará. Registramos o erro acima.
const placeholderUrl = 'https://pyuivdaujlynvjmtjzjb.supabase.co';
const placeholderKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

export const supabase = createClient(
    supabaseUrl || placeholderUrl,
    supabaseAnonKey || placeholderKey
);
