
import { useEffect, useRef } from 'react';
import { UserProfile } from '../types';

interface UseNotificationLogicProps {
  user: UserProfile;
  partner: UserProfile;
  onToggleNotifications: (enabled: boolean) => void;
}

const STRATEGIC_TIMES = [
  { hour: 9, minute: 0, message: "Bom dia! Que tal começar o dia semeando amor? Sua missão está te esperando." },
  { hour: 13, minute: 0, message: "Hora do almoço! Já pensou em como surpreender seu amor hoje?" },
  { hour: 19, minute: 0, message: "O dia está acabando... Não esqueça de regar seu relacionamento com a missão de hoje!" }
];

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const useNotificationLogic = ({ user, partner, onToggleNotifications }: UseNotificationLogicProps) => {
  const lastNotificationRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
  }, []);

  const playSound = () => {
    if (user.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Erro ao tocar som:", e));
    }
  };

  const sendNotification = (title: string, body: string) => {
    console.log(`[Notification] ${title}: ${body}`);
    
    // Tenta tocar o som se estiver ativado, independente da permissão de notificação visual
    // (Útil para o modo simulado em iframes)
    if (user.soundEnabled) {
      playSound();
    }

    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted" && user.notificationsEnabled) {
      try {
        new Notification(title, { 
          body, 
          icon: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
        });
      } catch (e) {
        console.error("Erro ao enviar notificação:", e);
      }
    }
  };

  useEffect(() => {
    if (!user.notificationsEnabled) return;

    if (Notification.permission === "denied" && user.notificationsEnabled) {
      onToggleNotifications(false);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayStr = now.toDateString();

      const missions = partner.challenge.missions;
      const latestMission = missions.length > 0 ? missions[missions.length - 1] : null;
      const isMissionCompleted = latestMission?.completed || false;

      if (isMissionCompleted) return;

      const slot = STRATEGIC_TIMES.find(t => t.hour === currentHour && Math.abs(t.minute - currentMinute) <= 1);
      
      if (slot) {
        const notificationKey = `${todayStr}-${slot.hour}`;
        if (lastNotificationRef.current !== notificationKey) {
          sendNotification("Lembrete Amor em Ação", slot.message);
          lastNotificationRef.current = notificationKey;
        }
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [user.notificationsEnabled, user.soundEnabled, partner.challenge.missions]);

  return { sendNotification };
};
