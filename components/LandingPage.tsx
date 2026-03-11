
import React, { useState } from 'react';
import { Heart, ShieldCheck, Sparkles, Star, ChevronRight, Lock, User, Mail, Zap } from 'lucide-react';
import { supabase } from '../services/supabase';

interface LandingPageProps {
  onLogin: (name: string, session?: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const plans = [
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: '39,90',
      period: 'mês',
      desc: 'Flexibilidade total para começar sua jornada de semeadura.',
      tag: null,
      checkoutUrl: 'https://pay.kiwify.com.br/dBIkYV3'
    },
    {
      id: 'quarterly',
      name: 'Plano Trimestral',
      price: '89,90',
      period: '3 meses',
      desc: 'O tempo ideal para consolidar novos hábitos e ver os frutos.',
      tag: 'Mais Popular',
      checkoutUrl: 'https://pay.kiwify.com.br/MlAXRDE'
    },
    {
      id: 'annual',
      name: 'Plano Anual',
      price: '247,00',
      period: '12 meses',
      desc: 'Comprometimento total com a blindagem e felicidade do seu lar.',
      tag: 'Melhor Valor',
      checkoutUrl: 'https://pay.kiwify.com.br/nN8mpnd'
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-rose-100">
      {/* Hero Section Disruptiva */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-50 via-transparent to-transparent opacity-50 -z-10 animate-pulse" />

        <div className="max-w-5xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-[0.3em] border border-rose-100 shadow-sm">
            <Heart className="w-4 h-4 fill-rose-600" /> Amor em Ação
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-rose-950 leading-[0.95] tracking-tight italic">
            O amor não é um evento.<br />
            <span className="text-rose-600 not-italic">É um estilo de vida.</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Mais do que um aplicativo, o Amor em Ação é o check-up diário da saúde do seu casamento. Cultive ciclos infinitos de conexão, intimidade e aventura.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <button
              onClick={() => { setIsSignUp(true); setShowAuth(true); }}
              className="px-12 py-6 bg-rose-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-rose-700 hover:scale-105 transition-all shadow-2xl shadow-rose-200 flex items-center gap-3 group"
            >
              Começar Teste Grátis <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => { setIsSignUp(false); setShowAuth(true); }}
              className="px-8 py-6 bg-white text-slate-900 border border-slate-200 rounded-[2.5rem] font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Já sou aluno
            </button>
            <a href="#plans" className="px-8 py-6 bg-white text-slate-900 border border-slate-200 rounded-[2.5rem] font-bold text-lg hover:bg-slate-50 transition-all">
              Ver Planos
            </a>
          </div>

          <p className="text-sm font-bold text-rose-400 uppercase tracking-[0.2em] animate-pulse">
            Junte-se a +5.420 casais transformando suas relações hoje
          </p>
        </div>

        {/* Efeito Visual de "Mãos dadas" com a IA */}
        <div className="mt-20 w-full max-w-6xl h-64 bg-rose-50/50 rounded-[4rem] border border-rose-100 border-dashed flex items-center justify-around px-10 opacity-60">
          <div className="flex flex-col items-center gap-3">
            <Heart className="w-10 h-10 text-rose-400" />
            <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Afeto</span>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-10" />
          <div className="flex flex-col items-center gap-3">
            <Zap className="w-10 h-10 text-rose-400" />
            <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Ação</span>
          </div>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-rose-200 to-transparent mx-10" />
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-rose-400" />
            <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Proteção</span>
          </div>
        </div>
      </section>

      {/* Auth Modal / Section */}
      {showAuth && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rose-950/20 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] shadow-2xl overflow-hidden p-10 md:p-14">
            <div className="text-center space-y-4 mb-10">
              <h3 className="text-3xl font-black text-rose-950">{isSignUp ? 'Criar Conta' : 'Acessar Conta'}</h3>
              <p className="text-slate-500 font-medium italic">
                {isSignUp ? 'Sua jornada de 7 dias grátis começa aqui.' : 'Bem-vindo de volta!'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-xl font-medium text-center">
                {errorMsg}
              </div>
            )}

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setErrorMsg('');
              setLoading(true);

              try {
                if (isSignUp) {
                  const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                      data: { full_name: name || 'Usuário' }
                    }
                  });
                  if (error) throw error;
                  if (data.user) {
                    onLogin(data.user.user_metadata.full_name || 'Usuário', data.session);
                  }
                } else {
                  const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                  });
                  if (error) throw error;
                  if (data.user) {
                    onLogin(data.user.user_metadata.full_name || 'Usuário', data.session);
                  }
                }
              } catch (error: any) {
                setErrorMsg(error.message || 'Ocorreu um erro na autenticação.');
              } finally {
                setLoading(false);
              }
            }}>
              {isSignUp && (
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Seu Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 py-5 pl-16 pr-8 rounded-[2rem] focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all"
                  />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Seu E-mail"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 py-5 pl-16 pr-8 rounded-[2rem] focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Sua Senha"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 py-5 pl-16 pr-8 rounded-[2rem] focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all"
                />
              </div>

              <button disabled={loading} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black text-xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 mt-6 disabled:opacity-70 flex items-center justify-center gap-2">
                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {isSignUp ? 'Criar Minha Conta' : 'Entrar na Conta'}
              </button>
            </form>
            <div className="mt-6 flex flex-col items-center gap-4">
              {isSignUp ? (
                <button type="button" onClick={() => { setIsSignUp(false); setErrorMsg(''); }} className="text-slate-500 font-bold text-sm hover:text-rose-600">
                  Já tem uma conta? Faça login
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <button type="button" onClick={() => { setIsSignUp(true); setErrorMsg(''); }} className="text-slate-500 font-bold text-sm hover:text-rose-600">
                    Não tem conta? Comece seu Teste Grátis
                  </button>
                  <span className="text-slate-300 text-xs font-medium">ou</span>
                  <a href="#plans" onClick={() => setShowAuth(false)} className="text-slate-500 font-bold text-sm hover:text-rose-600">
                    Veja nossos planos de assinatura
                  </a>
                </div>
              )}
              <button type="button" onClick={() => setShowAuth(false)} className="text-slate-400 font-bold text-sm hover:text-rose-600">
                Voltar à Página Anterior
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seção: O Problema (Agitação da Dor) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-4xl md:text-5xl font-black text-rose-950 leading-tight">
            Seu casamento virou uma <span className="text-rose-600">lista de tarefas?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Silêncio no Jantar", desc: "Aquelas conversas profundas deram lugar ao 'como foi o dia?' automático." },
              { title: "Rotina Esmagadora", desc: "O cansaço do trabalho e dos filhos consome toda a energia para o romance." },
              { title: "Distância Invisível", desc: "Vocês moram na mesma casa, mas parecem estar em mundos diferentes." }
            ].map((item, i) => (
              <div key={i} className="p-8 bg-rose-50/30 rounded-3xl border border-rose-100/50 text-left space-y-4">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold">{i + 1}</div>
                <h4 className="text-xl font-black text-rose-900">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona (A Jornada) */}
      <section className="py-24 px-6 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black leading-tight italic">
                Semeando amor com <br />
                <span className="text-rose-500 not-italic">Inteligência Afetiva.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { t: "Descubra a Linguagem", d: "Nossa IA identifica como cada um de vocês se sente amado de verdade." },
                  { t: "Missões Personalizadas", d: "Receba tarefas diárias curtas, práticas e poderosas para surpreender seu parceiro." },
                  { t: "Evolução Contínua", d: "Acompanhe o 'nível do tanque' e veja sua conexão crescer em tempo real." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="shrink-0 w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center font-black text-xl">{i + 1}</div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">{step.t}</h4>
                      <p className="text-slate-400 leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-rose-500/20 to-transparent rounded-[4rem] border border-white/10 flex items-center justify-center p-12">
                <div className="w-full aspect-video bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center">
                  <Heart className="w-24 h-24 text-rose-500 animate-pulse fill-rose-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Prova Social (Depoimentos) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-rose-950">Histórias de <span className="text-rose-600">Reconexão.</span></h2>
            <p className="text-slate-500 font-medium">Milhares de casais já voltaram a sorrir juntos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "Mariana & Ricardo", t: "Estávamos quase desistindo. O app nos ensinou a falar a língua um do outro. Hoje somos melhores amigos novamente.", s: 5 },
              { n: "Carla & João", t: "As missões são simples, mas o impacto é gigante. É como se tivéssemos voltado ao tempo do namoro.", s: 5 },
              { n: "Felipe & Bia", t: "O Conselheiro Pastoral é impressionante. Ele nos deu conselhos que nem 10 sessões de terapia deram.", s: 5 }
            ].map((test, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[3rem] space-y-6">
                <div className="flex gap-1">
                  {[...Array(test.s)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-600 italic font-medium leading-relaxed">"{test.t}"</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="font-black text-rose-900">{test.n}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Comparativo (Nós vs. Eles) */}
      <section className="py-24 px-6 bg-rose-50/50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-rose-950">O custo de <span className="text-rose-600">não fazer nada.</span></h2>
            <p className="text-slate-500 font-medium italic">Compare a vida no automático com uma vida de semeadura intencional.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 space-y-8 opacity-60">
              <h4 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No Automático</h4>
              <ul className="space-y-6">
                {['Distanciamento gradual', 'Brigas por motivos bobos', 'Falta de admiração', 'Solidão a dois'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-400 font-medium">
                    <div className="w-2 h-2 bg-slate-300 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-10 rounded-[3rem] border-4 border-rose-500 space-y-8 shadow-2xl shadow-rose-100">
              <h4 className="text-2xl font-black text-rose-600 uppercase tracking-widest">Com Amor em Ação</h4>
              <ul className="space-y-6">
                {['Conexão profunda diária', 'Resolução leve de conflitos', 'Admiração renovada', 'Cumplicidade inabalável'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-rose-950 font-bold">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Depoimentos (Prova Social com IA) */}
      <section className="py-24 px-6 bg-rose-50/30 border-t border-slate-100">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-rose-950">Mais de 5.420 casais já transformaram <span className="text-rose-600">suas vidas.</span></h2>
            <p className="text-slate-500 font-medium italic">Veja o que dizem aqueles que decidiram semear intencionalmente.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'https://picsum.photos/seed/couple1/400/400', name: 'Mariana & Thiago', time: 'Casados há 5 anos', text: 'Nós estávamos vivendo no automático. O aplicativo nos trouxe de volta aquela faísca do início do namoro. As missões ajudam muito!' },
              { img: 'https://picsum.photos/seed/couple2/400/400', name: 'Roberto & Sônia', time: 'Casados há 28 anos', text: 'Eu achava que depois de tanto tempo, não havia mais o que inovar. Estava errado. O check-up nos ajudou a entender várias coisas.' },
              { img: 'https://picsum.photos/seed/couple3/400/400', name: 'Carol & Bruno', time: 'Casados há 2 anos', text: 'Começamos a usar logo depois do casamento. É como ter um conselheiro no bolso nos ajudando a blindar nossa relação desde o primeiro dia.' }
            ].map((test, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 relative flex flex-col items-center text-center mt-12">
                <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-rose-100">
                  <img src={test.img} alt={test.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                </div>
                <div className="pt-8">
                  <div className="flex gap-1 justify-center mb-4">
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-slate-600 italic font-medium leading-relaxed mb-6">"{test.text}"</p>
                  <div>
                    <p className="font-black text-rose-900">{test.name}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{test.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: FAQ (Quebra de Objeções) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto space-y-16">
          <h2 className="text-4xl font-black text-rose-950 text-center italic">Dúvidas Frequentes</h2>
          <div className="space-y-8">
            {[
              { q: "E se meu parceiro não quiser participar?", a: "O Amor em Ação foi desenhado para que VOCÊ possa começar a semear. Muitas vezes, a mudança de um gera uma reação em cadeia positiva no outro." },
              { q: "Tenho pouco tempo no dia a dia...", a: "As missões levam de 2 a 10 minutos. É sobre consistência, não sobre horas de esforço." },
              { q: "É seguro compartilhar nossos dados?", a: "Privacidade é nossa prioridade. Seus dados são criptografados e usados apenas para personalizar sua experiência com a IA." }
            ].map((faq, i) => (
              <div key={i} className="space-y-3 border-b border-slate-100 pb-8">
                <h4 className="text-xl font-black text-rose-900">{faq.q}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Garantia (Risco Zero) */}
      <section className="py-24 px-6 bg-emerald-50">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[4rem] border-4 border-emerald-100 text-center space-y-8 shadow-2xl">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl font-black text-slate-900">Garantia de <span className="text-emerald-600">Felicidade.</span></h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Teste o Amor em Ação por 7 dias sem pagar nada. Se você não sentir uma mudança na atmosfera da sua casa, cancele com um clique. Sem perguntas, sem letras miúdas.
          </p>
          <button
            onClick={() => { setIsSignUp(true); setShowAuth(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-block px-12 py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
          >
            Começar Meu Teste Grátis
          </button>
          <div className="mt-4">
            <a href="#plans" className="text-emerald-600 font-bold hover:text-emerald-700 underline">
              Ou escolha um plano agora
            </a>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-black text-rose-950 tracking-tight">Investimento no <span className="text-rose-600">Eterno.</span></h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Escolha o plano que melhor se adapta à sua realidade e blinde seu relacionamento hoje mesmo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white p-12 rounded-[4rem] shadow-xl border-2 transition-all duration-500 hover:-translate-y-4 ${plan.id === 'quarterly' ? 'border-rose-500 scale-105 z-10 shadow-rose-100' : 'border-white hover:border-rose-100'
                  }`}
              >
                {plan.tag && (
                  <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-white text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full shadow-lg ${plan.id === 'annual' ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}>
                    {plan.tag}
                  </div>
                )}

                <div className="space-y-6 mb-12">
                  <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-400 italic">R$</span>
                    <span className="text-6xl font-black text-rose-900 tracking-tighter">{plan.price.split(',')[0]}</span>
                    <span className="text-2xl font-black text-rose-900">,{plan.price.split(',')[1]}</span>
                  </div>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">por {plan.period}</p>
                </div>

                <p className="text-slate-600 font-medium mb-12 min-h-[60px]">
                  {plan.desc}
                </p>

                <div className="space-y-4 mb-12">
                  {['Check-up Diário de Saúde', 'Conselheiro Pastoral Ilimitado', 'Ciclos Infinitos de Evolução', 'Histórico de Legado do Casal'].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <ShieldCheck className="w-5 h-5 text-rose-500" />
                      {feat}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => window.location.href = plan.checkoutUrl}
                  className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all ${plan.id === 'quarterly'
                      ? 'bg-rose-600 text-white shadow-xl shadow-rose-200 hover:bg-rose-700'
                      : plan.id === 'annual'
                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100 hover:bg-emerald-700'
                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                    }`}
                >
                  Selecionar Plano
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: Nota do Fundador */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 bg-rose-100 rounded-[3rem] shrink-0 overflow-hidden border-4 border-white shadow-xl rotate-3">
            <img src="https://picsum.photos/seed/founder/400/400" alt="Fundador" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-rose-950 italic">"O amor não morre por falta de sentimento, mas por falta de manutenção."</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Criei o Amor em Ação porque vi casais incríveis se perdendo na rotina. A tecnologia deve servir para nos aproximar de quem mais amamos, não para nos isolar. Este app é o meu compromisso com a sua felicidade.
            </p>
            <div>
              <p className="font-black text-rose-900 text-xl">Pastor Roberto</p>
              <p className="text-rose-400 font-bold uppercase tracking-widest text-xs">Pastor e Especialista em Relacionamentos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-20 text-center border-t border-slate-100">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg"><Heart className="w-6 h-6 text-white fill-white" /></div>
          <h1 className="text-xl font-black text-rose-950 tracking-tighter italic">AMOR EM AÇÃO</h1>
        </div>
        <p className="text-slate-400 text-sm font-medium">© 2026 Amor em Ação. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
