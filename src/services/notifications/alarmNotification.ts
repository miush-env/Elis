import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Alarm } from "@/types/alarm";

export const setupNotifications = async () => {
  try {
    await BackgroundMode.requestNotificationsPermission();

    // Solicitar exclusión de optimización de batería (Doze mode)
    try {
      await BackgroundMode.requestDisableBatteryOptimizations();
    } catch (e) {
      console.warn("Optimización de batería no disponible o rechazada:", e);
    }

    const status = await LocalNotifications.checkPermissions();
    if (status.display !== "granted") {
      await LocalNotifications.requestPermissions();
    }

    // 1. Crear canal de máxima prioridad para despertar la pantalla
    await LocalNotifications.createChannel({
      id: "alarm_channel",
      name: "Alarmas Aura",
      description: "Canal de alta prioridad para despertar el dispositivo con alarmas",
      importance: 5, // 5 = IMPORTANCE_HIGH (enciende la pantalla y muestra alerta)
      visibility: 1, // 1 = VISIBILITY_PUBLIC (visible en pantalla de bloqueo)
      sound: "musica.mp3",
      vibration: true,
    });

    // 2. Registrar los botones de la notificación
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
        channelId: "alarm_channel", // 👈 Canal de alta prioridad para encender la pantalla
        sound: "musica.mp3",
      },
    ],
  });
};

export const cancelAlarmNotification = async (alarmId: number) => {
  await LocalNotifications.cancel({
    notifications: [{ id: alarmId }],
  });
};
