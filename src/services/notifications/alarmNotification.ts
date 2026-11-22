import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Alarm } from "@/types/alarm";

export const ALARM_CHANNEL_ID = "alarm_channel_v4";

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
      id: ALARM_CHANNEL_ID,
      name: "Alarmas Elis",
      description:
        "Canal de alta prioridad para despertar el dispositivo con alarmas",
      importance: 5, // 5 = IMPORTANCE_HIGH (enciende la pantalla y muestra alerta flotante Heads-Up)
      visibility: 1, // 1 = VISIBILITY_PUBLIC (visible en pantalla de bloqueo)
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
  const DAY_TO_WEEKDAY: Record<string, number> = {
    D: 1, // Domingo
    L: 2, // Lunes
    M: 3, // Martes
    X: 4, // Miércoles
    J: 5, // Jueves
    V: 6, // Viernes
    S: 7, // Sábado
  };

  const weekDay = alarm.days.map((day) => DAY_TO_WEEKDAY[day]);

  const targetDate = new Date();
  targetDate.setHours(alarm.time.hour, alarm.time.minute, 0, 0);

  if (targetDate.getTime() <= Date.now()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  let notificationsToSchedule = [];

  if (alarm.days.length === 0) {
    notificationsToSchedule = [
      {
        id: alarm.id,
        title: alarm.name || "¡Alarma Sonando!",
        body: "Elige una acción para apagarla:",
        schedule: {
          at: targetDate,
          allowWhileIdle: true,
        },
        actionTypeId: "ALARM_ACTIONS",
        channelId: ALARM_CHANNEL_ID,
        ongoing: true,
        autoCancel: false,
        foreground: true,
      },
    ];
  } else {
    const baseId = alarm.id % 100000000;
    notificationsToSchedule = weekDay.map((dayNumber) => ({
      id: baseId * 10 + dayNumber,
      title: alarm.name || "¡Alarma Sonando!",
      body: "Elige una acción para apagarla:",
      schedule: {
        on: {
          weekday: dayNumber,
          hour: alarm.time.hour,
          minute: alarm.time.minute,
        },
        repeats: true,
        allowWhileIdle: true,
      },
      actionTypeId: "ALARM_ACTIONS",
      channelId: ALARM_CHANNEL_ID,
      ongoing: true,
      autoCancel: false,
      foreground: true,
    }));
  }

  await LocalNotifications.schedule({
    notifications: notificationsToSchedule,
  });
};

export const cancelAlarmNotification = async (alarmId: number) => {
  const baseId = alarmId % 100000000;

  const idsToCancel = [
    { id: alarmId },
    { id: baseId },
    ...[1, 2, 3, 4, 5, 6, 7].map((day) => ({ id: baseId * 10 + day })),
  ];
  await LocalNotifications.cancel({
    notifications: idsToCancel,
  });
};
