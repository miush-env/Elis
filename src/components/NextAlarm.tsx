// import { startMusic, stopMusic } from "@services/sound/playerSound";
import { Button } from "@components/ui/button";
import { Plus, EllipsisVertical } from "lucide-react";

function NextAlarm() {
  // Todo : Aqui se hara una peticion de tipo GET para obtener la alarma mas cercana
  const nextAlarmHour = "07:36";
  return (
    <header className="flex justify-between items-center h-16 mt-5 px-5">
      <div>
        <h1 className="text-xl text-white font-outfit font-bold max-w-60 ">
          Alarma programada <br />a las {nextAlarmHour}
        </h1>
        <span className="text-gray-400 text-sm">mar, 3 nov 07:30</span>
      </div>

      <div className="flex gap-2 h-full">
        <Button size={"lg"}>
          <Plus />
        </Button>
        <Button size={"lg"}>
          <EllipsisVertical />
        </Button>
      </div>
    </header>
  );
}

export default NextAlarm;
