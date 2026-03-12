
import React, { useState } from 'react';
import { Link2, Copy, Check, Share2, UserPlus, ShieldCheck, Zap, Sparkles, HeartPulse, MessageCircle, BarChart3 } from 'lucide-react';

interface CoupleConnectionProps {
  userCode: string;
  onLink: (partnerCode: string) => void;
  linkedPartner?: string;
}

const CoupleConnection: React.FC<CoupleConnectionProps> = ({ userCode, onLink, linkedPartner }) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="text-center">
        <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-200">
          <Link2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-black text-rose-900 mb-2">Conectar com Parceiro</h2>
        <p className="text-gray-500">Sincronize tanques emocionais e desafios em tempo real.</p>
      </div>

      <div className="grid gap-6">
        {/* Lado A: Meu Código */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
          
          <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Seu Código de Convite
          </h3>
          
          <div className="relative">
            <div className="flex items-center gap-4 bg-rose-50/50 p-6 rounded-3xl border-2 border-rose-100 border-dashed hover:border-rose-200 transition-colors">
              <div className="flex-1 text-center">
                <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest mb-1">Compartilhe este código</p>
                <span className="text-4xl font-black text-rose-900 tracking-[0.2em] font-mono drop-shadow-sm">{userCode}</span>
              </div>
              
              <button 
                onClick={handleCopy}
                className={`relative p-5 rounded-2xl transition-all duration-300 transform active:scale-90 ${
                  copied 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                    : 'bg-white text-rose-600 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                <div className={`transition-all duration-300 ${copied ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}>
                  <Copy className="w-6 h-6" />
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}>
                  <Check className="w-7 h-7 stroke-[3]" />
                </div>
                
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg transition-all duration-300 pointer-events-none ${copied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                  COPIADO!
                </div>
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-6 leading-relaxed flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-rose-300" />
            Envie este código para seu parceiro(a). Ao inseri-lo, vocês estarão conectados.
          </p>
        </div>

        {/* Lado B: Inserir Código */}
        <div className="bg-rose-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full" />
          
          <h3 className="text-sm font-black text-rose-300 uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
            <UserPlus className="w-4 h-4" /> Inserir Código do Parceiro
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="relative">
              <input 
                type="text"
                placeholder="EX: XH79K2"
                value={inputCode}
                maxLength={6}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full bg-rose-950/50 border border-rose-700 p-6 rounded-3xl text-3xl font-black text-center placeholder-rose-800/50 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 transition-all font-mono tracking-[0.3em]"
              />
            </div>
            <button 
              onClick={() => onLink(inputCode)}
              disabled={inputCode.length < 4}
              className="w-full py-5 bg-white text-rose-900 rounded-3xl font-black text-lg hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              Conectar Agora
              <Zap className="w-5 h-5 fill-rose-900" />
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Vantagens da Conexão */}
      <div className="space-y-6 pt-4">
        <h3 className="text-sm font-black text-rose-900 uppercase tracking-[0.2em] text-center">Por que conectar agora?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6 text-rose-500" />
            </div>
            <h4 className="font-bold text-rose-900 text-sm mb-1">Tanque em Tempo Real</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Saiba exatamente como ele(a) se sente sem precisar perguntar.</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-indigo-500" />
            </div>
            <h4 className="font-bold text-rose-900 text-sm mb-1">Feedback da IA</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Nosso mentor IA analisa a saúde da relação de ambos simultaneamente.</p>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-rose-100 shadow-sm flex flex-col items-center text-center group hover:border-rose-300 transition-all">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-bold text-rose-900 text-sm mb-1">Metas Compartilhadas</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">Completem os 60 dias juntos e vejam a evolução do casal no gráfico.</p>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem] flex items-center gap-5 transition-all hover:bg-indigo-100/50 group">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
           <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-sm mb-0.5">Vantagem Plano Casal</h4>
          <p className="text-xs text-indigo-600 leading-snug">Uma única assinatura libera o acesso Premium para ambos os perfis conectados.</p>
        </div>
        <Zap className="w-5 h-5 text-indigo-400 ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default CoupleConnection;
