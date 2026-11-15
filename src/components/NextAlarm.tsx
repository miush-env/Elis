import type { Alarm } from "@/types/alarm";

function NextAlarm({ alarms }: { alarms: Alarm[] }) {
  const enabledAlarms = alarms.filter((alarm) => alarm.isEnable);
  const nextAlarmHour = "07:36";
  
  return (
    <>
      <section className="flex justify-between items-center h-16">
        <div>
          <h1 className="text-xl text-white font-outfit font-bold max-w-60 ">
            {enabledAlarms.length === 0 ? "Sin alarmas" : (<>Alarma programada <br />a las {nextAlarmHour}</>)}
          </h1>
          <span className="text-gray-400 text-sm">mar, 3 nov 07:30</span>
        </div>
      </section>
    </>
  );
}

export default NextAlarm;
