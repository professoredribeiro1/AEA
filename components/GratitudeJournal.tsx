
import React, { useState } from 'react';
import { GratitudeEntry, LoveLanguage } from '../types';
import { LANGUAGE_METADATA } from '../constants';
import { PenLine, Heart, Calendar, Sparkles, Trash2, Quote, Sun, MessageSquare } from 'lucide-react';

interface GratitudeJournalProps {
  entries: GratitudeEntry[];
  onAddEntry: (entry: Omit<GratitudeEntry, 'id' | 'date'>) => void;
  onDeleteEntry: (id: string) => void;
}

const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ entries, onAddEntry, onDeleteEntry }) => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<LoveLanguage>(LoveLanguage.WORDS);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddEntry({ text, language: selectedLanguage });
    setText('');
    setIsExpanding(false);
  };

  const prompts = [
    "Pelo que você é grato(a) hoje em relação ao seu parceiro(a)?",
    "Qual pequena atitude de carinho você notou hoje?",
    "Lembre-se de uma palavra doce que você ouviu recentemente.",
    "Qual momento de paz vocês compartilharam nas últimas 24h?",
    "Como seu parceiro(a) te fez feliz hoje?"
  ];

  const todayPrompt = prompts[new Date().getDate() % prompts.length];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Motivacional */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100">
          <Sun className="w-4 h-4" /> Cultive a Apreciação
        </div>
        <h2 className="text-4xl font-black text-rose-900 tracking-tight">Diário de Gratidão</h2>
        <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
          Reconhecer o bem no outro é a forma mais rápida de encher o tanque emocional. 
          Registre pequenos momentos que fazem a diferença.
        </p>
      </div>

      {/* Input de Gratidão */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-rose-100/50 border border-rose-100 p-8 md:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Quote size={120} />
        </div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div className="flex items-start gap-4 mb-2">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
              <PenLine className="text-rose-500 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-rose-900 text-lg mb-1">{todayPrompt}</h4>
              <p className="text-xs text-rose-400 font-medium italic">Sua gratidão hoje gera conexão amanhã.</p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanding(true)}
            placeholder="Hoje eu sou grato(a) por..."
            className={`w-full bg-rose-50/30 border border-rose-100 rounded-3xl p-6 text-slate-800 text-lg placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-400/5 transition-all resize-none font-medium ${isExpanding ? 'h-40' : 'h-24'}`}
          />

          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ${isExpanding || text ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <div className="w-full md:w-auto">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Qual linguagem isso reforça?</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(LoveLanguage).filter(l => l !== LoveLanguage.NONE).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      selectedLanguage === lang 
                        ? 'bg-rose-600 border-rose-600 text-white shadow-lg' 
                        : 'bg-white border-rose-100 text-rose-400 hover:border-rose-300'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full md:w-auto px-10 py-5 bg-rose-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-30"
            >
              Registrar Momento <Sparkles className="w-4 h-4 fill-current" />
            </button>
          </div>
        </form>
      </div>

      {/* Histórico de Gratidão */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-xl font-bold text-rose-900 flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            Mural de Bençãos
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {entries.length} {entries.length === 1 ? 'Momento' : 'Momentos'}
          </span>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white/50 border border-dashed border-rose-200 p-16 rounded-[3rem] text-center">
            <MessageSquare className="w-12 h-12 text-rose-200 mx-auto mb-4" />
            <p className="text-rose-300 font-bold">Seu mural está esperando o primeiro momento de gratidão.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entries.slice().reverse().map((entry) => (
              <div key={entry.id} className="bg-white p-6 rounded-[2.5rem] border border-rose-50 shadow-sm hover:shadow-xl transition-all group animate-in zoom-in-95">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center shadow-inner">
                      {LANGUAGE_METADATA[entry.language].icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{entry.language}</p>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <p className="text-slate-700 font-medium italic leading-relaxed">
                  "{entry.text}"
                </p>
                
                <div className="mt-6 flex justify-end">
                   <div className="px-3 py-1 bg-rose-50 rounded-full">
                      <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GratitudeJournal;
