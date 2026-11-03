import { Input } from "@/components/ui/input";
import { scheduleAlarmNotification } from "@/services/notifications/alarmNotification";
import { createAlarm } from "@/services/storage/alarmStorage";

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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const timeAlarm = formData.get("timeAlarm"); // Obtiene el valor usando el 'name' del input'
    const alarmName = formData.get("alarmName");

    if (!timeAlarm || typeof timeAlarm !== "string") return;

    const [hour, minutes] = timeAlarm.split(":");
    console.log(hour, " y ", minutes);

    const newAlarm = {
      id: Math.floor(Date.now() % 2147483647),
      name: alarmName as string,
      time: {
        hour: parseInt(hour),
        minute: parseInt(minutes),
      },
      days: ["L", "X", "S"], // Inicialmente vacío, se puede actualizar más tarde
      isEnable: true,
    };

    await createAlarm(newAlarm);
    await scheduleAlarmNotification(newAlarm);

    onAlarmCreated();
  };

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
            <Input type="time" name="timeAlarm" id="timeAlarm" required />
            <Input
              type="text"
              name="alarmName"
              id="alarmName"
              required
              placeholder="Nombre de la alarma"
            />
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button type="submit" size={"lg"} onClick={() => setIsOpen(false)}>
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
