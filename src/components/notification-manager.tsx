
import React from 'react';
import { UserProfile } from '../types';
import { Bell, BellOff } from 'lucide-react';

interface NotificationManagerProps {
  user: UserProfile;
  partner: UserProfile;
  onToggleNotifications: (enabled: boolean) => void;
  onToggleSound: (enabled: boolean) => void;
  onTestNotification: () => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  user, 
  onToggleNotifications, 
  onToggleSound,
  onTestNotification
}) => {
  const [status, setStatus] = React.useState<string>("");

  const toggleNotifications = async () => {
    const nextState = !user.notificationsEnabled;
    
    // Sempre atualiza o estado do app imediatamente para garantir que o botão responda
    onToggleNotifications(nextState);

    if (nextState) {
      // Se estiver ativando, tenta solicitar permissão do navegador
      if (!("Notification" in window)) {
        setStatus("Modo Simulado (Navegador incompatível)");
        setTimeout(() => setStatus(""), 3000);
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Lembretes Ativados!", {
            body: "Você receberá alertas sonoros e visuais.",
            icon: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
          });
        } else {
          setStatus("Ativado (Sem permissão visual)");
          setTimeout(() => setStatus(""), 3000);
        }
      } catch (error) {
        console.error("Erro ao solicitar permissão:", error);
        setStatus("Ativado (Modo Simulado)");
        setTimeout(() => setStatus(""), 3000);
      }
    }
  };

  const handleTest = () => {
    if (!user.notificationsEnabled) {
      setStatus("Ative os lembretes primeiro.");
      setTimeout(() => setStatus(""), 3000);
      return;
    }
    
    if (!("Notification" in window) || Notification.permission !== "granted") {
      setStatus("Simulando notificação (Som/Log)");
      setTimeout(() => setStatus(""), 3000);
    }
    
    onTestNotification();
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-rose-100 shadow-sm relative">
      {status && (
        <div className="absolute -top-10 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2 z-50">
          <span className="bg-slate-800 text-white text-[10px] px-4 py-1.5 rounded-full font-bold shadow-xl border border-white/10">
            {status}
          </span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Lembretes Inteligentes</span>
        <span className="text-xs font-bold text-slate-600">
          {user.notificationsEnabled ? "Ativados (9h, 13h, 19h)" : "Desativados"}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleTest}
          className="px-3 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
          title="Testar Notificação"
        >
          Testar
        </button>

        <button 
          onClick={toggleNotifications}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${user.notificationsEnabled ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-rose-50 text-rose-400 border border-rose-100'}`}
          title={user.notificationsEnabled ? "Desativar Notificações" : "Ativar Notificações"}
        >
          {user.notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
        </button>
        
        {user.notificationsEnabled && (
          <button 
            onClick={() => onToggleSound(!user.soundEnabled)}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${user.soundEnabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-400 border border-indigo-100'}`}
            title={user.soundEnabled ? "Desativar Som" : "Ativar Som"}
          >
            <span className="text-lg">{user.soundEnabled ? "🔊" : "🔇"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationManager;
