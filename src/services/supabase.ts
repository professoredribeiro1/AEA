
import { createClient } from '@supabase/supabase-js';

// Função para pegar a variável de qualquer lugar possível (Vite ou Node/Define)
const getEnv = (name: string): string => {
    // 1. Tenta import.meta.env (Padrão Vite)
    if (import.meta.env && import.meta.env[name]) return import.meta.env[name];

    // 2. Tenta process.env (Injetado pelo define do vite.config.ts ou ambiente Node)
    if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];

    return '';
};

// Configurações do projeto pyuivdaujlynvjmtjzjb
const DEFAULT_URL = 'https://pyuivdaujlynvjmtjzjb.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dWl2ZGF1amx5bnZqbXRqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjEyMTMsImV4cCI6MjA4ODgzNzIxM30.fs0rLf-muDV3j436fLKY5lTHlgFGK0RQlKr4LcFYBAU';

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔗 Supabase inicializado para:', supabaseUrl);
