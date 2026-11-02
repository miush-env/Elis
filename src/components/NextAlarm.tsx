// import { startMusic, stopMusic } from "@services/sound/playerSound";

function NextAlarm() {
  // Todo : Aqui se hara una peticion de tipo GET para obtener la alarma mas cercana
  const nextAlarmHour = "07:30";
  return (
    <header>
      <h1>Alarma programada a las {nextAlarmHour}</h1>
    </header>
  );
}

export default NextAlarm;
