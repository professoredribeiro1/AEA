import { supabase } from "./supabase";

/**
 * Esse serviço agora chama as Supabase Edge Functions.
 * Aceita os parâmetros antigos para não quebrar o build do Vercel,
 * mas usa a rota segura do servidor.
 */

export async function getCoachAdvice(userMessage: string, _history?: any) {
  try {
    const persona = "Você é o 'Conselheiro Pastoral' de felicidade conjugal. PERSONA: Prático, acolhedor e focado em soluções baseadas em princípios bíblicos e sabedoria prática. OBJETIVO: Sugerir micro-ações imediatas para melhorar o clima da casa.";
    
    const { data, error } = await supabase.functions.invoke('pastoral-counselor', {
      body: { message: userMessage, persona }
    });

    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error("❌ Erro no Conselheiro:", error);
    return "O Conselheiro Pastoral está em oração no momento. Tente novamente em instantes.";
  }
}

export async function generateDailyMission(
  targetName: string,
  targetLanguage: string,
  dayNumber: number,
  cycleNumber: number,
  _isLighter?: boolean,
  _rejected?: string[]
) {
  try {
    const { data, error } = await supabase.functions.invoke('pastoral-counselor', {
      body: { 
        message: `Crie uma missão diária na Linguagem de Amor: "${targetLanguage}" para eu fazer para ${targetName}. Dia ${dayNumber}, Ciclo ${cycleNumber}. 
IMPORTANTE: A missão deve ser simples, exigir pouca logística e nenhum gasto financeiro, mas deve ter um IMPACTO EMOCIONAL PROFUNDO e ser muito SIGNIFICATIVA. Deve promover conexão genuína e amor sacrificial.
Retorne APENAS o JSON válido.`,
        persona: `Você é um especialista em casamentos e nas 5 Linguagens do Amor (Gary Chapman), com forte sabedoria pastoral. 
Sua tarefa é elaborar micro-ações que toquem a alma do cônjuge, fortalecendo a intimidade sem exigir malabarismos.
Retorne ESTRITAMENTE este formato JSON: { "title": "Título criativo e tocante", "description": "O que fazer detalhadamente. Seja simples, mas profundo.", "rationale": "A explicação psicológica e espiritual do porquê essa ação atinge diretamente o coração de quem possui essa linguagem." }`
      }
    });

    if (error) throw error;
    return typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
  } catch (error) {
    console.error("❌ Erro na Missão:", error);
    return null;
  }
}

export async function validateMission(
  mission: { title: string; description: string },
  userRelato: string,
  partnerName: string
) {
  try {
    const { data, error } = await supabase.functions.invoke('pastoral-counselor', {
      body: { 
        message: `Avalie o relato: "${userRelato}" para a missão "${mission.title}" para ${partnerName}.`,
        persona: "Avaliador amoroso. Retorne JSON: { \"feedback\": \"\", \"impact\": 0.5, \"success\": true }"
      }
    });

    if (error) throw error;
    return typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
  } catch (error) {
    return { feedback: "Sua dedicação é o mais importante!", impact: 0.5, success: true };
  }
}
export const getMissionCompletionFeedback = validateMission;
