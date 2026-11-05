import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Alarm } from "@/types/alarm";

export const setupNotifications = async () => {
  try {
    await BackgroundMode.requestNotificationsPermission();

    const status = await LocalNotifications.checkPermissions();
    if (status.display !== "granted") {
      await LocalNotifications.requestPermissions();
    }

    // Registrar los botones de la notificación
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: "ALARM_ACTIONS",
          actions: [
            {
              id: "DISMISS_ACTION",
              title: "Apagar",
            },
            {
              id: "SNOOZE_ACTION",
              title: "Aplazar (5 min)",
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("Error inicializando permisos/acciones:", err);
  }
};

export const scheduleAlarmNotification = async (alarm: Alarm) => {
  const targetDate = new Date();
  targetDate.setHours(alarm.time.hour, alarm.time.minute, 0, 0);

  if (targetDate.getTime() <= Date.now()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  await LocalNotifications.schedule({
    notifications: [
      {
        id: alarm.id,
        title: alarm.name || "¡Alarma Sonando!",
        body: "Elige una acción para apagarla:",
        schedule: { at: targetDate },
        actionTypeId: "ALARM_ACTIONS", // Los botones de Apagar y Aplazar
      },
    ],
  });
};

export const cancelAlarmNotification = async (alarmId: number) => {
  await LocalNotifications.cancel({
    notifications: [{ id: alarmId }],
  });
};
