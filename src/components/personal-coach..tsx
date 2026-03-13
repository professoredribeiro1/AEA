
import React, { useState, useRef, useEffect } from 'react';
import { getCoachAdvice } from '../services/gemini-service';
import { Message } from '../types';
import { Send, User, Bot, Sparkles, Book, ShieldAlert, Heart, Trash2, Eye, ArrowDown } from 'lucide-react';

const PersonalCoach: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('coach_history');
    return saved ? JSON.parse(saved) : [{
      role: 'model',
      text: 'Olá. Sou seu Conselheiro Pastoral. Estou aqui para oferecer sabedoria bíblica, suporte psicológico e estratégias de crise para que seu casamento floresça. Como posso ajudar hoje?',
      timestamp: new Date().toISOString()
    }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Auto-scroll para a última mensagem quando o histórico muda
  useEffect(() => {
    localStorage.setItem('coach_history', JSON.stringify(messages));
    if (!showScrollBtn) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollBtn(!isNearBottom);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getCoachAdvice(text);
      const botMsg: Message = { role: 'model', text: response, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'model',
      text: 'Histórico limpo. Como posso ajudar agora?',
      timestamp: new Date().toISOString()
    }]);
    setShowClearConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 relative">
      {/* Modal de Confirmação de Limpeza */}
      {showClearConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-900/60 backdrop-blur-sm p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-8 h-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900 text-center mb-2">Apagar Histórico?</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
              Esta ação não pode ser desfeita. Todas as mensagens serão removidas permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={clearChat}
                className="flex-1 py-4 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
              >
                Sim, Apagar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <div className="bg-indigo-900 p-6 text-white flex justify-between items-center shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-400/30">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black leading-none mb-1 tracking-tight">Conselheiro Pastoral</h2>
            <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Semeando o bem para o bem.</p>
          </div>
        </div>
        <button onClick={() => setShowClearConfirm(true)} className="p-3 hover:bg-white/10 rounded-xl transition-all text-indigo-300 hover:text-white" title="Limpar conversa">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Área de Mensagens com Container para Botão Flutuante */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-slate-50/50">
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth overscroll-contain"
        >
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[88%] md:max-w-[80%] p-5 rounded-[2rem] shadow-sm relative group ${m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 rounded-tl-none border border-indigo-50'
                }`}>
                <div className={`flex items-center gap-2 mb-2 opacity-60 text-[10px] font-black uppercase tracking-widest ${m.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {m.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-indigo-400" />}
                  {m.role === 'user' ? 'Você' : 'Conselheiro Pastoral'}
                </div>
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                  {m.text}
                </div>
                <div className={`text-[9px] mt-2 opacity-40 text-right font-bold ${m.role === 'user' ? 'text-white' : 'text-slate-400'}`}>
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-indigo-100 text-indigo-500 text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-sm animate-pulse">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                Refletindo na melhor resposta...
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>

        {/* Botão Flutuante de Scroll */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all z-30 animate-in fade-in zoom-in duration-300 flex items-center justify-center group"
            aria-label="Rolar para o final"
          >
            <ArrowDown className="w-6 h-6 group-hover:animate-bounce" />
          </button>
        )}
      </div>

      {/* Input Section Fixo na Base */}
      <div className="p-6 bg-white border-t border-indigo-50 shrink-0 z-20">
        {input && (
          <div className="mb-4 px-5 py-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <Eye className="w-4 h-4 text-indigo-600" />
            <div className="flex-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Visualização do que você escreve:</p>
              <p className="text-sm font-bold text-indigo-900 leading-snug">{input}</p>
            </div>
          </div>
        )}

        <form className="relative flex gap-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <input
            className="flex-1 bg-slate-50 border border-slate-200 p-5 pr-16 rounded-[1.5rem] text-[16px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-semibold shadow-inner"
            placeholder="Digite sua dúvida aqui..."
            style={{ color: '#0f172a' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-2.5 p-3.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-200 transition-all disabled:opacity-30 disabled:grayscale transform active:scale-90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Shortcuts */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar py-1">
          <button onClick={() => handleSend("Pode me dar um conselho bíblico para fortalecer meu casamento hoje?")} className="flex-none px-5 py-2.5 bg-white text-slate-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-slate-200 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"><Book className="w-3.5 h-3.5 text-indigo-500" /> Bíblico</button>
          <button onClick={() => handleSend("Como lidar psicologicamente com a falta de comunicação?")} className="flex-none px-5 py-2.5 bg-white text-slate-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-slate-200 hover:border-rose-500 hover:text-rose-600 transition-all shadow-sm"><Heart className="w-3.5 h-3.5 text-rose-500" /> Psicológico</button>
          <button onClick={() => handleSend("S.O.S: Estamos em um momento de crise intensa. O que fazer agora?")} className="flex-none px-5 py-2.5 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"><ShieldAlert className="w-3.5 h-3.5" /> Crise S.O.S</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalCoach;

