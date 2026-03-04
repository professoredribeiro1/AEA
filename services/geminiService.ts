import { GoogleGenAI, Type } from "@google/genai";
import { LoveLanguage, Mission } from "../types";

// Função auxiliar para obter a instância da IA com segurança
const getGenAI = () => {
  const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    '';
  if (!GEMINI_API_KEY) {
    console.error("ERRO CRÍTICO: Chave da IA não encontrada. O Conselheiro e Missões não funcionarão.");
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

export const generateDailyMission = async (
  targetLanguage: LoveLanguage,
  targetName: string,
  dayNumber: number,
  cycleNumber: number = 1,
  isLighter: boolean = false
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
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
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
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Gere uma missão prática de "Amor Sacrificial" ${isLighter ? 'LEVE E SUAVE ' : ''}para o dia ${dayNumber} do Ciclo ${cycleNumber} (Tema: ${currentTheme}). O alvo é "${targetName}" e sua linguagem do amor predominante é "${targetLanguage}".` }] }],
      generationConfig: {
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

    const responseText = result.response.text();
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
    const model = getGenAI().getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Analise o relato de cumprimento.
      - Valorize a consistência e a intenção, não a grandiosidade.
      - Se o usuário descreveu o que fez com sinceridade, success é true.
      - Ofereça um feedback encorajador que mostre como esse pequeno passo constrói uma relação inabalável.
      - Impact: Atribua de 0.3 a 1.5 baseado no nível de conexão demonstrado no relato.`
    });

    const result = await model.generateContent({
      contents: [{
        role: "user", parts: [{
          text: `Missão: "${mission.title}". 
      O que foi pedido: "${mission.description}".
      Relato do usuário: "${userRelato}". 
      Avalie o cumprimento desta pequena meta diária para ${partnerName}.`
        }]
      }],
      generationConfig: {
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

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;

    return JSON.parse(cleanJson);
  } catch (e) {
    console.error('Erro no Gemini (getMissionCompletionFeedback):', e);
    return { feedback: "Sua missão foi registrada! O amor é construído nos pequenos gestos diários.", impact: 0.5, success: true };
  }
};

export const getCoachAdvice = async (history: { role: string, parts: { text: string }[] }[], userMessage: string): Promise<string> => {
  try {
    const model = getGenAI().getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Você é o "Conselheiro Pastoral" de felicidade conjugal.
      PERSONA:
      - Prático, acolhedor e focado em soluções baseadas em princípios bíblicos e sabedoria prática.
      - Defensor de que "pequenas coisas feitas com muito amor mudam o mundo".
      OBJETIVO:
      - Transformar conflitos em oportunidades de serviço e crescimento.
      - Sugerir micro-ações imediatas para melhorar o clima da casa.`
    });

    const result = await model.generateContent({
      contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return result.response.text() || '';
  } catch (e) {
    console.error('Erro no Gemini (getCoachAdvice):', e);
    return "Desculpe, estou tendo dificuldades em me conectar agora. Lembre-se que um gesto de gentileza hoje pode mudar o clima do seu lar.";
  }
};
