
import React from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { CheckCircle2, ShieldCheck, Heart, Sparkles, Star } from 'lucide-react';

interface PaywallProps {
  onSubscribe: (planId: string) => void;
  isExpired: boolean;
}

const Paywall: React.FC<PaywallProps> = ({ onSubscribe, isExpired }) => {
  return (
    <div className="min-h-screen bg-rose-50/30 py-16 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-200 rotate-3">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-5xl font-black text-rose-900 mb-6 tracking-tight">
          {isExpired ? 'O Amor é uma Jornada Diária' : 'Invista no Seu Casamento'}
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Libere o potencial máximo do seu relacionamento com missões ilimitadas, 
          IA personalizada e ferramentas exclusivas de Gary Chapman.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`group relative bg-white p-10 rounded-[3rem] shadow-xl border-2 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl flex flex-col ${
              plan.id === 'annual' 
                ? 'border-rose-500 shadow-rose-200 scale-105 z-10' 
                : 'border-white hover:border-rose-200'
            }`}
            onClick={() => onSubscribe(plan.id)}
          >
            {plan.tag && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[11px] font-black uppercase tracking-[0.2em] py-2 px-6 rounded-full shadow-lg shadow-rose-200 flex items-center gap-2">
                <Star className="w-3 h-3 fill-white" />
                {plan.tag}
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-2xl font-black text-gray-800 mb-3">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-400">R$</span>
                <span className="text-5xl font-black text-rose-900 tracking-tighter">{plan.price.split(',')[0]}</span>
                <span className="text-xl font-bold text-rose-900">,{plan.price.split(',')[1]}</span>
              </div>
              <p className="text-gray-400 font-medium text-sm mt-2">por {plan.period}</p>
            </div>
            
            <div className="space-y-5 mb-12 flex-1">
             {[
                'IA Mentora Ilimitada',
                'Desafios 60 Dias',
                'Tanque de Amor Ilimitado',
                'Dicas Diárias Personalizadas'
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-black text-base transition-all duration-300 transform active:scale-95 ${
              plan.id === 'annual' 
                ? 'bg-rose-600 text-white shadow-xl shadow-rose-200 hover:bg-rose-700' 
                : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}>
              {plan.id === 'annual' ? 'Melhor Escolha' : 'Selecionar'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-center gap-4 text-gray-400">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          Blindando Casamentos
        </div>
        <p className="text-xs text-gray-400">Cancelamento fácil a qualquer momento.</p>
      </div>
    </div>
  );
};

export default Paywall;
