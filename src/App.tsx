import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { startMusic, stopMusic } from "./services/sound/playerSound";
import { setupNotifications } from "./services/notifications/alarmNotification";
import NextAlarm from "@components/NextAlarm";
import ListAlarm from "@components/ListAlarm";
import CreateAlarm from "@components/CreateAlarm";
import { getAlarms } from "@/services/storage/alarmStorage";
import type { Alarm } from "@/types/alarm";

function App() {
  // const [alarmTime] = useState<string>("07:30");
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const refreshAlarms = async () => {
    const data = await getAlarms();
    setAlarms(data);
  };
  // Cargar al inicio
  useEffect(() => {
    refreshAlarms();
  }, []);

  // permisos y listeners de notificaciones
  useEffect(() => {
    setupNotifications();

    const receivedListener = LocalNotifications.addListener(
      "localNotificationReceived",
      async () => {
        await startMusic();
      },
    );

    // Solo se apaga si toca "Apagar" o "Aplazar"
    const actionListener = LocalNotifications.addListener(
      "localNotificationActionPerformed",
      async (action) => {
        if (action.actionId === "DISMISS_ACTION") {
          await stopMusic();
          alert("Alarma apagada.");
        } else if (action.actionId === "SNOOZE_ACTION") {
          await stopMusic();
          // Reprogramar para dentro de 5 minutos
          const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
          await LocalNotifications.schedule({
            notifications: [
              {
                id: Number(action.notification.id) || 1,
                title: "¡Alarma Aplazada!",
                body: "Toca Apagar o Aplazar para detener el sonido.",
                schedule: { at: snoozeDate },
                actionTypeId: "ALARM_ACTIONS",
              },
            ],
          });
          alert("Alarma aplazada 5 minutos.");
        } else {
          console.log(
            "Se tocó la notificación pero no los botones. La música sigue sonando.",
          );
        }
      },
    );

    return () => {
      receivedListener.then((sub) => sub.remove());
      actionListener.then((sub) => sub.remove());
      stopMusic();
    };
  }, []);

  // Calcular la próxima fecha a partir del string HH:mm
  // const getAlarmDate = (timeStr: string): Date => {
  //   const [hours, minutes] = timeStr.split(":").mwap(Number);
  //   const date = new Date();
  //   date.setHours(hours, minutes, 0, 0);

  // Si la hora ya pasó hoy, se agenda para mañana
  //   if (date.getTime() <= Date.now()) {
  //     date.setDate(date.getDate() + 1);
  //   }
  //   return date;
  // };

  // // Programar la alarma a la hora seleccionada con los botones Apagar y Aplazar
  // const scheduleAlarm = async () => {
  //   const targetDate = getAlarmDate(alarmTime);

  //   await LocalNotifications.schedule({
  //     notifications: [
  //       {
  //         id: 1,
  //         title: "¡Alarma Sonando!",
  //         body: "Elige una acción para apagarla:",
  //         schedule: { at: targetDate },
  //         actionTypeId: "ALARM_ACTIONS",
  //       },
  //     ],
  //   });

  //   alert(
  //     `Alarma configurada para las ${alarmTime} (${targetDate.toLocaleDateString()})`,
  //   );
  // };

  // // Prueba inmediata en 5 segundos con los botones Apagar y Aplazar
  // const testAlarmIn5Seconds = async () => {
  //   await LocalNotifications.schedule({
  //     notifications: [
  //       {
  //         id: 2,
  //         title: "¡Prueba de Alarma!",
  //         body: "Elige Apagar o Aplazar para detener la música:",
  //         schedule: { at: new Date(Date.now() + 5000) },
  //         actionTypeId: "ALARM_ACTIONS",
  //       },
  //     ],
  //   });
  //   alert(
  //     "Notificación programada para dentro de 5 segundos. Espera a que llegue...",
  //   );
  // };

  return (
    <main className="w-full h-screen">
      <NextAlarm />
      {/* <ListAlarm alarms={alarms} /> */}
      {/* <CreateAlarm onAlarmCreated={refreshAlarms} /> */}
    </main>
  );
}

export default App;
