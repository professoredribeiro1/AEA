
import React from 'react';
import { Challenge, LoveLanguage } from '../types';
import { 
  Trophy, History, CheckCircle2, RotateCcw, 
  Target, Zap, Calendar, ArrowRight, Star, TrendingUp
} from 'lucide-react';

interface MyChallengesProps {
  challenge: Challenge;
  partnerName: string;
  onRedoMission: (id: string) => void;
  onGoToChallenge: () => void;
}

const MyChallenges: React.FC<MyChallengesProps> = ({ 
  challenge, 
  partnerName, 
  onRedoMission, 
  onGoToChallenge 
}) => {
  if (!challenge.type) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-rose-100">
          <History className="w-16 h-16 text-rose-200 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-rose-900 mb-4 tracking-tight">Sem Histórico de Amor</h2>
          <p className="text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
            Sua jornada de blindagem emocional ainda não começou. Inicie o desafio de 60 dias para ver seu progresso aqui.
          </p>
          <button 
            onClick={onGoToChallenge} 
            className="px-10 py-5 bg-rose-600 text-white rounded-[2rem] font-black shadow-xl shadow-rose-200 hover:bg-rose-700 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            Começar Jornada <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  const completedMissions = challenge.missions.filter(m => m.completed);
  const progressPercent = Math.round((completedMissions.length / challenge.type) * 100);
  const remainingDays = challenge.type - completedMissions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in pb-12">
      {/* Hero de Progresso Proeminente e Detalhado */}
      <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl shadow-rose-100/20 border border-rose-100 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-50 rounded-full opacity-40 group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-rose-50/50 rounded-full opacity-30" />
        
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Evolução Conjugal
                </div>
              </div>
              <h3 className="text-4xl font-black text-rose-950 tracking-tight leading-none mb-2">Jornada de Blindagem</h3>
              <p className="text-rose-400 font-bold text-sm tracking-wide">Amor sacrificial por {partnerName}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-6xl font-black text-rose-900 tracking-tighter leading-none mb-1">
                {progressPercent}<span className="text-2xl text-rose-300 font-bold">%</span>
              </div>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Concluído do Plano</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-rose-900">{completedMissions.length}</span>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">de</span>
                <span className="text-2xl font-black text-rose-900">{challenge.type}</span>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest ml-1">dias concluídos</span>
              </div>
              <div className="hidden sm:block text-[11px] font-black text-rose-500 uppercase tracking-widest">
                Meta: {challenge.type} Missões de IA
              </div>
            </div>
            
            {/* Barra de Progresso de Alta Fidelidade */}
            <div className="relative h-8 bg-rose-50 rounded-full overflow-hidden p-1.5 border border-rose-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
              <div 
                className="h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Efeito de Reflexo Glossy */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                {/* Brilho Animado */}
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                {/* Linhas de Textura Sutil */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }} />
              </div>
            </div>
          </div>

          {/* Cards de Métricas Atualizados */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-[2rem] border border-rose-50 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                <Trophy className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Missões</p>
              <p className="text-2xl font-black text-rose-900">{completedMissions.length}</p>
            </div>
            <div className="p-5 bg-white rounded-[2rem] border border-rose-50 shadow-sm flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Restantes</p>
              <p className="text-2xl font-black text-rose-900">{remainingDays}</p>
            </div>
            <div className="p-5 bg-rose-900 rounded-[2rem] shadow-lg flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-rose-200" />
              </div>
              <p className="text-[9px] font-black text-rose-300 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter">Ativo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico Detalhado */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-rose-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-white border border-rose-100 rounded-xl flex items-center justify-center shadow-sm">
              <History className="w-5 h-5 text-rose-500" />
            </div>
            Caminho Percorrido
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linha do Tempo</span>
        </div>

        <div className="grid gap-5">
          {challenge.missions.slice().reverse().map(m => (
            <div 
              key={m.id} 
              className={`p-6 rounded-[2.5rem] border transition-all duration-300 relative group overflow-hidden ${
                m.completed 
                  ? 'bg-white border-rose-100 hover:shadow-xl hover:-translate-y-1' 
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              {m.completed && (
                <div className="absolute right-0 top-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Star size={80} />
                </div>
              )}

              <div className="flex items-start gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm ${
                  m.completed 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  <span className="text-[10px] font-black uppercase leading-none mb-0.5">Dia</span>
                  <span className="text-xl font-black leading-none">{m.day}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                      <h4 className={`font-black text-lg truncate ${m.completed ? 'text-rose-900' : 'text-slate-500'}`}>
                        {m.title}
                      </h4>
                      {m.completed && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                            <CheckCircle2 className="w-3 h-3" /> Validada
                        </div>
                      )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {m.description}
                  </p>
                  
                  {m.completed && m.aiFeedback && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 animate-in slide-in-from-top-2">
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                           <Star className="w-3 h-3 fill-rose-400" /> Feedback do Mentor
                        </p>
                        <p className="text-xs text-slate-600 italic leading-relaxed">
                          "{m.aiFeedback}"
                        </p>
                    </div>
                  )}

                  {m.completed ? (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-400 font-bold">
                        Concluído em: {new Date(m.completedAt!).toLocaleDateString('pt-BR')}
                      </span>
                        <button 
                          onClick={() => onRedoMission(m.id)} 
                          className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black hover:bg-rose-600 hover:text-white transition-all uppercase tracking-wider"
                        >
                          <RotateCcw className="w-3 h-3" /> Refazer Missão
                        </button>
                    </div>
                    ) : (
                    <button 
                      onClick={onGoToChallenge}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                        Ver detalhes da missão <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChallenges;
