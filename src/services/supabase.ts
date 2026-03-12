
import { createClient } from '@supabase/supabase-js';

// No Vite com Vercel, o recomendado é usar import.meta.env puramente para variáveis VITE_
// mas mantemos o fallback por segurança caso o build transpile de forma diferente.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pyuivdaujlynvjmtjzjb.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dWl2ZGF1amx5bnZqbXRqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjEyMTMsImV4cCI6MjA4ODgzNzIxM30.fs0rLf-muDV3j436fLKY5lTHlgFGK0RQlKr4LcFYBAU';

// Exportando o cliente já inicializado
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log de depuração (aparece no console do navegador do usuário)
console.log('🔌 Conectando ao Supabase:', supabaseUrl);
