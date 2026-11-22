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
        <ScrollArea className="h-[80vh] scroll-fade-x w-full px-4 pb-9 [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-80px),transparent)]">
          <ul className="space-y-4">
            {
              [...alarms].sort((a, b) => (a.time.hour * 60 + a.time.minute) - (b.time.hour * 60 + b.time.minute) ).map((alarm) => (<AlarmCard alarm={alarm} onAlarmDeleted={onAlarmDeleted} />))}
          </ul>
          <ScrollBar />
        </ScrollArea>
      )}
    </>
  );
}

export default ListAlarm;
