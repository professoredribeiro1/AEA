import { GoogleGenAI, Type } from "@google/genai";
import { LoveLanguage, Mission } from "../types";

// Função auxiliar para obter a instância da IA com segurança
const getGenAI = () => {
  const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (typeof process !== 'undefined' ? (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY) : '') ||
    '';
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined') {
    console.warn("AVISO: Chave da IA não encontrada. O Conselheiro e Missões não funcionarão.");
    return null;
  }
  // No @google/genai v1.34.0+, passamos a chave no objeto de configuração
  try {
    return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (e) {
    console.error("Erro ao inicializar GoogleGenAI:", e);
    return null;
  }
};

export const generateDailyMission = async (
  targetLanguage: LoveLanguage,
  targetName: string,
  dayNumber: number,
  cycleNumber: number = 1,
  isLighter: boolean = false,
  avoidContentList?: string[]
): Promise<Partial<Mission>> => {
  const themes = [
    "Fundação e Reconexão Básica",
    "Intimidade e Vulnerabilidade",
    "Aventura e Quebra de Rotina",
    "Legado e Projetos de Vida",
    "Espiritualidade e Propósito"
  ];
  const currentTheme = themes[(cycleNumber - 1) % themes.length];

  try {
    const client = getGenAI();
    if (!client) throw new Error("IA não disponível");

    const systemPrompt = `Você é um mentor de relacionamentos especialista em psicologia conjugal, no método de Gary Chapman e no conceito teológico e prático de Amor Sacrificial (Ágape).
      OBJETIVO CENTRAL: Criar uma missão PROFUNDA e SIGNIFICATIVA onde o usuário SERVE ao seu cônjuge (${targetName}) baseando-se na linguagem "${targetLanguage}".
      REGRA DE OURO: A missão NUNCA deve ser para o próprio usuário fazer algo para si mesmo. Deve ser sempre uma ação DIRECIONADA AO PARCEIRO.
      ${isLighter ? 'VERSÃO SUAVE: Esta missão ainda deve ser profunda, mas executada de forma LEVE e RESTAURADORA.' : ''}
      ESTRUTURA DA RESPOSTA:
      - title: Um nome poético e forte para a ação.
      - description: Passo a passo claro.
      - rationale: Explicação do impacto profundo no coração de quem fala "${targetLanguage}".`;

    const avoidText = avoidContentList && avoidContentList.length > 0
      ? `\n\nIMPORTANTE: Evite temas como: "${avoidContentList.join('", "')}".`
      : '';

    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: "user", parts: [{
          text: `Gere uma missão de "Amor Sacrificial" para o dia ${dayNumber} do Ciclo ${cycleNumber}. Alvo: ${targetName} (${targetLanguage}). Tema: ${currentTheme}${avoidText}`
        }]
      }],
      config: {
        systemInstruction: systemPrompt,
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

    const responseText = result.text || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Erro no Gemini (generateDailyMission):', e);
    return {
      title: "Pequeno gesto de amor",
      description: `Faça algo gentil para ${targetName} hoje focado em ${targetLanguage}.`,
      rationale: "O amor é construído nos detalhes."
    };
  }
};

export const getMissionCompletionFeedback = async (
  mission: Mission,
  partnerName: string,
  userRelato: string
): Promise<{ feedback: string, impact: number, success: boolean }> => {
  try {
    const client = getGenAI();
    if (!client) throw new Error("IA não disponível");
    const systemPrompt = `Analise o relato de cumprimento de missão de amor sacrificial para ${partnerName}. Valorize a intenção. Se sincero, success=true.`;

    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{
        role: "user", parts: [{
          text: `Missão: "${mission.title}". Relato: "${userRelato}".`
        }]
      }],
      config: {
        systemInstruction: systemPrompt,
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

    const responseText = result.text || "";
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Erro no Gemini (getMissionCompletionFeedback):', e);
    return { feedback: "Missão registrada! Continue firme no propósito.", impact: 0.5, success: true };
  }
};

export const getCoachAdvice = async (history: { role: string, parts: { text: string }[] }[], userMessage: string): Promise<string> => {
  try {
    const client = getGenAI();
    if (!client) throw new Error("IA não disponível");
    const systemPrompt = `Você é o "Conselheiro Pastoral" focado em restauração de casamentos. Bíblico e psicológico. Encoraje Amor Sacrificial, perdão e paciência.`;

    // Normalização rigorosa do histórico para garantir alternância user/model
    const validHistory = [];
    let lastRole = null;

    for (const msg of history) {
      if (msg.role === 'model' && validHistory.length === 0) continue;
      if (msg.role !== lastRole) {
        validHistory.push(msg);
        lastRole = msg.role;
      }
    }

    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [...validHistory, { role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return result.text || "Estou aqui para ouvir. Como posso ajudar?";
  } catch (e: any) {
    console.error('Erro detalhado no Conselheiro:', e);

    try {
      const client = getGenAI();
      if (!client) throw new Error("IA não disponível");
      const simpleResult = await client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: userMessage }] }]
      });
      return simpleResult.text || "Pode repetir a pergunta, por favor?";
    } catch (fallbackError: any) {
      return `Desculpe, tive um problema de conexão com a inteligência artificial. Mas lembre-se: o amor sacrificial é o caminho. Tente perguntar novamente em instantes.`;
    }
  }
};
