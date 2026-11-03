function NextAlarm() {
  // Todo : Aqui se hara una peticion de tipo GET para obtener la alarma mas cercana
  const nextAlarmHour = "07:36";
  return (
    <>
      <section className="flex justify-between items-center h-16">
        <div>
          <h1 className="text-xl text-white font-outfit font-bold max-w-60 ">
            Alarma programada <br />a las {nextAlarmHour}
          </h1>
          <span className="text-gray-400 text-sm">mar, 3 nov 07:30</span>
        </div>

      </section>
    </>
  );
}

export default NextAlarm;
