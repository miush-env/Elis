import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Plus, BellRing } from "lucide-react";
import { LocalNotifications } from "@capacitor/local-notifications";
import NavBar from "@/components/NavBar";
import { startMusic, stopMusic } from "@/services/sound/playerSound";
import { ALARM_CHANNEL_ID } from "@/services/notifications/alarmNotification";

type TimerMode = "IDLE" | "RUNNING" | "PAUSED" | "FINISHED";

const TIMER_NOTIFICATION_ID = 999999;
const STORAGE_KEY = "elis_timer_state_v1";

interface SavedTimerState {
  mode: TimerMode;
  totalDuration: number; // segundos totales
  endTime: number; // timestamp en ms
  remainingAtPause: number; // segundos que faltaban al pausar
}

export default function Timer() {
  // Configuración de tiempo (en IDLE)
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  // Estado del temporizador
  const [mode, setMode] = useState<TimerMode>("IDLE");
  const [totalDuration, setTotalDuration] = useState(300); // 5 min por defecto
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [endTime, setEndTime] = useState<number | null>(null);

  const timerIntervalRef = useRef<number | null>(null);

  // 1. Cargar estado guardado al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedTimerState = JSON.parse(saved);
        if (parsed.mode === "RUNNING") {
          const now = Date.now();
          if (now >= parsed.endTime) {
            // Ya terminó mientras la app estaba cerrada/en otra pantalla
            setMode("FINISHED");
            setRemainingSeconds(0);
            setTotalDuration(parsed.totalDuration);
            startMusic();
          } else {
            // Sigue corriendo
            const diff = Math.ceil((parsed.endTime - now) / 1000);
            setMode("RUNNING");
            setTotalDuration(parsed.totalDuration);
            setRemainingSeconds(diff);
            setEndTime(parsed.endTime);
          }
        } else if (parsed.mode === "PAUSED") {
          setMode("PAUSED");
          setTotalDuration(parsed.totalDuration);
          setRemainingSeconds(parsed.remainingAtPause);
        } else if (parsed.mode === "FINISHED") {
          setMode("FINISHED");
          setRemainingSeconds(0);
          setTotalDuration(parsed.totalDuration);
        }
      } catch (e) {
        console.error("Error al restaurar temporizador:", e);
      }
    }
  }, []);

  // 2. Guardar estado en localStorage cada vez que cambie
  useEffect(() => {
    if (mode === "IDLE") {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const stateToSave: SavedTimerState = {
      mode,
      totalDuration,
      endTime: endTime || 0,
      remainingAtPause: remainingSeconds,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [mode, totalDuration, endTime, remainingSeconds]);

  // 3. Intervalo de actualización en tiempo real cuando está RUNNING
  useEffect(() => {
    if (mode !== "RUNNING" || !endTime) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.ceil((endTime - now) / 1000);

      if (diff <= 0) {
        setRemainingSeconds(0);
        setMode("FINISHED");
        startMusic();
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } else {
        setRemainingSeconds(diff);
      }
    };

    updateTimer();
    timerIntervalRef.current = window.setInterval(updateTimer, 500);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [mode, endTime]);

  // Programar notificación local nativa para cuando termine el temporizador
  const scheduleNotification = async (targetTimestamp: number, durationSec: number) => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: TIMER_NOTIFICATION_ID }],
      });

      const formatted = formatTime(durationSec);
      await LocalNotifications.schedule({
        notifications: [
          {
            id: TIMER_NOTIFICATION_ID,
            title: "¡Temporizador Terminado!",
            body: `El temporizador de ${formatted} ha finalizado.`,
            schedule: {
              at: new Date(targetTimestamp),
              allowWhileIdle: true,
            },
            channelId: ALARM_CHANNEL_ID,
            autoCancel: true,
          },
        ],
      });
    } catch (e) {
      console.warn("No se pudo programar notificación de temporizador:", e);
    }
  };

  const cancelNotification = async () => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: TIMER_NOTIFICATION_ID }],
      });
    } catch (e) {
      console.warn("Error al cancelar notificación de temporizador:", e);
    }
  };

  // Acciones
  const handleStart = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total <= 0) return;

    const target = Date.now() + total * 1000;
    setTotalDuration(total);
    setRemainingSeconds(total);
    setEndTime(target);
    setMode("RUNNING");

    scheduleNotification(target, total);
  };

  const handlePause = () => {
    setMode("PAUSED");
    setEndTime(null);
    cancelNotification();
  };

  const handleResume = () => {
    const target = Date.now() + remainingSeconds * 1000;
    setEndTime(target);
    setMode("RUNNING");
    scheduleNotification(target, remainingSeconds);
  };

  const handleReset = () => {
    setMode("IDLE");
    setRemainingSeconds(totalDuration);
    setEndTime(null);
    cancelNotification();
    stopMusic();
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleStopFinished = () => {
    stopMusic();
    handleReset();
  };

  const handleAddMinute = () => {
    if (mode === "RUNNING" && endTime) {
      const newEndTime = endTime + 60 * 1000;
      const newTotal = totalDuration + 60;
      setEndTime(newEndTime);
      setTotalDuration(newTotal);
      setRemainingSeconds((prev) => prev + 60);
      scheduleNotification(newEndTime, newTotal);
    } else if (mode === "PAUSED") {
      setTotalDuration((prev) => prev + 60);
      setRemainingSeconds((prev) => prev + 60);
    }
  };

  // Quick presets en IDLE
  const handleSetPreset = (addMinutes: number) => {
    const currentTotal = hours * 3600 + minutes * 60 + seconds;
    const newTotal = currentTotal + addMinutes * 60;
    setHours(Math.floor(newTotal / 3600));
    setMinutes(Math.floor((newTotal % 3600) / 60));
    setSeconds(newTotal % 60);
  };

  // Formato HH:MM:SS
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Cálculo del progreso para el círculo SVG (0 a 1)
  const progress = totalDuration > 0 ? remainingSeconds / totalDuration : 0;
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between pb-24 px-6 pt-10 select-none">
      {/* Cabecera */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Temporizador</h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            {mode === "RUNNING"
              ? "Cuenta regresiva en curso"
              : mode === "PAUSED"
              ? "Temporizador en pausa"
              : mode === "FINISHED"
              ? "¡Tiempo completado!"
              : "Configura el tiempo a contar"}
          </p>
        </div>
      </header>

      {/* Contenido Principal según el modo */}
      <main className="flex-1 flex flex-col items-center justify-center">
        {mode === "IDLE" ? (
          /* Vista de Configuración de Tiempo */
          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Ruedas / Selectores de Horas, Minutos, Segundos */}
            <div className="flex items-center justify-center gap-3 bg-zinc-950/80 border border-zinc-800/80 rounded-3xl p-6 w-full shadow-2xl">
              {/* Horas */}
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Horas</span>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value) || 0)))}
                  className="w-16 h-16 bg-zinc-900 border border-zinc-700/60 rounded-2xl text-center text-3xl font-light text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <span className="text-2xl text-zinc-600 font-light mt-6">:</span>

              {/* Minutos */}
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Minutos</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                  className="w-16 h-16 bg-zinc-900 border border-zinc-700/60 rounded-2xl text-center text-3xl font-light text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <span className="text-2xl text-zinc-600 font-light mt-6">:</span>

              {/* Segundos */}
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-xs uppercase tracking-wider mb-2">Segundos</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value) || 0)))}
                  className="w-16 h-16 bg-zinc-900 border border-zinc-700/60 rounded-2xl text-center text-3xl font-light text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {[
                { label: "+1 min", val: 1 },
                { label: "+5 min", val: 5 },
                { label: "+10 min", val: 10 },
                { label: "+15 min", val: 15 },
                { label: "+30 min", val: 30 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSetPreset(preset.val)}
                  className="px-4 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 rounded-full text-xs font-medium text-zinc-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                }}
                className="px-4 py-2 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800/60 rounded-full text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Limpiar
              </button>
            </div>

            {/* Botón Iniciar */}
            <button
              type="button"
              onClick={handleStart}
              disabled={hours === 0 && minutes === 0 && seconds === 0}
              className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-medium text-lg rounded-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-98"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar</span>
            </button>
          </div>
        ) : (
          /* Vista de Cuenta Regresiva Activa / Pausada / Finalizada */
          <div className="flex flex-col items-center justify-center w-full">
            {/* Círculo de Progreso SVG */}
            <div className="relative w-72 h-72 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                {/* Pista de fondo */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-900 fill-none"
                />
                {/* Barra de progreso animada */}
                <circle
                  cx="144"
                  cy="144"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`fill-none transition-all duration-500 ${
                    mode === "FINISHED"
                      ? "text-red-500 animate-pulse"
                      : mode === "PAUSED"
                      ? "text-amber-400"
                      : "text-white"
                  }`}
                />
              </svg>

              {/* Información central */}
              <div className="absolute flex flex-col items-center">
                {mode === "FINISHED" ? (
                  <div className="flex flex-col items-center animate-bounce">
                    <BellRing className="w-12 h-12 text-red-400 mb-2" />
                    <span className="text-xl font-medium text-red-400">¡Tiempo!</span>
                  </div>
                ) : (
                  <>
                    <span
                      className={`text-5xl font-light tracking-tighter tabular-nums ${
                        mode === "PAUSED" ? "text-zinc-400 animate-pulse" : "text-white"
                      }`}
                    >
                      {formatTime(remainingSeconds)}
                    </span>
                    {endTime && mode === "RUNNING" && (
                      <span className="text-xs text-zinc-500 mt-2">
                        Fin: {new Date(endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Controles de Acción */}
            <div className="flex items-center gap-4 mt-10">
              {mode === "FINISHED" ? (
                <button
                  type="button"
                  onClick={handleStopFinished}
                  className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-medium text-lg rounded-full flex items-center gap-2 shadow-xl shadow-red-900/40 active:scale-95 transition-all"
                >
                  <span>Detener</span>
                </button>
              ) : (
                <>
                  {/* Botón Cancelar */}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95"
                    title="Cancelar temporizador"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>

                  {/* Botón Pausa / Reanudar */}
                  {mode === "RUNNING" ? (
                    <button
                      type="button"
                      onClick={handlePause}
                      className="w-20 h-20 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      title="Pausar"
                    >
                      <Pause className="w-8 h-8 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResume}
                      className="w-20 h-20 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                      title="Reanudar"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                  )}

                  {/* Botón +1 min */}
                  <button
                    type="button"
                    onClick={handleAddMinute}
                    className="w-16 h-16 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white text-xs font-semibold transition-colors active:scale-95"
                    title="Sumar 1 minuto"
                  >
                    <div className="flex flex-col items-center">
                      <Plus className="w-4 h-4 mb-0.5" />
                      <span>1m</span>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Barra de Navegación Fija */}
      <NavBar />
    </div>
  );
}
