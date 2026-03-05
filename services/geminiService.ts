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
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Você é um mentor de relacionamentos especialista em psicologia conjugal, no método de Gary Chapman e no conceito teológico e prático de Amor Sacrificial (Ágape).
      
      OBJETIVO CENTRAL: Criar uma missão PROFUNDA e SIGNIFICATIVA onde o usuário SERVE ao seu cônjuge (${targetName}) baseando-se na linguagem "${targetLanguage}".
      
      ESSÊNCIA DA PROFUNDIDADE:
      - Evite o óbvio e o raso (ex: não peça apenas para dar um beijo ou dizer obrigado).
      - Peça ações que envolvam INTENCIONALIDADE, PLANEJAMENTO e ENTREGA.
      - A missão deve tocar a alma e as necessidades emocionais profundas de quem tem "${targetLanguage}" como linguagem principal.
      - Use o conceito de "Amor Sacrificial": algo que exige que o usuário abra mão de um pouco da sua conveniência, tempo ou preferência para honrar o outro.
      
      REGRA DE OURO: A missão NUNCA deve ser para o próprio usuário fazer algo para si mesmo. Deve ser sempre uma ação DIRECIONADA AO PARCEIRO.
      
      ${isLighter ? 'VERSÃO SUAVE (CUIDADO): Esta missão ainda deve ser profunda, mas executada de forma LEVE e RESTAURADORA. Foque em atos de bondade silenciosos que dizem "Eu vejo você e cuido de você", sem exigir do usuário uma carga emocional que ele não consiga carregar no momento.' : ''}

      ESTRUTURA DA RESPOSTA:
      - title: Um nome poético e forte para a ação.
      - description: Passo a passo claro, mas carregado de propósito (ex: em vez de "Lave a louça", use "Assuma uma responsabilidade que costuma pesar sobre seu cônjuge, executando-a com excelência e sem reclamar, para que ele(a) possa descansar").
      - rationale: Uma explicação profunda do IMPACTO PSICOLÓGICO e EMOCIONAL desta ação específica no coração de quem fala "${targetLanguage}".`,
    });

    const avoidText = avoidContentList && avoidContentList.length > 0
      ? `\n\nIMPORTANTE: O usuário REJEITOU as seguintes ideias de missões anteriores: "${avoidContentList.join('", "')}". \nVOCÊ DEVE sugerir algo TOTALMENTE DIFERENTE de todas estas acima.`
      : '';

    const result = await model.generateContent({
      contents: [{
        role: "user", parts: [{
          text: `Gere uma missão de "Amor Sacrificial" para o dia ${dayNumber} do Ciclo ${cycleNumber}. 
      Alvo: ${targetName} 
      Linguagem do Alvo: ${targetLanguage}
      Tema do Ciclo: ${currentTheme}${avoidText}`
        }]
      }],
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
