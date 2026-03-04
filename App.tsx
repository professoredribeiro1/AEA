import React, { useState, useEffect } from 'react';
import { LoveLanguage, UserProfile, Challenge, Mission, SubscriptionInfo, Message, TankTheme, GratitudeEntry } from './types';
import { fetchMyProfile, fetchPartnerProfile, linkWithPartner, updateTankLevel, updateLanguages, updateChallenge, ensureCoupleCode } from './services/profileService';
import { LANGUAGE_METADATA } from './constants.tsx';
import TankGauge from './components/TankGauge';
import Quiz from './components/Quiz';
import Tutorial from './components/Tutorial';
import PersonalCoach from './components/PersonalCoach';
import NotificationManager from './components/NotificationManager';
import { useNotificationLogic } from './hooks/useNotificationLogic';
import CoupleConnection from './components/CoupleConnection';
import MyChallenges from './components/MyChallenges';
import GratitudeJournal from './components/GratitudeJournal';
import LandingPage from './components/LandingPage';
import { generateDailyMission, getMissionCompletionFeedback } from './services/geminiService';
import { supabase } from './services/supabase';
import {
  Heart, Sparkles, Calendar, Trophy,
  ChevronRight, UserPlus, Link2, Sun, Compass, TrendingUp, Clock3, LogOut
} from 'lucide-react';

const App: React.FC = () => {
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const emptyChallenge: Challenge = { type: null, startDate: null, missions: [], cycleCount: 1 };

  const getInitialSubscription = (): SubscriptionInfo => {
    const saved = localStorage.getItem('love_user_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.subscription) return parsed.subscription;
    }
    return { status: 'trial', plan: 'none', trialStartedAt: new Date().toISOString(), expiresAt: null };
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('love_user_v4');
    return saved ? JSON.parse(saved) : {
      name: '', languages: [], tankLevel: 5, challenge: emptyChallenge,
      hasFinishedTutorial: false, subscription: getInitialSubscription(), notificationsEnabled: false,
      soundEnabled: true,
      coupleCode: Math.random().toString(36).substring(2, 8).toUpperCase(), isLinked: false,
      tankTheme: TankTheme.MODERN, gratitudeJournal: []
    };
  });

  const [partner, setPartner] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('love_partner_v4');
    return saved ? JSON.parse(saved) : {
      name: 'Parceiro(a)', languages: [], tankLevel: 5, challenge: emptyChallenge,
      hasFinishedTutorial: true, subscription: getInitialSubscription(), notificationsEnabled: false,
      soundEnabled: true,
      isLinked: false, gratitudeJournal: []
    };
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'challenge' | 'myChallenges' | 'coach' | 'connection' | 'gratitude'>('dashboard');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingMission, setLoadingMission] = useState(false);
  const [aiInsight, setAiInsight] = useState<{ feedback: string; success: boolean; impact?: number } | null>(null);
  const [fulfillmentText, setFulfillmentText] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isReadyForMission, setIsReadyForMission] = useState(false);

  const { sendNotification } = useNotificationLogic({
    user,
    partner,
    onToggleNotifications: (enabled) => setUser(p => ({ ...p, notificationsEnabled: enabled }))
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setSupabaseUserId(session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        setLoadingProfile(false);
      }
      setSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setSupabaseUserId(session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        setSupabaseUserId(null);
        setLoadingProfile(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Garantir que o couple_code existe
      const code = await ensureCoupleCode(userId);

      const profile = await fetchMyProfile(userId);
      if (profile) {
        setUser(prev => ({
          ...prev,
          name: profile.full_name || prev.name || 'Usuário',
          tankLevel: profile.tank_level ?? prev.tankLevel,
          languages: (profile.languages?.length > 0) ? profile.languages : prev.languages,
          challenge: profile.challenge || prev.challenge,
          coupleCode: profile.couple_code || code,
          isLinked: !!profile.partner_id,
          subscription: {
            status: (profile.subscription_status === 'trialing' || profile.subscription_status === 'active') ? profile.subscription_status as any : 'trial',
            plan: (profile.plan_type as any) || 'none',
            trialStartedAt: prev.subscription.trialStartedAt,
            expiresAt: profile.expires_at
          }
        }));

        // Se tiver parceiro vinculado, carrega o perfil dele
        if (profile.partner_id) {
          const partnerProfile = await fetchPartnerProfile(profile.partner_id);
          if (partnerProfile) {
            setPartner(prev => ({
              ...prev,
              name: partnerProfile.full_name || 'Parceiro(a)',
              tankLevel: partnerProfile.tank_level ?? 5,
              languages: partnerProfile.languages || [],
              challenge: partnerProfile.challenge || prev.challenge,
              isLinked: true
            }));
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Mantém localStorage para backup offline
  useEffect(() => { if (!sessionLoading) localStorage.setItem('love_user_v4', JSON.stringify(user)); }, [user, sessionLoading]);
  useEffect(() => { if (!sessionLoading) localStorage.setItem('love_partner_v4', JSON.stringify(partner)); }, [partner, sessionLoading]);

  const handleLogin = (name: string, session?: any) => {
    setUser(prev => ({ ...prev, name }));
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('love_user_v4');
    localStorage.removeItem('love_partner_v4');
    localStorage.removeItem('coach_history');
    setIsAuthenticated(false);
    setLoadingProfile(false);
    setActiveTab('dashboard');
  };

  const handleRedoMission = (id: string) => {
    const mission = partner.challenge.missions.find(m => m.id === id);
    if (!mission) return;

    // Se o usuário quiser refazer uma missão já concluída
    if (mission.completed) {
      const updatedMissions = partner.challenge.missions.map(m =>
        m.id === id ? { ...m, completed: false, aiFeedback: undefined } : m
      );
      const newChallenge = { ...partner.challenge, missions: updatedMissions };
      setPartner(prev => ({
        ...prev,
        challenge: newChallenge
      }));
      if (supabaseUserId) updateChallenge(supabaseUserId, newChallenge);
      setIsReadyForMission(true);
      setActiveTab('challenge');
    }
  };

  const handleRestartChallenge = async () => {
    if (confirm("Deseja iniciar um novo ciclo de 60 dias de semeadura?")) {
      setLoadingMission(true);
      setIsReadyForMission(false);
      if (partner.languages.length >= 2 && user.isLinked) {
        const cycle = (partner.challenge.cycleCount || 1) + 1;
        const targetLang = partner.languages[0];
        const d = await generateDailyMission(targetLang, partner.name, 1, cycle);
        const newChallenge: Challenge = {
          ...emptyChallenge,
          type: 60,
          cycleCount: cycle,
          startDate: new Date().toISOString(),
          missions: [{
            id: Math.random().toString(36).substr(2, 9),
            day: 1,
            title: d.title!,
            description: d.description!,
            rationale: d.rationale!,
            completed: false,
            languageApplied: targetLang
          }]
        };
        setPartner(p => ({ ...p, challenge: newChallenge }));
        if (supabaseUserId) updateChallenge(supabaseUserId, newChallenge);
        setLoadingMission(false);
        setActiveTab('challenge');
      } else {
        setLoadingMission(false);
        alert("Conecte-se com seu parceiro para que possamos usar as linguagens de amor dele(a) nas missões.");
        setActiveTab('connection');
      }
    }
  };

  const skipMission = async (mission: Mission) => {
    setLoadingMission(true);
    try {
      const targetLang = mission.languageApplied || partner.languages[0];
      const currentCycle = partner.challenge.cycleCount || 1;
      const lighterData = await generateDailyMission(targetLang, partner.name, mission.day, currentCycle, true, mission.description);

      const lighterMission: Mission = {
        id: Math.random().toString(36).substr(2, 9),
        day: mission.day,
        title: lighterData.title!,
        description: lighterData.description!,
        rationale: lighterData.rationale!,
        completed: false,
        languageApplied: targetLang,
        isAlternative: true,
        originalMissionId: mission.id
      };

      // Substitui a missão atual pela nova missão leve (não mantém a antiga no histórico)
      const updatedMissions = partner.challenge.missions.map(m =>
        m.id === mission.id ? lighterMission : m
      );

      const newChallenge = { ...partner.challenge, missions: updatedMissions };
      setPartner(prev => ({
        ...prev,
        challenge: newChallenge
      }));
      if (supabaseUserId) updateChallenge(supabaseUserId, newChallenge);
      setIsReadyForMission(false); // Volta para o estado de visualização para a nova missão

      const skipMessage = mission.isAlternative
        ? "Tudo bem. O mais importante é o seu coração estar em paz. Vamos tentar algo ainda mais simples e restaurador. Lembre-se: o amor também é ter paciência consigo mesmo."
        : "Entendo perfeitamente. O amor também é saber respeitar o próprio tempo. Por enquanto, preparamos algo mais leve e diferente para você realizar hoje.";

      alert(skipMessage);
    } finally {
      setLoadingMission(false);
    }
  };

  const completeMission = async (mission: Mission) => {
    if (!fulfillmentText.trim()) return;
    setLoadingMission(true);
    setAiInsight(null);
    try {
      const result = await getMissionCompletionFeedback(mission, partner.name, fulfillmentText);
      const { feedback, impact = 0, success } = result;

      if (success) {
        setShowCelebration(true);
        setIsReadyForMission(false);
        setTimeout(() => setShowCelebration(false), 4000);
        const updatedMissions = partner.challenge.missions.map(m =>
          m.id === mission.id ? { ...m, completed: true, completedAt: new Date().toISOString(), aiFeedback: feedback } : m
        );
        const nextDay = mission.day + 1;
        const currentCycle = partner.challenge.cycleCount || 1;

        if (nextDay <= (partner.challenge.type || 0)) {
          // Alterna estritamente entre as 2 linguagens principais do parceiro
          const targetLang = nextDay % 2 !== 0 ? partner.languages[0] : (partner.languages[1] || partner.languages[0]);
          const nextData = await generateDailyMission(targetLang, partner.name, nextDay, currentCycle);
          updatedMissions.push({
            id: Math.random().toString(36).substr(2, 9),
            day: nextDay,
            title: nextData.title || "Próxima Missão",
            description: nextData.description || "Continue sua jornada.",
            rationale: nextData.rationale || "O amor é construído dia a dia.",
            completed: false,
            languageApplied: targetLang
          });
        } else {
          // Desafio concluído! Sugerir novo ciclo
          if (confirm(`Parabéns! Você completou o Ciclo ${currentCycle} de 60 dias! Deseja iniciar o Ciclo ${currentCycle + 1} com um novo tema avançado?`)) {
            const nextCycle = currentCycle + 1;
            const targetLang = partner.languages[0];
            const nextData = await generateDailyMission(targetLang, partner.name, 1, nextCycle);
            setPartner(prev => ({
              ...prev,
              challenge: {
                ...prev.challenge,
                missions: [{
                  id: Math.random().toString(36).substr(2, 9),
                  day: 1,
                  title: nextData.title!,
                  description: nextData.description!,
                  rationale: nextData.rationale!,
                  completed: false,
                  languageApplied: targetLang
                }],
                cycleCount: nextCycle,
                startDate: new Date().toISOString()
              }
            }));
            setLoadingMission(false);
            return;
          }
        }
        const newChallenge = { ...partner.challenge, missions: updatedMissions };
        setPartner(prev => ({
          ...prev,
          tankLevel: Math.min(10, parseFloat((prev.tankLevel + (impact || 0)).toFixed(1))),
          challenge: newChallenge
        }));
        if (supabaseUserId) {
          updateChallenge(supabaseUserId, newChallenge);
          updateTankLevel(supabaseUserId, Math.min(10, parseFloat((user.tankLevel + (impact || 0)).toFixed(1))));
        }
        setFulfillmentText('');
      }
      setAiInsight({ feedback, success, impact });
    } catch (error) {
      console.error("Erro ao validar missão:", error);
      alert("Ocorreu um erro ao validar sua missão. Por favor, tente novamente.");
    } finally {
      setLoadingMission(false);
    }
  };

  const handleLinkPartner = async (partnerCode: string) => {
    if (!supabaseUserId) { alert("Você precisa estar logado para conectar."); return; }
    if (partnerCode.trim().length < 4) return;
    try {
      const partnerProfile = await linkWithPartner(supabaseUserId, partnerCode);
      if (!partnerProfile) {
        alert("Código não encontrado. Verifique o código e tente novamente.");
        return;
      }
      setUser(prev => ({ ...prev, isLinked: true, linkedPartnerName: partnerProfile.full_name || 'Parceiro(a)' }));
      setPartner(prev => ({
        ...prev,
        name: partnerProfile.full_name || 'Parceiro(a)',
        tankLevel: partnerProfile.tank_level ?? 5,
        languages: partnerProfile.languages || [],
        challenge: partnerProfile.challenge || prev.challenge,
        isLinked: true
      }));
      alert("Conexão estabelecida com sucesso! Você está conectado(a) com " + (partnerProfile.full_name || 'seu(sua) parceiro(a)') + ".");
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar. Tente novamente.");
    }
  };

  if (sessionLoading || (isAuthenticated && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-rose-900 font-bold animate-pulse italic">Alinhando seu Amor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Verificar se o usuário tem assinatura ativa ('active' ou 'trialing')
  const hasActiveSubscription = user.subscription?.status === 'active' || user.subscription?.status === 'trialing';

  if (!hasActiveSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full bg-rose-50 border border-rose-100 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
          <Heart className="w-20 h-20 text-rose-500 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-black text-rose-950 mb-4">Assinatura Inativa</h2>
          <p className="text-slate-600 font-medium mb-8">
            Sua assinatura ou período de teste encerrou. Para continuar tendo acesso ao check-up diário do seu casamento, missões personalizadas e o conselheiro pastoral, reative seu plano.
          </p>
          <button
            onClick={() => window.location.href = 'https://pay.kiwify.com.br/MlAXRDE'} // Redirecionando para o plano trimestral como padrão de renovação
            className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-lg hover:bg-rose-700 transition-all shadow-xl shadow-rose-200"
          >
            Renovar Assinatura
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-4 bg-white text-slate-500 rounded-2xl font-bold text-sm hover:text-slate-700 transition-all"
          >
            Sair da Conta
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in pb-20">
            <div className="md:hidden">
              <NotificationManager
                user={user}
                partner={partner}
                onToggleNotifications={(e) => setUser(p => ({ ...p, notificationsEnabled: e }))}
                onToggleSound={(e) => setUser(p => ({ ...p, soundEnabled: e }))}
                onTestNotification={() => sendNotification("Teste de Lembrete", "Seu sistema de lembretes está funcionando perfeitamente! ❤️")}
              />
            </div>
            <section className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-indigo-600 rounded-[3.5rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
              <div className="relative glass-card p-10 md:p-14 rounded-[3.5rem] flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100">
                    <Clock3 className="w-4 h-4" /> Micro-Ação do Dia
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-rose-950 leading-tight">Pronto para blindar seu amor <span className="text-rose-600 italic">hoje?</span></h2>
                  <p className="text-slate-500 text-lg max-w-lg font-medium">Pequenos gestos de Amor Sacrificial feitos com intenção transformam o ambiente da sua casa.</p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => {
                        if (user.isLinked) {
                          setActiveTab('challenge');
                        } else {
                          setActiveTab('connection');
                        }
                      }}
                      className="px-10 py-5 bg-rose-600 text-white rounded-[2rem] font-black text-lg hover:bg-rose-700 transition-all shadow-2xl shadow-rose-200 flex items-center gap-3"
                    >
                      {partner.challenge.type ? 'Abrir Missão' : 'Iniciar 60 Dias'} <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={() => setActiveTab('coach')} className="px-8 py-5 bg-white border border-rose-100 text-rose-900 rounded-[2rem] font-bold text-lg hover:bg-rose-50 transition-all flex items-center gap-3 shadow-sm">
                      Aconselhamento Pastoral <Compass className="w-5 h-5 text-rose-400" />
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="w-48 h-48 bg-rose-50 rounded-[3rem] flex items-center justify-center relative animate-float">
                    <Calendar className="w-20 h-20 text-rose-500" />
                    {partner.challenge.missions.length > 0 && (
                      <div className="absolute -top-4 -right-4 bg-indigo-600 text-white w-14 h-14 rounded-full flex flex-col items-center justify-center font-black shadow-xl">
                        <span className="text-[10px] uppercase leading-none">Dia</span>
                        <span className="text-xl">{partner.challenge.missions.filter(m => m.completed).length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3.5rem] border border-blue-50/50 shadow-sm flex flex-col justify-center min-h-[160px] hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Suas Linguagens Principais</p>
                {user.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.languages.map(l => (
                      <div key={l} className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black border border-blue-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {l}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setActiveTab('quiz')} className="text-left text-2xl font-black text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 group">
                    Fazer Teste <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-rose-50/50 shadow-sm flex flex-col justify-center min-h-[160px] hover:shadow-md transition-shadow">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Linguagens de {partner.name}</p>
                {partner.languages.length > 0 && user.isLinked ? (
                  <div className="flex flex-wrap gap-3">
                    {partner.languages.map(l => (
                      <div key={l} className="px-5 py-2.5 bg-rose-50 text-rose-600 rounded-2xl text-xs font-black border border-rose-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" /> {l}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => setActiveTab('connection')} className="text-left text-2xl font-black text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-2 group">
                    Conectar com Parceiro <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <TankGauge label="Termômetro Diário" type="self" level={user.tankLevel} onUpdate={(v) => { setUser(p => ({ ...p, tankLevel: v })); if (supabaseUserId) updateTankLevel(supabaseUserId, v); }} theme={user.tankTheme || TankTheme.MODERN} onThemeChange={(t) => setUser(p => ({ ...p, tankTheme: t }))} />
              <TankGauge label="Termômetro do Parceiro" type="partner" level={partner.tankLevel} onUpdate={() => { }} theme={user.tankTheme || TankTheme.MODERN} onThemeChange={(t) => setUser(p => ({ ...p, tankTheme: t }))} />
            </div>
          </div>
        );
      case 'quiz': return <Quiz onComplete={(res) => { setUser(prev => ({ ...prev, languages: res })); setActiveTab('dashboard'); if (supabaseUserId) updateLanguages(supabaseUserId, res); }} />;
      case 'challenge':
        const challenge = partner.challenge;
        if (!challenge.type) {
          return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
              <div className="glass-card p-12 md:p-20 rounded-[4rem] shadow-xl border border-rose-100">
                <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10"><Calendar className="w-12 h-12 text-rose-600" /></div>
                <h2 className="text-5xl font-black text-rose-950 mb-8 tracking-tight">Comece a Semear</h2>
                <p className="text-slate-500 text-xl mb-12 max-w-2xl mx-auto font-medium">60 dias de Amor Sacrificial transformarão seu casamento em algo duradouro e prazeroso.</p>
                {partner.languages.length >= 2 && user.isLinked ? (
                  <button onClick={async () => {
                    setLoadingMission(true);
                    const targetLang = partner.languages[0];
                    const d = await generateDailyMission(targetLang, partner.name, 1);
                    const newChallenge: Challenge = { type: 60, startDate: new Date().toISOString(), cycleCount: 1, missions: [{ id: Math.random().toString(36).substr(2, 9), day: 1, title: d.title!, description: d.description!, rationale: d.rationale!, completed: false, languageApplied: targetLang }] };
                    setPartner(p => ({ ...p, challenge: newChallenge }));
                    if (supabaseUserId) updateChallenge(supabaseUserId, newChallenge);
                    setLoadingMission(false);
                  }} className="w-full max-w-md bg-rose-600 p-8 rounded-[2.5rem] hover:bg-rose-700 transition-all text-white group shadow-2xl">
                    <span className="block font-black text-3xl mb-1 uppercase tracking-tighter">Ativar Desafio</span>
                    <span className="text-rose-100 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Sparkles className="w-3 h-3" /> Receber Primeira Missão</span>
                  </button>
                ) : (
                  <div className="space-y-6 flex flex-col items-center">
                    <p className="text-rose-600 font-bold bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 italic">
                      "Para semear no coração de quem você ama, primeiro precisamos saber o que ele(a) valoriza."
                    </p>
                    <p className="text-slate-400 text-sm max-w-md">Conecte-se com seu parceiro para liberar as missões baseadas nas linguagens de amor reais dele(a).</p>
                    <button onClick={() => setActiveTab('connection')} className="w-full max-w-md bg-slate-900 p-8 rounded-[2.5rem] hover:bg-black transition-all text-white font-black text-2xl uppercase tracking-tighter flex items-center justify-center gap-4 shadow-2xl">Conectar Agora <UserPlus className="w-6 h-6" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        }
        const currentMission = challenge.missions.find(m => !m.completed);
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12 relative">
            {showCelebration && [...Array(15)].map((_, i) => (
              <div key={i} className="floating-heart text-rose-500 opacity-0" style={{ left: `${Math.random() * 80 + 10}%`, top: '80%', animationDelay: `${Math.random() * 0.8}s`, fontSize: `${Math.random() * 20 + 10}px` }}><Heart className="fill-current" /></div>
            ))}
            {currentMission ? (
              <div className="space-y-6">
                {aiInsight && (
                  <div className={`${aiInsight.success ? 'bg-emerald-600' : 'bg-amber-600'} text-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row items-center gap-8 border-4 border-white animate-in zoom-in duration-300`}>
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-lg rotate-6">
                      {aiInsight.success ? <Trophy className="w-12 h-12 text-emerald-600" /> : <Sparkles className="w-12 h-12 text-amber-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-3xl font-black mb-3">{aiInsight.success ? 'Semente bem plantada!' : 'Quase lá...'}</h4>
                      <p className="text-white/90 text-lg leading-relaxed font-medium">"{aiInsight.feedback}"</p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-950 text-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                      <div className="px-5 py-2 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-rose-400 backdrop-blur-sm">
                        Dia {currentMission.day} • {currentMission.languageApplied}
                        {currentMission.isAlternative && " (Missão Leve)"}
                      </div>
                    </div>
                    <h4 className="text-5xl font-black mb-8 text-white leading-tight tracking-tight">{currentMission.title}</h4>
                    <p className="text-2xl text-slate-300 leading-relaxed mb-12 font-medium">"{currentMission.description}"</p>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-12">
                      <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Sabedoria de Semeadura</h5>
                      <p className="text-slate-400 text-sm italic font-medium">"{currentMission.rationale}"</p>
                    </div>

                    {!isReadyForMission && !aiInsight?.success ? (
                      <div className="mt-12 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] text-center space-y-6">
                        <p className="text-slate-300 text-lg font-medium">Você se sente bem para realizar esta tarefa específica hoje?</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button onClick={() => setIsReadyForMission(true)} className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-lg hover:bg-rose-700 transition-all shadow-xl">Sim, vou fazer</button>
                          <button onClick={() => skipMission(currentMission)} className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">Não me sinto bem para esta tarefa</button>
                        </div>
                      </div>
                    ) : !aiInsight?.success && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                        <textarea value={fulfillmentText} onChange={(e) => setFulfillmentText(e.target.value)} placeholder="Como foi semear amor desta forma hoje?" className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white text-xl focus:outline-none focus:border-rose-500 transition-all h-48 font-medium" />
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button onClick={() => completeMission(currentMission)} disabled={loadingMission || !fulfillmentText.trim()} className="flex-1 py-6 bg-rose-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-rose-700 transition-all flex items-center justify-center gap-4 shadow-2xl">
                            {loadingMission ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : "Validar Missão"}
                          </button>
                          <button onClick={() => { setIsReadyForMission(false); setFulfillmentText(''); }} className="px-8 py-6 bg-white/10 text-white rounded-[2.5rem] font-bold text-lg hover:bg-white/20 transition-all">Voltar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        );
      case 'coach': return <PersonalCoach />;
      case 'gratitude': return <GratitudeJournal entries={user.gratitudeJournal || []} onAddEntry={(e) => setUser(p => ({ ...p, gratitudeJournal: [...p.gratitudeJournal, { ...e, id: Math.random().toString(), date: new Date().toISOString() }] }))} onDeleteEntry={(id) => setUser(p => ({ ...p, gratitudeJournal: p.gratitudeJournal.filter(x => x.id !== id) }))} />;
      case 'myChallenges': return <MyChallenges challenge={partner.challenge} partnerName={partner.name} onRedoMission={handleRedoMission} onGoToChallenge={() => setActiveTab('challenge')} />;
      case 'connection': return <CoupleConnection userCode={user.coupleCode || 'ABCD-123'} onLink={handleLinkPartner} linkedPartner={user.isLinked ? partner.name : undefined} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Início', icon: <Sun className="w-5 h-5" /> },
    { id: 'gratitude', label: 'Diário', icon: <Heart className="w-5 h-5" /> },
    { id: 'challenge', label: 'Missão', icon: <Calendar className="w-5 h-5" /> },
    { id: 'coach', label: 'Conselheiro', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'myChallenges', label: 'Evolução', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {!user.hasFinishedTutorial && <Tutorial onComplete={() => setUser(p => ({ ...p, hasFinishedTutorial: true }))} />}
      <header className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl border-b border-rose-100/50 h-20 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-12 h-12 bg-rose-600 rounded-[1.2rem] flex items-center justify-center shadow-xl"><Heart className="w-7 h-7 text-white fill-white" /></div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-rose-950 leading-none tracking-tighter italic">AMOR EM AÇÃO</h1>
              <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Seu relacionamento blindado dia a dia</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-2 bg-rose-50/50 p-1.5 rounded-3xl border border-rose-100">
            {navItems.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-2.5 rounded-2xl text-[11px] font-black flex items-center gap-2.5 transition-all uppercase tracking-widest ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-xl' : 'text-rose-900 hover:bg-white'}`}>
                {React.cloneElement(tab.icon as React.ReactElement, { className: "w-4 h-4" })}
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <NotificationManager
                user={user}
                partner={partner}
                onToggleNotifications={(e) => setUser(p => ({ ...p, notificationsEnabled: e }))}
                onToggleSound={(e) => setUser(p => ({ ...p, soundEnabled: e }))}
                onTestNotification={() => sendNotification("Teste de Lembrete", "Seu sistema de lembretes está funcionando perfeitamente! ❤️")}
              />
            </div>
            <button onClick={() => setActiveTab('connection')} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${user.isLinked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse'}`}>
              {user.isLinked ? <Link2 size={20} /> : <UserPlus size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 relative z-10">
        {!user.isLinked && activeTab !== 'connection' && (
          <div className="mb-8 animate-in slide-in-from-top-4 duration-700">
            <button onClick={() => setActiveTab('connection')} className="w-full bg-rose-50 border border-rose-100 p-4 rounded-3xl flex items-center justify-between group hover:bg-rose-100 transition-all shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 group-hover:scale-110 transition-transform"><UserPlus size={18} /></div>
                <p className="text-sm font-bold text-rose-900">Potencialize sua experiência: <span className="text-rose-600 font-black">Conecte-se com seu parceiro agora</span>.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
        {renderContent()}
      </main>
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2.5 rounded-[2.5rem] flex items-center justify-around shadow-2xl z-[70]">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`flex flex-col items-center gap-1.5 p-3 rounded-[1.5rem] transition-all flex-1 ${activeTab === item.id ? 'text-white bg-white/10 scale-110' : 'text-slate-500 hover:text-white'}`}>
            {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
