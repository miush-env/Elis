import { Input } from "@/components/ui/input";
import { scheduleAlarmNotification } from "@/services/notifications/alarmNotification";
import { createAlarm } from "@/services/storage/alarmStorage";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@components/ui/button";

function CreateAlarm({
  onAlarmCreated,
  isOpen,
  setIsOpen,
}: {
  onAlarmCreated: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "L",
    "M",
    "X",
    "J",
    "V",
  ]);
  const DAYS = ["L", "M", "X", "J", "V", "S", "D"];
  const [timeAlarm, setTimeAlarm] = useState("");
  const [alarmName, setAlarmName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const timeAlarm = formData.get("timeAlarm");
    const alarmName = formData.get("alarmName");
    

    if (!timeAlarm || typeof timeAlarm !== "string") return;

    const [hour, minutes] = timeAlarm.split(":");

    const newAlarm = {
      id: Math.floor(Date.now() % 2147483647),
      name: alarmName as string,
      time: {
        hour: parseInt(hour),
        minute: parseInt(minutes),
      },
      days: selectedDays,
      isEnable: true,
    };

    await createAlarm(newAlarm);
    await scheduleAlarmNotification(newAlarm);

    onAlarmCreated();
  };

  const isFormValid = timeAlarm.trim() !== "" && alarmName.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva Alarma</DialogTitle>
            <DialogDescription>
              configura la hora de tu alarma
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              type="time"
              name="timeAlarm"
              id="timeAlarm"
              required
              value={timeAlarm}
              onChange={(e) => setTimeAlarm(e.target.value)}
            />
            <Input
              type="text"
              name="alarmName"
              id="alarmName"
              required
              placeholder="Nombre de la alarma"
              value={alarmName}
              onChange={(e) => setAlarmName(e.target.value)}
            />
            <div className="flex flex-col gap-2 my-2">
              <span className="text-xs text-zinc-400">Repetir los días:</span>

              <ToggleGroup
                multiple
                value={selectedDays}
                onValueChange={setSelectedDays}
                className="flex justify-between w-full"
              >
                {DAYS.map((day) => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    className="w-10 h-10 rounded-full font-semibold text-xs data-[state=on]:bg-white data-[state=on]:text-black"
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button type="submit" size={"lg"} disabled={!isFormValid}>
              Guardar
            </Button>

            <Button
              size={"lg"}
              variant={"destructive"}
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateAlarm;
