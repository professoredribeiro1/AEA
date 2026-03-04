import { supabase } from './supabase';
import { LoveLanguage, Challenge } from '../types';

export interface SupabaseProfile {
    id: string;
    full_name: string | null;
    tank_level: number;
    languages: LoveLanguage[];
    couple_code: string | null;
    partner_id: string | null;
    challenge: Challenge | null;
    plan_type: string | null;
    subscription_status: string | null;
    expires_at: string | null;
}

/**
 * Gera um código de casal único e salva no perfil do usuário ao criar conta.
 */
export const ensureCoupleCode = async (userId: string): Promise<string> => {
    // Verificar se já tem código
    const { data } = await supabase.from('profiles').select('couple_code').eq('id', userId).single();
    if (data?.couple_code) return data.couple_code;

    // Gerar novo código único
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    await supabase.from('profiles').update({ couple_code: code }).eq('id', userId);
    return code;
};

/**
 * Busca o perfil completo do usuário logado.
 */
export const fetchMyProfile = async (userId: string): Promise<SupabaseProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, tank_level, languages, couple_code, partner_id, challenge, plan_type, subscription_status, expires_at')
        .eq('id', userId)
        .single();

    if (error || !data) return null;
    return data as SupabaseProfile;
};

/**
 * Busca perfil do parceiro pelo partner_id.
 */
export const fetchPartnerProfile = async (partnerId: string): Promise<SupabaseProfile | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, tank_level, languages, couple_code, partner_id, challenge, plan_type, subscription_status, expires_at')
        .eq('id', partnerId)
        .single();

    if (error || !data) return null;
    return data as SupabaseProfile;
};

/**
 * Vincula dois usuários pelo couple_code do parceiro.
 * Retorna o perfil do parceiro se encontrado, ou null.
 */
export const linkWithPartner = async (myUserId: string, partnerCode: string): Promise<SupabaseProfile | null> => {
    const { data, error } = await supabase.rpc('link_partners', {
        my_user_id: myUserId,
        p_code: partnerCode.toUpperCase().trim()
    });

    if (error || !data || !data.success) {
        console.error('Erro ao vincular parceiro:', error || data?.error);
        return null;
    }

    return data.partner as SupabaseProfile;
};

/**
 * Atualiza o nível do termômetro do usuário no banco.
 */
export const updateTankLevel = async (userId: string, level: number): Promise<void> => {
    await supabase.from('profiles').update({ tank_level: level }).eq('id', userId);
};

/**
 * Salva as linguagens do amor do usuário no banco.
 */
export const updateLanguages = async (userId: string, languages: LoveLanguage[]): Promise<void> => {
    await supabase.from('profiles').update({ languages }).eq('id', userId);
};

/**
 * Salva o estado do desafio do usuário.
 */
export const updateChallenge = async (userId: string, challenge: Challenge): Promise<void> => {
    await supabase.from('profiles').update({ challenge }).eq('id', userId);
};
