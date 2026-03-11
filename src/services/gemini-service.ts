
import { GoogleGenAI, Type } from "@google/genai";
import { LoveLanguage, Mission } from "../types";

/**
 * Robustly retrieves the Gemini API Key from multiple possible environment sources.
 * In Vite/Vercel, we prioritize VITE_ prefixed variables.
 */
const getApiKey = () => {
  // Try to get from import.meta.env (Vite standard)
  const viteKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
  if (viteKey && viteKey !== 'undefined' && viteKey !== 'null') return viteKey;

  // Fallback to process.env (Node/Build-time standard)
  if (typeof process !== 'undefined' && process.env) {
    const procKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (procKey && procKey !== 'undefined' && procKey !== 'null') return procKey;
  }

  return '';
};

/**
 * Creates a fresh instance of GoogleGenAI.
 * Following guidelines to instantiate right before use to ensure latest key is used.
 */
const createAiClient = () => {
  const key = getApiKey();
  if (!key) {
    console.error("❌ Erro: Chave de API Gemini não encontrada. Verifique as variáveis de ambiente (VITE_GEMINI_API_KEY).");
    return null;
  }
  
  try {
    return new GoogleGenAI({ apiKey: key });
  } catch (err) {
    console.error("❌ Erro ao instanciar GoogleGenAI:", err);
    return null;
  }
};

export const generateDailyMission = async (
  targetLanguage: LoveLanguage, 
  targetName: string, 
  dayNumber: number, 
  cycleNumber: number = 1,
  isLighter: boolean = false,
  rejectedDescriptions: string[] = []
): Promise<Partial<Mission>> => {
  const ai = createAiClient();
  if (!ai) return { title: 'Configuração Pendente', description: 'Por favor, configure sua chave de API Gemini nas variáveis de ambiente.', rationale: '' };

  if (!targetLanguage || !targetName) {
    return { title: 'Dados Incompletos', description: 'Certifique-se de que as linguagens do amor do parceiro estão configuradas.', rationale: '' };
  }

  const themes = [
    "Fundação e Reconexão Básica",
    "Intimidade e Vulnerabilidade",
    "Aventura e Quebra de Rotina",
    "Legado e Projetos de Vida",
    "Espiritualidade e Propósito"
  ];
  const currentTheme = themes[(cycleNumber - 1) % themes.length];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma missão prática de "Amor Sacrificial" ${isLighter ? 'LEVE E SUAVE ' : ''}para o dia ${dayNumber} do Ciclo ${cycleNumber} (Tema: ${currentTheme}). O alvo é "${targetName}" e sua linguagem do amor predominante é "${targetLanguage}".
      ${rejectedDescriptions.length > 0 ? `EVITE as seguintes ideias ou descrições que já foram recusadas: ${rejectedDescriptions.join('; ')}` : ''}`,
      config: {
        systemInstruction: `Você é um mentor de relacionamentos especialista no método de Gary Chapman.
        SEU OBJETIVO: Criar uma tarefa simples, curta e potente que fortaleça o vínculo com ${targetName} através da linguagem "${targetLanguage}".
        
        ${isLighter ? 'REQUISITO ESPECIAL: Esta missão deve ser EXTREMAMENTE LEVE, PASSIVA e TOTALMENTE DIFERENTE da missão anterior. Ela deve ser focada em pequenos gestos que não exijam quase nenhum esforço emocional ou interação direta obrigatória, ideal para quando o usuário está se sentindo muito machucado, exausto ou desconfortável. Não deve ter NENHUMA relação com a tarefa que o usuário recusou. Foque em atos de bondade silenciosos, oração, ou pequenos cuidados que curem sem pressionar o usuário a se expor.' : ''}
  
        CONTEXTO DO CICLO:
        Estamos no Ciclo ${cycleNumber} com o tema "${currentTheme}". 
        ${cycleNumber === 1 ? 'Foque em ações simples de reconexão.' : 'Foque em ações mais profundas, criativas e que exijam maior entrega emocional.'}
  
        REGRAS PARA A MISSÃO:
        1. SIMPLICIDADE ABSOLUTA: A tarefa deve ser realizável em menos de 15 minutos e não deve exigir gastos financeiros significativos ou logística complexa.
        2. REPLICABILIDADE: Foque em ações que possam se tornar hábitos. O usuário deve sentir que "pode fazer isso sempre".
        3. CONEXÃO DIRETA: A missão deve atingir o coração da linguagem "${targetLanguage}". 
        4. TOM: Inspirador, prático e focado no cuidado.
        
        ESTRUTURA:
        - title: Nome curto e acionável.
        - description: Instrução passo a passo de como executar.
        - rationale: Explicação breve de por que esse pequeno gesto é um "depósito" gigante no tanque emocional de quem fala "${targetLanguage}".`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            rationale: { type: Type.STRING }
          },
          required: ["title", "description", "rationale"]
        }
      }
    });
    return JSON.parse(response.text?.trim() || '{}');
  } catch (error) {
    console.error("❌ Erro ao gerar missão diária:", error);
    return { title: 'Erro na IA', description: 'Não foi possível gerar a missão no momento.', rationale: '' };
  }
};

export const getMissionCompletionFeedback = async (
  mission: Mission, 
  partnerName: string, 
  userRelato: string
): Promise<{ feedback: string, impact: number, success: boolean }> => {
  const ai = createAiClient();
  if (!ai) return { feedback: "IA não configurada", impact: 0, success: false };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Missão: "${mission.title}". 
      O que foi pedido: "${mission.description}".
      Relato do usuário: "${userRelato}". 
      Avalie o cumprimento desta pequena meta diária para ${partnerName}.`,
      config: {
        systemInstruction: `Analise o relato de cumprimento.
        - Valorize a consistência e a intenção, não a grandiosidade.
        - Se o usuário descreveu o que fez com sinceridade, success é true.
        - Ofereça um feedback encorajador que mostre como esse pequeno passo constrói uma relação inabalável.
        - Impact: Atribua de 0.3 a 1.5 baseado no nível de conexão demonstrado no relato.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedback: { type: Type.STRING },
            impact: { type: Type.NUMBER },
            success: { type: Type.BOOLEAN }
          },
          required: ["feedback", "impact", "success"]
        }
      }
    });
    return JSON.parse(response.text?.trim() || '{"feedback": "Erro no feedback", "impact": 0, "success": false}');
  } catch (error) {
    console.error("❌ Erro ao validar missão:", error);
    return { feedback: "Erro ao processar feedback", impact: 0, success: false };
  }
};

export const getCoachAdvice = async (history: {role: string, parts: {text: string}[]}[], userMessage: string): Promise<string> => {
  const ai = createAiClient();
  if (!ai) return "O Conselheiro Pastoral está offline no momento. Verifique a configuração da API.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: `Você é o "Conselheiro Pastoral" de felicidade conjugal.
        PERSONA:
        - Prático, acolhedor e focado em soluções baseadas em princípios bíblicos e sabedoria prática.
        - Defensor de que "pequenas coisas feitas com muito amor mudam o mundo".
        OBJETIVO:
        - Transformar conflitos em oportunidades de serviço e crescimento.
        - Sugerir micro-ações imediatas para melhorar o clima da casa.`,
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text || '';
  } catch (error) {
    console.error("❌ Erro no Conselheiro Pastoral:", error);
    return "Desculpe, tive um problema técnico ao processar sua mensagem. Por favor, tente novamente em instantes.";
  }
};
