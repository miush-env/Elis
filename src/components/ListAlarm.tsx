import type { Alarm } from "@/types/alarm";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteAlarm } from "@/services/storage/alarmStorage";
import { cancelAlarmNotification } from "@/services/notifications/alarmNotification";
import { useState } from "react";

function ListAlarm({
  alarms,
  onAlarmDeleted,
}: {
  alarms: Alarm[];
  onAlarmDeleted: () => void;
}) {
  // Guardamos el id de la alarma cuyo popover está abierto (o null si ninguno)
  const [openAlarmId, setOpenAlarmId] = useState<number | null>(null);

  const handleDeleteAlarm = async (id: number) => {
    // 1. Cerramos el popover de inmediato para evitar que quede flotando en (0,0)
    setOpenAlarmId(null);

    // 2. Borramos del almacenamiento y cancelamos en Android
    await deleteAlarm(id);
    await cancelAlarmNotification(id);

    // 3. Avisamos al padre para que refresque la lista
    onAlarmDeleted();
  };

  return (
    <>
      {alarms.length === 0 ? (
        <p className="text-center text-gray-500">No hay alarmas programadas.</p>
      ) : (
        <ScrollArea className="h-[83vh] w-full px-4">
          <ul className="space-y-4">
            {alarms.map((alarm) => (
              <li key={alarm.id}>
                <Popover
                  open={openAlarmId === alarm.id}
                  onOpenChange={(isOpen) =>
                    setOpenAlarmId(isOpen ? alarm.id : null)
                  }
                >
                  <PopoverTrigger className="w-full alarm-card bg-[#18181A] hover:bg-[#1E1E22] rounded-[24px] px-6 py-4 flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] text-white text-left">
                    <div className="flex flex-col">
                      <span className="text-[40px] font-light tracking-tight leading-none font-display text-white">
                        {alarm.time.hour < 10
                          ? `0${alarm.time.hour}`
                          : alarm.time.hour}
                        :
                        {alarm.time.minute < 10
                          ? `0${alarm.time.minute}`
                          : alarm.time.minute}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white">
                      <span className="relative flex flex-col items-center">
                        {/* <span className="w-1 h-1 rounded-full mb-0.5 active-dot bg-white"></span> */}
                        <div className="flex items-center gap-1">
                          {alarm.days.map((day, index) => (
                            <span key={index} className="text-[10px]">
                              {day}
                            </span>
                          ))}
                        </div>
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch className="data-checked:bg-green-600 data-unchecked:bg-red-700" />
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="bg-black border border-gray-800"
                  >
                    <Button
                      size="lg"
                      variant="destructive"
                      className="border border-red-800"
                      onClick={() => handleDeleteAlarm(alarm.id)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setOpenAlarmId(null)}
                    >
                      Cancelar
                    </Button>
                  </PopoverContent>
                </Popover>
              </li>
            ))}
          </ul>
          <ScrollBar />
        </ScrollArea>
      )}
    </>
  );
}

export default ListAlarm;
