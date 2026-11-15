import type { Alarm } from "@/types/alarm";

export function getNextOccurrence({ alarms }: { alarms: Alarm[] }) {
  const now = new Date();
  const DAY_TO_WEEKDAY: Record<string, number> = {
    D: 0, // Domingo
    L: 1, // Lunes
    M: 2, // Martes
    X: 3, // Miércoles
    J: 4, // Jueves
    V: 5, // Viernes
    S: 6, // Sábado
  };

  const candidateDates = alarms.flatMap((alarm) => {
    if (alarm.days.length === 0) {
      const target = new Date(now);
      target.setHours(alarm.time.hour, alarm.time.minute, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }
      return [target];
    }

    return alarm.days.map((day) => {
      const weekDay = DAY_TO_WEEKDAY[day];
      let daysRemaining = weekDay - now.getDay();
      const proposedDate = new Date(now);
      proposedDate.setHours(alarm.time.hour, alarm.time.minute, 0, 0);

      if (daysRemaining < 0) {
        daysRemaining += 7;
      } else if (daysRemaining === 0 && proposedDate.getTime() <= now.getTime()) {
        daysRemaining = 7;
      }

      proposedDate.setDate(proposedDate.getDate() + daysRemaining);
      return proposedDate;
    });
  });

  return candidateDates.reduce<Date | undefined>(
    (earliest, date) => (!earliest || date < earliest ? date : earliest),
    undefined,
  );
}
