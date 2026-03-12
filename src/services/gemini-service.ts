import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Esse serviço é responsável pela integração com o Gemini.
 * Ele usa uma estratégia de "Black Box" para evitar vazamento de chaves no console.
 */

const getApiKey = () => {
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const processKey = (window as any).process?.env?.VITE_GEMINI_API_KEY;
  const key = envKey || processKey;
              
  if (key && key !== 'undefined' && key !== 'null' && key.length > 20) {
    return key.trim();
  }
  return "";
};

const createAiClient = () => {
  const key = getApiKey();
  if (!key) return null;
  try {
    return new GoogleGenerativeAI(key);
  } catch (err) {
    return null;
  }
};

const genAI = createAiClient();

export async function generateDailyMission(
  targetName: string,
  targetLanguage: string,
  dayNumber: number,
  cycleNumber: number,
  isLighter: boolean = false,
  rejectedDescriptions: string[] = []
) {
  if (!genAI) return null;

  // Usamos o modelo 2.0 Flash que confirmamos estar disponível na sua lista
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", 
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `Você é um mentor de relacionamentos (Gary Chapman). Alvo: ${targetName}, Linguagem: ${targetLanguage}.
  Ciclo: ${cycleNumber}, Dia: ${dayNumber}. ${isLighter ? 'Missão LEVE.' : ''}
  Retorne JSON: { "title": "Nome", "description": "Passo a passo", "rationale": "Por que?" }`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("❌ Erro na geração da missão diária.");
    return null;
  }
}

export async function validateMission(
  mission: { title: string; description: string },
  userRelato: string,
  partnerName: string
) {
  if (!genAI) return { feedback: "IA offline", impact: 0, success: false };

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { responseMimeType: "application/json" } });

  const prompt = `Avalie se o usuário cumpriu a missão: "${mission.title}" para ${partnerName}. Relato: "${userRelato}".
  Retorne JSON: { "feedback": "texto", "impact": 0.5, "success": true }`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    return { feedback: "Sua dedicação é o que importa!", impact: 0.5, success: true };
  }
}

export async function getCoachAdvice(userMessage: string, history: { role: string; parts: any[] }[] = []) {
  if (!genAI) return "O Conselheiro está descansando. Tente novamente mais tarde.";

  try {
    // Forçamos o modelo 2.0 que é o único na sua lista
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat();
    
    // Instrução de personalidade embutida na mensagem para evitar erro 400
    const finalMessage = `PERSONA: Conselheiro Pastoral Bíblico. MENSAGEM: ${userMessage}`;
    const result = await chat.sendMessage(finalMessage);
    return result.response.text();
  } catch (error) {
    // Fallback silencioso sem listar modelos (para evitar vazamento)
    return "Desculpe, tive um problema técnico. O amor sacrificial é o caminho. Tente perguntar novamente.";
  }
}
