
import { useEffect, useRef } from 'react';
import { UserProfile } from '../types';

interface UseNotificationLogicProps {
  user: UserProfile;
  partner: UserProfile;
  onToggleNotifications: (enabled: boolean) => void;
}

const STRATEGIC_TIMES = [
  { hour: 9, minute: 0, priority: 'normal', message: "Bom dia! Que tal começar o dia semeando amor? Sua missão de Amor Sacrificial te espera." },
  { hour: 13, minute: 0, priority: 'normal', message: "Hora do almoço! Como você pode servir ao seu amor hoje?" },
  { hour: 19, minute: 0, priority: 'urgent', message: "O dia está acabando... Regue seu relacionamento com a missão de hoje!" }
];

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const useNotificationLogic = ({ user, partner, onToggleNotifications }: UseNotificationLogicProps) => {
  const lastNotificationRef = useRef<string | null>(localStorage.getItem('last_notification_key'));
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

    if (user.soundEnabled) playSound();

    // Fallback: Se não houver suporte ou permissão, usamos um alert amigável como lembrete "Smart"
    if (!("Notification" in window) || Notification.permission !== "granted") {
      if (user.notificationsEnabled) {
        alert(`${title}\n\n${body}`);
      }
      return;
    }

    try {
      new Notification(title, {
        body,
        icon: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
      });
    } catch (e) {
      console.error("Erro ao enviar notificação:", e);
      alert(body);
    }
  };

  useEffect(() => {
    if (!user.notificationsEnabled) return;

    // Solicita permissão se ainda estiver "default"
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const todayStr = now.toDateString();

      // Verificar se a última missão do dia já foi concluída
      const missions = partner.challenge.missions;
      const latestMission = missions.length > 0 ? missions[missions.length - 1] : null;
      const isMissionCompleted = latestMission?.completed || false;
      if (isMissionCompleted) return;

      // "Smart": Se o tanque do parceiro estiver crítico, o lembrete é mais urgente
      const isTankCritical = partner.tankLevel <= 3;

      const slot = STRATEGIC_TIMES.find(t =>
        (t.hour === currentHour && Math.abs(t.minute - currentMinute) <= 2) ||
        (t.hour < currentHour && lastNotificationRef.current !== `${todayStr}-${t.hour}`) // Check para lembrete ignorado/app fechado
      );

      if (slot) {
        const notificationKey = `${todayStr}-${slot.hour}`;
        if (lastNotificationRef.current !== notificationKey) {
          const message = isTankCritical
            ? `⚠️ O tanque de ${partner.name} está baixo (${partner.tankLevel}/10). Uma missão de Amor Sacrificial agora faria toda a diferença!`
            : slot.message;

          sendNotification("Lembrete Amor em Ação", message);
          lastNotificationRef.current = notificationKey;
          localStorage.setItem('last_notification_key', notificationKey);
        }
      }
    };

    // Executa imediatamente ao abrir e depois a cada minuto
    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [user.notificationsEnabled, user.soundEnabled, partner.challenge.missions, partner.tankLevel, partner.name]);

  return { sendNotification };
};
