import { useState, useRef, useEffect, useMemo } from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, Flag } from "lucide-react";

export interface Lap {
  id: number;
  lapTime: number;
  overallTime: number;
}

const STORAGE_KEY = "aura_stopwatch_state_v1";

interface SavedStopwatchState {
  isRunning: boolean;
  startTime: number;
  accumulatedTime: number;
  laps: Lap[];
}

export default function Stopwatch() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // 1. Cargar estado guardado al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedStopwatchState = JSON.parse(saved);
        accumulatedTimeRef.current = parsed.accumulatedTime || 0;
        setLaps(parsed.laps || []);

        if (parsed.isRunning) {
          const now = Date.now();
          startTimeRef.current = parsed.startTime;
          const currentElapsed = parsed.accumulatedTime + (now - parsed.startTime);
          setTime(currentElapsed);
          setIsRunning(true);

          timerRef.current = window.setInterval(() => {
            const tickNow = Date.now();
            setTime(accumulatedTimeRef.current + (tickNow - startTimeRef.current));
          }, 16);
        } else {
          setTime(parsed.accumulatedTime || 0);
          setIsRunning(false);
        }
      } catch (e) {
        console.error("Error al restaurar cronómetro:", e);
      }
    }
  }, []);

  // 2. Guardar estado en localStorage
  useEffect(() => {
    if (time === 0 && !isRunning && laps.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const stateToSave: SavedStopwatchState = {
      isRunning,
      startTime: startTimeRef.current,
      accumulatedTime: accumulatedTimeRef.current,
      laps,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [isRunning, time, laps]);

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Acciones
  const handleStart = () => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      setTime(accumulatedTimeRef.current + (now - startTimeRef.current));
    }, 16);
  };

  const handlePause = () => {
    if (!isRunning) return;
    setIsRunning(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    accumulatedTimeRef.current += Date.now() - startTimeRef.current;
    setTime(accumulatedTimeRef.current);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setTime(0);
    setLaps([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const currentTotal = accumulatedTimeRef.current + (Date.now() - startTimeRef.current);

    const lastLapOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const currentLapTime = currentTotal - lastLapOverall;

    const newLap: Lap = {
      id: laps.length + 1,
      lapTime: currentLapTime,
      overallTime: currentTotal,
    };

    setLaps((prev) => [newLap, ...prev]);
  };

  // Formato MM:SS.cs o HH:MM:SS.cs
  const formatTimeParts = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => String(n).padStart(2, "0");

    return {
      hours: hours > 0 ? pad(hours) : null,
      minutes: pad(minutes),
      seconds: pad(seconds),
      centiseconds: pad(centiseconds),
    };
  };

  const formattedTime = formatTimeParts(time);

  // Mejor y peor vuelta para colorearlas
  const { minLapId, maxLapId } = useMemo(() => {
    if (laps.length < 2) return { minLapId: null, maxLapId: null };
    let min = laps[0];
    let max = laps[0];
    for (const lap of laps) {
      if (lap.lapTime < min.lapTime) min = lap;
      if (lap.lapTime > max.lapTime) max = lap;
    }
    return { minLapId: min.id, maxLapId: max.id };
  }, [laps]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between pb-24 px-6 pt-10 select-none">
      {/* Cabecera */}
      <header className="mb-4">
        <h1 className="text-3xl font-light tracking-tight">Cronómetro</h1>
        <p className="text-zinc-500 text-sm mt-0.5">
          {isRunning ? "Midiendo tiempo..." : time > 0 ? "En pausa" : "Listo para iniciar"}
        </p>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col items-center justify-between py-4 gap-6">
        {/* Tarjeta Visual de Tiempo Principal (shadcn Card) */}
        <Card className="w-full bg-zinc-950/60 border-zinc-900 rounded-3xl py-10 flex flex-col items-center justify-center shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <div className="flex items-baseline font-light tracking-tight tabular-nums">
              {formattedTime.hours && (
                <>
                  <span className="text-5xl md:text-6xl text-white">{formattedTime.hours}</span>
                  <span className="text-3xl text-zinc-600 mx-1">:</span>
                </>
              )}
              <span className="text-6xl md:text-7xl text-white">{formattedTime.minutes}</span>
              <span className="text-4xl text-zinc-600 mx-1">:</span>
              <span className="text-6xl md:text-7xl text-white">{formattedTime.seconds}</span>
              <span className="text-2xl md:text-3xl text-zinc-500 ml-1.5 font-normal">
                .{formattedTime.centiseconds}
              </span>
            </div>

            {/* Vuelta actual en curso si hay vueltas registradas */}
            {laps.length > 0 && isRunning && (
              <p className="text-zinc-500 text-xs mt-3 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-zinc-400" />
                <span>
                  Vuelta {String(laps.length + 1).padStart(2, "0")}:{" "}
                  {(() => {
                    const currentLapDiff = time - laps[0].overallTime;
                    const p = formatTimeParts(currentLapDiff);
                    return `${p.minutes}:${p.seconds}.${p.centiseconds}`;
                  })()}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Botones de Control (shadcn Button) */}
        <div className="flex items-center justify-center gap-6 w-full max-w-xs">
          {/* Botón Izquierdo: Vuelta o Reiniciar */}
          {isRunning ? (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleLap}
              className="h-16 w-16 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 shadow-md active:scale-95 transition-all p-0"
              title="Marcar vuelta"
            >
              <Flag className="w-6 h-6" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={time === 0}
              className="h-16 w-16 rounded-full bg-zinc-900/40 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-md active:scale-95 transition-all p-0"
              title="Reiniciar"
            >
              <RotateCcw className="w-6 h-6" />
            </Button>
          )}

          {/* Botón Central: Iniciar o Pausar */}
          {isRunning ? (
            <Button
              type="button"
              variant="destructive"
              size="lg"
              onClick={handlePause}
              className="h-20 w-20 rounded-full bg-red-600/90 hover:bg-red-600 text-white shadow-xl shadow-red-950/40 active:scale-95 transition-all p-0"
              title="Pausar"
            >
              <Pause className="w-8 h-8 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="default"
              size="lg"
              onClick={handleStart}
              className="h-20 w-20 rounded-full bg-white hover:bg-zinc-200 text-black shadow-xl active:scale-95 transition-all p-0"
              title={time > 0 ? "Reanudar" : "Iniciar"}
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </Button>
          )}
        </div>

        {/* Lista de Vueltas (shadcn ScrollArea + Table) */}
        <div className="w-full flex-1 max-h-60 mt-2">
          {laps.length > 0 ? (
            <ScrollArea className="h-60 w-full rounded-2xl border border-zinc-900 bg-zinc-950/40 px-3 py-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-900 hover:bg-transparent">
                    <TableHead className="text-zinc-500 text-xs uppercase font-medium w-24">Vuelta</TableHead>
                    <TableHead className="text-zinc-500 text-xs uppercase font-medium text-center">Tiempo</TableHead>
                    <TableHead className="text-zinc-500 text-xs uppercase font-medium text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laps.map((lap) => {
                    const isBest = lap.id === minLapId;
                    const isWorst = lap.id === maxLapId;
                    const lapFormatted = formatTimeParts(lap.lapTime);
                    const overallFormatted = formatTimeParts(lap.overallTime);

                    return (
                      <TableRow
                        key={lap.id}
                        className={`border-zinc-900/60 transition-colors ${
                          isBest
                            ? "text-emerald-400 bg-emerald-950/10 hover:bg-emerald-950/20"
                            : isWorst
                            ? "text-red-400 bg-red-950/10 hover:bg-red-950/20"
                            : "text-zinc-300 hover:bg-zinc-900/30"
                        }`}
                      >
                        <TableCell className="font-medium text-sm py-2.5">
                          Vuelta {String(lap.id).padStart(2, "0")}
                        </TableCell>
                        <TableCell className="text-center tabular-nums text-sm py-2.5 font-light">
                          {lapFormatted.minutes}:{lapFormatted.seconds}.{lapFormatted.centiseconds}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm py-2.5 text-zinc-500">
                          {overallFormatted.minutes}:{overallFormatted.seconds}.{overallFormatted.centiseconds}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-xs py-8">
              <p>Presioná Iniciar y luego el botón de Vuelta para registrar parciales.</p>
            </div>
          )}
        </div>
      </main>

      {/* Barra de Navegación Fija */}
      <NavBar />
    </div>
  );
}
