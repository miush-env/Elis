import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { startMusic, stopMusic } from "@/services/sound/playerSound";
import {
  setupNotifications,
  ALARM_CHANNEL_ID,
} from "@/services/notifications/alarmNotification";

export function AlarmGlobalListener() {
  useEffect(() => {
    setupNotifications();

    const receivedListener = LocalNotifications.addListener(
      "localNotificationReceived",
      async () => {
        await startMusic();
      }
    );

    const actionListener = LocalNotifications.addListener(
      "localNotificationActionPerformed",
      async (action) => {
        if (action.actionId === "DISMISS_ACTION") {
          await stopMusic();
          alert("Alarma apagada.");
        } else if (action.actionId === "SNOOZE_ACTION") {
          await stopMusic();
          const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
          await LocalNotifications.schedule({
            notifications: [
              {
                id: Number(action.notification.id) || 1,
                title: "¡Alarma Aplazada!",
                body: "Toca Apagar o Aplazar para detener el sonido.",
                schedule: {
                  at: snoozeDate,
                  allowWhileIdle: true,
                },
                actionTypeId: "ALARM_ACTIONS",
                channelId: ALARM_CHANNEL_ID,
                ongoing: true,
                autoCancel: false,
                foreground: true,
              },
            ],
          });
          alert("Alarma aplazada 5 minutos.");
        }
      }
    );

    return () => {
      receivedListener.then((sub) => sub.remove());
      actionListener.then((sub) => sub.remove());
      // IMPORTANTE: No llamar a stopMusic() aquí para que no se apague al cambiar de pantalla
    };
  }, []);

  return null;
}
