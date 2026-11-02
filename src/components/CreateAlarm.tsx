import { Input } from "@/components/ui/input";
import { scheduleAlarmNotification } from "@/services/notifications/alarmNotification";
import { createAlarm } from "@/services/storage/alarmStorage";

function CreateAlarm({ onAlarmCreated }: { onAlarmCreated: () => void }) {
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
    }

    await createAlarm(newAlarm);
    await scheduleAlarmNotification(newAlarm);

    onAlarmCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="time" name="timeAlarm" id="timeAlarm" />
      <Input type="text" name="alarmName" id="alarmName" />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Guardar
      </button>
    </form>
  );
}

export default CreateAlarm;
