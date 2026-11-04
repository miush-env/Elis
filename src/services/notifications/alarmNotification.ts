import { BackgroundMode } from "@anuradev/capacitor-background-mode";
import { LocalNotifications } from "@capacitor/local-notifications";
import type {Alarm} from "@/types/alarm";

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
  // 1. Calcular la próxima fecha a partir de la hora elegida
  const targetDate = new Date();
  targetDate.setHours(alarm.time.hour, alarm.time.minute, 0, 0);
  // Si la hora ya pasó hoy (ej: son las 15:00 y pusiste 07:30), se agenda para mañana
  if (targetDate.getTime() <= Date.now()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  // 2. Pasársela al sistema operativo
  await LocalNotifications.schedule({
    notifications: [
      {
        id: alarm.id, // Usás el mismo ID numérico de tu alarma
        title: alarm.name || '¡Alarma Sonando!',
        body: 'Elige una acción para apagarla:',
        schedule: { at: targetDate }, // 👈 Android se encarga de esperar esta fecha
        actionTypeId: 'ALARM_ACTIONS', // Los botones de Apagar y Aplazar
      },
    ],
  });
};

export const cancelAlarmNotification = async (alarmId: number) => {
  // Todo : CREAR LOGICA ENCARGADA DE ELIMIANR LAS ALARMAS
}