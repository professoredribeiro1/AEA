import { supabase } from "./supabase";

/**
 * Esse serviço agora chama as Supabase Edge Functions.
 * A chave do Gemini fica protegida no servidor do Supabase.
 */

export async function getCoachAdvice(userMessage: string) {
  try {
    const persona = "Você é o 'Conselheiro Pastoral' de felicidade conjugal. PERSONA: Prático, acolhedor e focado em soluções baseadas em princípios bíblicos e sabedoria prática. OBJETIVO: Sugerir micro-ações imediatas para melhorar o clima da casa.";
    
    const { data, error } = await supabase.functions.invoke('pastoral-counselor', {
      body: { message: userMessage, persona }
    });

    if (error) throw error;
    return data.response;
  } catch (error) {
    console.error("❌ Erro no Conselheiro Pastoral:", error);
    return "O Conselheiro Pastoral está em oração no momento. Tente novamente em instantes.";
  }
}

export async function generateDailyMission(
  targetName: string,
  targetLanguage: string,
  dayNumber: number,
  cycleNumber: number
) {
  try {
    const { data, error } = await supabase.functions.invoke('pastoral-counselor', {
      body: { 
        message: `Gere uma missão diária para ${targetName} (Linguagem: ${targetLanguage}). Dia ${dayNumber}, Ciclo ${cycleNumber}. Retorne apenas JSON.`,
        persona: "Especialista em Gary Chapman. Retorne apenas JSON: { \"title\": \"\", \"description\": \"\", \"rationale\": \"\" }"
      }
    });

    if (error) throw error;
    // Tenta fazer o parse caso a função retorne string
    return typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
  } catch (error) {
    console.error("❌ Erro na Missão Diária:", error);
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
