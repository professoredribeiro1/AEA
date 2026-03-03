
export enum LoveLanguage {
  WORDS = 'Palavras de Afirmação',
  TIME = 'Qualidade de Tempo',
  GIFTS = 'Receber Presentes',
  SERVICE = 'Formas de Servir',
  TOUCH = 'Toque Físico',
  NONE = 'Não definido'
}

export enum TankTheme {
  MODERN = 'modern',
  MINIMALIST = 'minimalist',
  WATERCOLOR = 'watercolor'
}

export interface GratitudeEntry {
  id: string;
  date: string;
  text: string;
  language: LoveLanguage;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Mission {
  id: string;
  day: number;
  title: string;
  description: string;
  rationale: string;
  completed: boolean;
  completedAt?: string;
  aiFeedback?: string;
  languageApplied?: LoveLanguage; // Rastreia qual linguagem foi usada nesta missão
  skipped?: boolean;
  isAlternative?: boolean;
  originalMissionId?: string;
}

export interface Challenge {
  type: 30 | 60 | null;
  startDate: string | null;
  missions: Mission[];
  cycleCount?: number; // Para contar quantos ciclos de 60 dias foram feitos
}

export interface SubscriptionInfo {
  status: 'trial' | 'active' | 'expired';
  plan: 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'couple' | 'none';
  trialStartedAt: string;
  expiresAt: string | null;
}

export interface UserProfile {
  name: string;
  languages: LoveLanguage[]; // Agora suporta as 2 principais
  tankLevel: number;
  challenge: Challenge;
  hasFinishedTutorial: boolean;
  subscription: SubscriptionInfo;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  coupleCode?: string;
  linkedPartnerName?: string;
  isLinked: boolean;
  tankTheme?: TankTheme;
  gratitudeJournal: GratitudeEntry[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    language: LoveLanguage;
  }[];
}
