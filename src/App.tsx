import { useEffect, useState } from "react";
import NextAlarm from "@components/NextAlarm";
import ListAlarm from "@components/ListAlarm";
import CreateAlarm from "@components/CreateAlarm";
import { getAlarms } from "@/services/storage/alarmStorage";
import type { Alarm } from "@/types/alarm";
import { Button } from "@components/ui/button";
import { Plus, EllipsisVertical } from "lucide-react";
import NavBar from "@components/NavBar";

function App() {
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

  return (
    <main className="w-full h-screen flex flex-col gap-10">
      <header className="flex justify-between items-center h-16 mt-5 px-4">
        <NextAlarm alarms={alarms} />

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

      <NavBar />
    </main>
  );
}

export default App;
