
import React from 'react';
import { LoveLanguage, QuizQuestion } from './types';
import { MessageSquare, Clock, Gift, HeartHandshake, Heart } from 'lucide-react';

export const SUBSCRIPTION_PLANS = [
  { id: 'monthly', name: 'Mensal', price: '27,00', period: 'mês', tag: null },
  { id: 'quarterly', name: 'Trimestral', price: '99,00', period: '3 meses', tag: 'Econômico' },
  { id: 'semiannual', name: 'Semestral', price: '199,00', period: '6 meses', tag: 'Popular' },
  { id: 'annual', name: 'Anual', price: '399,00', period: 'ano', tag: 'Melhor Valor' },
];

export const LANGUAGE_METADATA = {
  [LoveLanguage.WORDS]: {
    icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
    color: 'bg-blue-100 border-blue-200 text-blue-800',
    description: 'Elogios verbais e palavras de apreciação são poderosos comunicadores do amor.'
  },
  [LoveLanguage.TIME]: {
    icon: <Clock className="w-6 h-6 text-emerald-500" />,
    color: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    description: 'Dedicar a alguém sua inteira atenção, sem dividi-la.'
  },
  [LoveLanguage.GIFTS]: {
    icon: <Gift className="w-6 h-6 text-purple-500" />,
    color: 'bg-purple-100 border-purple-200 text-purple-800',
    description: 'Símbolos visuais do amor que mostram que você pensou na pessoa.'
  },
  [LoveLanguage.SERVICE]: {
    icon: <HeartHandshake className="w-6 h-6 text-orange-500" />,
    color: 'bg-orange-100 border-orange-200 text-orange-800',
    description: 'Realizar coisas que você sabe que seu cônjuge gostaria que fizesse.'
  },
  [LoveLanguage.TOUCH]: {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    color: 'bg-rose-100 border-rose-200 text-rose-800',
    description: 'Toques afetuosos que comunicam segurança e pertencimento.'
  },
  [LoveLanguage.NONE]: {
    icon: <Heart className="w-6 h-6 text-gray-400" />,
    color: 'bg-gray-100 border-gray-200 text-gray-800',
    description: 'Descubra sua linguagem através do teste.'
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, text: "O que te faz sentir mais amado(a)?", options: [{ text: "Receber um bilhete carinhoso inesperado.", language: LoveLanguage.WORDS }, { text: "Passar uma tarde conversando sem distrações.", language: LoveLanguage.TIME }] },
  { id: 2, text: "Como você prefere ajuda?", options: [{ text: "Limpando a casa sem eu pedir.", language: LoveLanguage.SERVICE }, { text: "Me dando um abraço longo quando chego.", language: LoveLanguage.TOUCH }] },
  { id: 3, text: "Qual surpresa agrada mais?", options: [{ text: "Um presente que mostre que lembrou de mim.", language: LoveLanguage.GIFTS }, { text: "Um elogio sincero na frente de outros.", language: LoveLanguage.WORDS }] },
  { id: 4, text: "Em um dia difícil, o que conforta?", options: [{ text: "Sentar no sofá de mãos dadas.", language: LoveLanguage.TOUCH }, { text: "Preparar meu jantar favorito.", language: LoveLanguage.SERVICE }] },
  { id: 5, text: "Qual lazer te atrai?", options: [{ text: "Fazer uma viagem curta a dois.", language: LoveLanguage.TIME }, { text: "Ganhar algo que eu queria muito.", language: LoveLanguage.GIFTS }] },
  { id: 6, text: "O que demonstra mais valor?", options: [{ text: "Dizer 'estou orgulhoso de você'.", language: LoveLanguage.WORDS }, { text: "Lavar o carro ou consertar algo.", language: LoveLanguage.SERVICE }] },
  { id: 7, text: "Para você, o que é essencial?", options: [{ text: "Contato físico frequente.", language: LoveLanguage.TOUCH }, { text: "Tempo de qualidade exclusivo.", language: LoveLanguage.TIME }] },
  { id: 8, text: "Prefere que o parceiro...", options: [{ text: "Traga uma lembrança de viagem.", language: LoveLanguage.GIFTS }, { text: "Diga que me ama várias vezes ao dia.", language: LoveLanguage.WORDS }] },
  { id: 9, text: "No aniversário, o que é melhor?", options: [{ text: "Um presente especial e escolhido.", language: LoveLanguage.GIFTS }, { text: "Uma festa planejada com ajuda dele(a).", language: LoveLanguage.SERVICE }] },
  { id: 10, text: "Como recarregar as energias?", options: [{ text: "Caminhando juntos em silêncio.", language: LoveLanguage.TIME }, { text: "Receber massagem nos pés.", language: LoveLanguage.TOUCH }] },
  { id: 11, text: "Qual frase te toca mais?", options: [{ text: "Você é incrível e eu te admiro.", language: LoveLanguage.WORDS }, { text: "Deixa que eu cuido disso para você.", language: LoveLanguage.SERVICE }] },
  { id: 12, text: "O que é mais romântico?", options: [{ text: "Um jantar à luz de velas.", language: LoveLanguage.TIME }, { text: "Andar de mãos dadas no parque.", language: LoveLanguage.TOUCH }] },
  { id: 13, text: "Gosta quando o outro...", options: [{ text: "Me surpreende com um chocolate.", language: LoveLanguage.GIFTS }, { text: "Me elogia pelo esforço no trabalho.", language: LoveLanguage.WORDS }] },
  { id: 14, text: "Sente-se cuidado(a) quando...", options: [{ text: "Ele(a) resolve um problema burocrático.", language: LoveLanguage.SERVICE }, { text: "Ele(a) desliga o celular para me ouvir.", language: LoveLanguage.TIME }] },
  { id: 15, text: "O que é um gesto de amor?", options: [{ text: "Um beijo de despedida carinhoso.", language: LoveLanguage.TOUCH }, { text: "Um bilhete na porta da geladeira.", language: LoveLanguage.WORDS }] },
  { id: 16, text: "Fica feliz quando ganha...", options: [{ text: "Algo feito à mão (artesanal).", language: LoveLanguage.GIFTS }, { text: "Tempo para um hobby juntos.", language: LoveLanguage.TIME }] },
  { id: 17, text: "Sente-se amado(a) se...", options: [{ text: "O parceiro faz as compras do mês.", language: LoveLanguage.SERVICE }, { text: "O parceiro me abraça por trás.", language: LoveLanguage.TOUCH }] },
  { id: 18, text: "O que te faz sorrir?", options: [{ text: "Ouvir 'obrigado por existir'.", language: LoveLanguage.WORDS }, { text: "Um pequeno mimo sem motivo.", language: LoveLanguage.GIFTS }] },
  { id: 19, text: "Qual momento é mágico?", options: [{ text: "Ficar abraçados vendo um filme.", language: LoveLanguage.TOUCH }, { text: "Conversar sobre o futuro por horas.", language: LoveLanguage.TIME }] },
  { id: 20, text: "Sente paz quando...", options: [{ text: "A casa está organizada pelo outro.", language: LoveLanguage.SERVICE }, { text: "Ouve palavras de encorajamento.", language: LoveLanguage.WORDS }] }
];
