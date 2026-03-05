
import React, { useState } from 'react';
import { User, HeartPulse, Palette, Sparkles, Droplets, Layout, Heart } from 'lucide-react';
import { TankTheme } from '../types';

interface TankGaugeProps {
  level: number;
  onUpdate: (newLevel: number) => void;
  label: string;
  type: 'self' | 'partner';
  theme: TankTheme;
  onThemeChange: (theme: TankTheme) => void;
}

const TankGauge: React.FC<TankGaugeProps> = ({ level, onUpdate, label, type, theme, onThemeChange }) => {
  const [showThemePicker, setShowThemePicker] = useState(false);

  const getLevelColor = () => {
    if (level <= 3) return 'from-rose-400 to-red-600';
    if (level <= 7) return 'from-amber-300 to-orange-500';
    return 'from-rose-400 to-rose-600';
  };

  const currentTheme = theme || TankTheme.MODERN;

  const containerClasses = {
    [TankTheme.MODERN]: "rounded-[3rem] border-rose-100/50",
    [TankTheme.MINIMALIST]: "rounded-3xl border-slate-200 shadow-none",
    [TankTheme.WATERCOLOR]: "rounded-[4rem] border-rose-100/30 shadow-rose-100/10"
  }[currentTheme];

  const tankBorderRadius = {
    [TankTheme.MODERN]: "rounded-[2.5rem]",
    [TankTheme.MINIMALIST]: "rounded-2xl",
    [TankTheme.WATERCOLOR]: "rounded-[3.5rem]"
  }[currentTheme];

  return (
    <div className={`glass-card p-8 hover-lift relative overflow-hidden flex flex-col h-full ${containerClasses}`}>
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
            {type === 'self' ? <User className="w-3 h-3" /> : <HeartPulse className="w-3 h-3" />}
            {label}
          </h3>
          <p className="font-serif italic text-xl text-rose-950">
            {level <= 3 ? 'Reserva Crítica' : level <= 7 ? 'Como está seu Casamento Hoje?' : 'Plenitude de Amor'}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-rose-50">
          <span className="text-3xl font-black text-rose-900">{level}</span>
          <span className="text-xs text-rose-300 font-bold ml-1">/10</span>
        </div>
      </div>

      {/* Tanque Visual */}
      <div className={`relative h-48 w-full bg-rose-50/50 overflow-hidden mb-8 shadow-inner ${tankBorderRadius} ${currentTheme === TankTheme.MINIMALIST ? 'border border-slate-100' : 'border border-rose-100/30'}`}>
        <div
          className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out bg-gradient-to-t ${getLevelColor()}`}
          style={{ height: `${level * 10}%` }}
        >
          {/* Efeitos por Tema */}
          {currentTheme === TankTheme.MODERN && (
            <>
              <div className="liquid-wave" />
              <div className="liquid-wave" />
            </>
          )}

          {currentTheme === TankTheme.WATERCOLOR && (
            <>
              <div className="watercolor-wave" />
              <div className="watercolor-wave" style={{ animationDelay: '-5s', opacity: 0.6 }} />
            </>
          )}

          {currentTheme === TankTheme.MINIMALIST && (
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40" />
          )}

          {/* Partículas de Brilho */}
          {currentTheme !== TankTheme.MINIMALIST && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ left: `${i * 20 + 10}%`, top: `${Math.random() * 100}%`, animationDelay: `${i * 0.5}s` }} />
              ))}
            </div>
          )}
        </div>

        {/* Marcadores de Nível */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
          {[10, 7.5, 5, 2.5, 0].map(n => (
            <div key={n} className="flex items-center gap-2 opacity-10">
              <div className="w-4 h-[1px] bg-rose-900" />
              <span className="text-[8px] font-bold text-rose-900">{n}</span>
            </div>
          ))}
        </div>

        {/* Ícone Flutuante */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-in-out animate-float"
          style={{ bottom: `calc(${level * 10}% - 20px)` }}
        >
          <div className="bg-white p-2 rounded-full shadow-lg border border-rose-100">
            <Heart className={`w-4 h-4 fill-current ${level <= 3 ? 'text-red-500' : 'text-rose-500'}`} />
          </div>
        </div>
      </div>

      {/* Controles */}
      {type === 'self' && (
        <div className="mt-auto relative z-10">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ajustar Nível</p>
            <div className="flex gap-1">
              {[0, 2, 4, 6, 8, 10].map(v => (
                <div key={v} className={`w-1 h-1 rounded-full transition-all ${level >= v ? 'bg-rose-400' : 'bg-rose-100'}`} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-11 gap-1 mb-6">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
              <button
                key={val}
                onClick={() => onUpdate(val)}
                className={`h-9 rounded-xl text-[10px] font-black transition-all ${level === val
                    ? 'bg-rose-600 text-white scale-110 shadow-lg shadow-rose-200'
                    : 'bg-white hover:bg-rose-50 text-slate-400 border border-rose-50'
                  }`}
              >
                {val}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setShowThemePicker(!showThemePicker)} className="flex items-center gap-2 group p-2 hover:bg-rose-50 rounded-xl transition-all">
              <Palette className="w-4 h-4 text-rose-400 group-hover:rotate-12 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-rose-600">Customizar Visual</span>
            </button>

            {showThemePicker && (
              <div className="flex gap-2 p-1 bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-rose-50 animate-in zoom-in-95">
                <button
                  title="Moderno"
                  onClick={() => { onThemeChange(TankTheme.MODERN); setShowThemePicker(false); }}
                  className={`p-2.5 rounded-xl transition-all ${currentTheme === TankTheme.MODERN ? 'bg-rose-600 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-400'}`}
                >
                  <Layout size={16} />
                </button>
                <button
                  title="Minimalista"
                  onClick={() => { onThemeChange(TankTheme.MINIMALIST); setShowThemePicker(false); }}
                  className={`p-2.5 rounded-xl transition-all ${currentTheme === TankTheme.MINIMALIST ? 'bg-rose-600 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-400'}`}
                >
                  <Sparkles size={16} />
                </button>
                <button
                  title="Aquarela"
                  onClick={() => { onThemeChange(TankTheme.WATERCOLOR); setShowThemePicker(false); }}
                  className={`p-2.5 rounded-xl transition-all ${currentTheme === TankTheme.WATERCOLOR ? 'bg-rose-600 text-white shadow-lg' : 'hover:bg-rose-50 text-rose-400'}`}
                >
                  <Droplets size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {type === 'partner' && (
        <div className="mt-auto relative z-10 py-4 border-t border-rose-100/30">
          <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
            Este é o nível atual de {label.split(' ')[2] || 'seu parceiro'}. Apenas ele(a) pode atualizar este medidor.
          </p>
        </div>
      )}
    </div>
  );
};

export default TankGauge;
