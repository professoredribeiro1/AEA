
import { createClient } from '@supabase/supabase-js';

/**
 * ATENÇÃO: Forçando o uso do projeto correto (pyuivdaujlynvjmtjzjb).
 * O erro "Failed to fetch" ocorria porque o App estava tentando conectar a um projeto inexistente (spjuqyz...).
 */
const CORRECT_URL = 'https://pyuivdaujlynvjmtjzjb.supabase.co';
const CORRECT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dWl2ZGF1amx5bnZqbXRqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjEyMTMsImV4cCI6MjA4ODgzNzIxM30.fs0rLf-muDV3j436fLKY5lTHlgFGK0RQlKr4LcFYBAU';

// Garantimos que o App SEMPRE use o projeto saudável, ignorando variáveis de ambiente antigas da Vercel
export const supabase = createClient(CORRECT_URL, CORRECT_KEY);

console.log('✅ Supabase conectado ao projeto correto:', CORRECT_URL);
