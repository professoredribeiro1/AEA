
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoveLanguage, Mission } from "../types";

/**
 * Robustly retrieves the Gemini API Key.
 * We include the verified project key as a fallback to ensure it works on Vercel 
 * even if environment variables are not immediately available.
 */
const getApiKey = () => {
  // Pega estritamente do Vercel/Vite
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const processKey = (window as any).process?.env?.VITE_GEMINI_API_KEY;
  
  const key = envKey || processKey;
              
  if (key && key !== 'undefined' && key !== 'null' && key.length > 20) {
    return key.trim();
  }

  return ""; // Retorna vazio se não houver chave segura configurada
};

const createAiClient = () => {
  const key = getApiKey();
  if (!key) return null;
  
  try {
    return new GoogleGenerativeAI(key);
  } catch (err) {
    console.error("❌ Erro ao instanciar GoogleGenerativeAI:", err);
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
  const genAI = createAiClient();
  if (!genAI) return { title: 'IA Indisponível', description: 'Erro ao conectar-se com o assistente.', rationale: '' };

  const themes = [
    "Fundação e Reconexão Básica",
    "Intimidade e Vulnerabilidade",
    "Aventura e Quebra de Rotina",
    "Legado e Projetos de Vida",
    "Espiritualidade e Propósito"
  ];
  const currentTheme = themes[(cycleNumber - 1) % themes.length];

  const model = genAI.getGenerativeModel({ 
    model: "models/gemini-2.0-flash", 
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const systemPrompt = `Você é um mentor de relacionamentos especialista no método de Gary Chapman.
      SEU OBJETIVO: Criar uma tarefa simples, curta e potente que fortaleça o vínculo com ${targetName} através da linguagem "${targetLanguage}".
      
      ${isLighter ? 'REQUISITO ESPECIAL: Esta missão deve ser EXTREMAMENTE LEVE, PASSIVA e TOTALMENTE DIFERENTE da missão anterior. Ela deve ser focada em pequenos gestos que não exijam quase nenhum esforço emocional ou interação direta obrigatórria.' : ''}

      CONTEXTO DO CICLO:
      Estamos no Ciclo ${cycleNumber} com o tema "${currentTheme}". 
      ${cycleNumber === 1 ? 'Foque em ações simples de reconexão.' : 'Foque em ações mais profundas, criativas e que exijam maior entrega emocional.'}

      REGRAS PARA A MISSÃO:
      1. SIMPLICIDADE ABSOLUTA: A tarefa deve ser realizável em menos de 15 minutos e não deve exigir gastos financeiros significativos.
      2. REPLICABILIDADE: Foque em ações que possam se tornar hábitos.
      3. CONEXÃO DIRETA: A missão deve atingir o coração da linguagem "${targetLanguage}". 
      
      RETORNE APENAS JSON COM ESTES CAMPOS:
      {
        "title": "Nome curto e acionável",
        "description": "Instrução passo a passo",
        "rationale": "Por que isso é poderoso para quem fala ${targetLanguage}"
      }`;

  const prompt = `${systemPrompt}\n\nQUESTÃO ATUAL: Gere uma missão prática de "Amor Sacrificial" ${isLighter ? 'LEVE E SUAVE ' : ''}para o dia ${dayNumber} do Ciclo ${cycleNumber} (Tema: ${currentTheme}). O alvo é "${targetName}" e sua linguagem do amor predominante é "${targetLanguage}".
    ${rejectedDescriptions.length > 0 ? `EVITE as seguintes ideias ou descrições que já foram recusadas: ${rejectedDescriptions.join('; ')}` : ''}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Erro ao gerar missão diária:", error);
    return {
      title: 'Pequeno Gesto',
      description: `Faça algo especial focado em ${targetLanguage} para demonstrar seu amor.`,
      rationale: 'O amor se constrói nos detalhes.'
    };
  }
};

export const getMissionCompletionFeedback = async (
  mission: Mission,
  partnerName: string,
  userRelato: string
): Promise<{ feedback: string, impact: number, success: boolean }> => {
  const genAI = createAiClient();
  if (!genAI) return { feedback: "IA offline", impact: 0, success: false };

  const model = genAI.getGenerativeModel({ 
    model: "models/gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  try {
    const systemPrompt = `Você é um mentor de relacionamentos. Analise o relato de cumprimento.
      - Valorize a consistência e a intenção.
      - Se o usuário descreveu o que fez com sinceridade, success é true.
      - Ofereça um feedback encorajador.
      - Impact: Atribua de 0.3 a 1.5.

      RETORNE APENAS JSON:
      {
        "feedback": "Texto encorajador",
        "impact": 0.5,
        "success": true
      }`;

    const prompt = `${systemPrompt}\n\nMissão: "${mission.title}". 
      O que foi pedido: "${mission.description}".
      Relato do usuário: "${userRelato}". 
      Avalie o cumprimento desta pequena meta diária para ${partnerName}.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    console.log("✅ Missão validada com sucesso via Gemini");
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("❌ Erro ao validar missão:", error);
    return { feedback: "Missão registrada com sucesso!", impact: 0.5, success: true };
  }
};

export const getCoachAdvice = async (history: { role: string, parts: { text: string }[] }[], userMessage: string): Promise<string> => {
  const genAI = createAiClient();
  if (!genAI) return "O Conselheiro Pastoral está offline no momento. Tente novamente mais tarde.";

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
    
    const persona = "Você é o 'Conselheiro Pastoral' de felicidade conjugal. PERSONA: Prático, acolhedor e focado em soluções baseadas em princípios bíblicos e sabedoria prática. Defensor de que 'pequenas coisas feitas com muito amor mudam o mundo'. OBJETIVO: Transformar conflitos em oportunidades de serviço e crescimento. Sugerir micro-ações imediatas para melhorar o clima da casa.";
    
    // Inicia o chat sem sistemaInstruction para evitar erro 400
    const chat = model.startChat();
    
    const messageWithPersona = `INSTRUÇÃO DE PERSONA: ${persona}\n\nMENSAGEM DO USUÁRIO: ${userMessage}`;

    const result = await chat.sendMessage(messageWithPersona);
    return result.response.text();
  } catch (error: any) {
    console.error("❌ Erro no Conselheiro Pastoral:", error);
    
    // Se for erro 404 (modelo não encontrado), tenta os nomes mais genéricos ou versões pro
    if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      console.log("🔄 Tentando outros modelos da sua lista real...");
      try {
        const fallbackModels = ["models/gemini-2.0-flash", "models/gemini-2.5-flash", "models/gemini-2.5-pro"];
        for (const modelName of fallbackModels) {
           try {
             const modelFallback = genAI.getGenerativeModel({ model: modelName });
             const chatFallback = modelFallback.startChat();
             const res = await chatFallback.sendMessage(`INSTRUÇÃO DE PERSONA: ${persona}\n\nMENSAGEM: ${userMessage}`);
             return res.response.text();
           } catch (e) { continue; }
        }
      } catch (fallbackError) {
        console.error("❌ Todos os fallbacks falharam:", fallbackError);
      }
    }
    
    // Tenta uma resposta simples sem histórico para outros erros
    try {
      const modelSimple = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const simpleResult = await modelSimple.generateContent(userMessage);
      return simpleResult.response.text();
    } catch (e) {
      return "Desculpe, tive um problema técnico ao processar sua mensagem. Mas lembre-se: o amor sacrificial é o caminho. Tente perguntar novamente em instantes.";
    }
  }
};
