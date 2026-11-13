import type { Alarm } from "@/types/alarm";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import AlarmCard  from "@components/Alarm/AlarmCard";

function ListAlarm({
  alarms,
  onAlarmDeleted,
}: {
  alarms: Alarm[];
  onAlarmDeleted: () => void;
}) {

  return (
    <>
      {alarms.length === 0 ? (
        <p className="text-center text-gray-500">No hay alarmas programadas.</p>
      ) : (
        <ScrollArea className="h-[83vh] w-full px-4">
          <ul className="space-y-4">
            {alarms.map((alarm) => (<AlarmCard alarm={alarm} onAlarmDeleted={onAlarmDeleted} />))}
          </ul>
          <ScrollBar />
        </ScrollArea>
      )}
    </>
  );
}

export default ListAlarm;
