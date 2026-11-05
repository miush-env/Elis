import { useEffect, useState } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { startMusic, stopMusic } from "./services/sound/playerSound";
import { setupNotifications } from "./services/notifications/alarmNotification";
import NextAlarm from "@components/NextAlarm";
import ListAlarm from "@components/ListAlarm";
import CreateAlarm from "@components/CreateAlarm";
import { getAlarms } from "@/services/storage/alarmStorage";
import type { Alarm } from "@/types/alarm";
import { Button } from "@components/ui/button";
import { Plus, EllipsisVertical } from "lucide-react";

function App() {
  // const [alarmTime] = useState<string>("07:30");
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <main className="w-full h-screen flex flex-col gap-10">
      <header className="flex justify-between items-center h-16 mt-5 px-4">
        <NextAlarm />

        <div className="flex gap-2 h-full">
          <Button size={"lg"} onClick={() => setIsOpen(!isOpen)}>
            <Plus />
          </Button>
          <Button size={"lg"}>
            <EllipsisVertical />
          </Button>
        </div>
      </header>

      <ListAlarm alarms={alarms} onAlarmDeleted={refreshAlarms} />

      <CreateAlarm
        onAlarmCreated={refreshAlarms}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </main>
  );
}

export default App;
