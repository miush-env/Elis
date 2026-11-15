import type { Alarm } from "@/types/alarm";
import { getNextOccurrence } from "@/services/notifications/getNextOccurrence";
import { useState, useEffect } from "react";

function NextAlarm({ alarms }: { alarms: Alarm[] }) {
  const enabledAlarms = alarms.filter((alarm) => alarm.isEnable);
  const nextAlarm = getNextOccurrence({ alarms: enabledAlarms });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // Al cambiar el estado, React re-renderiza el texto
    }, 60000); // 60 segundos

    return () => clearInterval(interval); // Limpieza cuando se desmonta
  }, []);

  if (!nextAlarm) {
    return (
      <section className="flex justify-between items-center h-16">
        <div>
          <h1 className="text-xl text-white font-outfit font-bold">
            Sin alarmas
          </h1>
          <span className="text-gray-400 text-sm">
            No hay alarmas activadas
          </span>
        </div>
      </section>
    );
  }

  const diffMs = nextAlarm.getTime() - now.getTime();
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let remainingText = "";
  if (hours > 0) {
    remainingText = `${hours} h y ${minutes} min`;
  } else {
    remainingText = `${minutes} min`;
  }

  const hour = String(nextAlarm.getHours()).padStart(2, "0");
  const minute = String(nextAlarm.getMinutes()).padStart(2, "0");
  const formattedTime = `${hour}:${minute}`;

  const formattedDate = `${nextAlarm.toLocaleDateString("es-ES", {
    weekday: "short",
  })} ${formattedTime}`;

  return (
    <>
      <section className="flex justify-between items-center h-16">
        <div>
          <h1 className="text-xl text-white font-outfit font-bold max-w-60 ">
            {enabledAlarms.length === 0 ? (
              "Sin alarmas"
            ) : (
              <>
                Proxima Alarma <br /> en {remainingText}
              </>
            )}
          </h1>
          <span className="text-gray-400 text-sm">{formattedDate}</span>
        </div>
      </section>
    </>
  );
}

export default NextAlarm;
