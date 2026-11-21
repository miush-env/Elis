import { useEffect, useState, useRef } from "react";
import NavBar from "@components/NavBar";
import { getDeviceLocation } from "@/services/location/getDeviceLocation";
import { Preferences } from "@capacitor/preferences";
import {
  MapPin,
  WifiOff,
  RefreshCw,
  Droplets,
  Thermometer,
  Search,
  X,
  Navigation,
} from "lucide-react";

interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

interface SearchCityResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

const API_KEY =
  import.meta.env.VITE_WEATHER_API_KEY || "2e303588aa8740bdb78230803262011";
const STORAGE_KEY = "aura_saved_weather_city";

const formatDayName = (dateStr: string, index: number) => {
  if (index === 0) return "Hoy";
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
};

function Climate() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados del Buscador
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchCityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isManualCity, setIsManualCity] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Obtener pronóstico por query (coordenadas "lat,lon" o nombre "Hurlingham")
  const fetchWeather = async (queryLocation: string): Promise<WeatherAPIResponse> => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      queryLocation
    )}&days=7&lang=es`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("No se pudo obtener el pronóstico de WeatherAPI.");
    }
    return res.json();
  };

  // Cargar datos (prioriza ciudad guardada, o GPS)
  const loadData = async (forceGPS = false) => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }
    setIsOnline(true);
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Si no forzamos GPS, revisar si el usuario ya guardó una ciudad manual
      if (!forceGPS) {
        const saved = await Preferences.get({ key: STORAGE_KEY });
        if (saved.value) {
          setIsManualCity(true);
          const data = await fetchWeather(saved.value);
          setWeather(data);
          setLoading(false);
          return;
        }
      }

      // 2. Si no hay guardada o tocó el botón de GPS:
      setIsManualCity(false);
      await Preferences.remove({ key: STORAGE_KEY });
      const deviceCoords = await getDeviceLocation();
      const coordsQuery = `${deviceCoords.latitude},${deviceCoords.longitude}`;
      const data = await fetchWeather(coordsQuery);
      setWeather(data);
    } catch (err: any) {
      console.error("Error al cargar clima:", err);
      setErrorMsg(err.message || "Ocurrió un error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Buscar ciudades en WeatherAPI al tipear
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(
          query.trim()
        )}`;
        const res = await fetch(url);
        if (res.ok) {
          const data: SearchCityResult[] = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Error buscando ciudad:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Seleccionar una ciudad de la lista
  const handleSelectCity = async (city: SearchCityResult) => {
    setIsSearchOpen(false);
    setQuery("");
    setResults([]);
    setLoading(true);

    try {
      // Guardar con id exacto de WeatherAPI para que no redondee a Capital Federal
      const cityQuery = `id:${city.id}`;
      await Preferences.set({ key: STORAGE_KEY, value: cityQuery });
      setIsManualCity(true);

      const data = await fetchWeather(cityQuery);
      setWeather(data);
    } catch (err: any) {
      console.error("Error al cargar ciudad seleccionada:", err);
      setErrorMsg(err.message || "Error al cargar la ciudad elegida.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      void loadData();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    void loadData();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Al abrir el buscador, hacer foco en el input
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const todayForecast = weather?.forecast?.forecastday?.[0];
  const currentIconUrl = weather?.current?.condition?.icon
    ? weather.current.condition.icon.startsWith("http")
      ? weather.current.condition.icon
      : `https:${weather.current.condition.icon}`
    : null;

  return (
    <main className="w-full min-h-screen bg-[#09090b] text-white flex flex-col px-5 pt-6 pb-28">
      {/* Encabezado */}
      <header className="flex justify-between items-start mb-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-left group active:opacity-75 transition-opacity"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight group-hover:text-zinc-200">
              {weather ? weather.location.name : "Pronóstico"}
            </h1>
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-white" />
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate max-w-[200px]">
              {weather
                ? `${weather.location.region ? `${weather.location.region}, ` : ""}${weather.location.country}`
                : "Buscando ubicación..."}
            </span>
            {isManualCity && (
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-medium ml-1">
                Fijada
              </span>
            )}
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* Botón GPS para volver a ubicación automática si estaba fija */}
          {isManualCity && (
            <button
              onClick={() => loadData(true)}
              title="Usar mi ubicación actual (GPS)"
              className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
            </button>
          )}

          {/* Botón de recarga */}
          <button
            onClick={() => loadData(false)}
            disabled={loading}
            aria-label="Actualizar clima"
            className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Buscador Desplegable */}
      {isSearchOpen && (
        <section className="mb-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 shadow-2xl animate-in fade-in-50 duration-200">
          <div className="flex items-center gap-2 bg-zinc-800/80 rounded-xl px-3 py-2 border border-zinc-700/60">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribí una ciudad (ej. Hurlingham)..."
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs text-zinc-400 hover:text-white font-medium pl-1"
            >
              Cerrar
            </button>
          </div>

          {/* Estado de búsqueda */}
          {isSearching && (
            <div className="text-xs text-zinc-400 text-center py-3">Buscando ciudades...</div>
          )}

          {/* Lista de Resultados */}
          {!isSearching && results.length > 0 && (
            <ul className="mt-2 divide-y divide-zinc-800/80 max-h-56 overflow-y-auto">
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleSelectCity(city)}
                    className="w-full text-left py-2.5 px-2 hover:bg-zinc-800/60 rounded-lg flex flex-col transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">{city.name}</span>
                    <span className="text-xs text-zinc-400">
                      {city.region ? `${city.region}, ` : ""}
                      {city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Sin resultados */}
          {!isSearching && query.trim().length >= 2 && results.length === 0 && (
            <div className="text-xs text-zinc-500 text-center py-3">
              No se encontraron ciudades con ese nombre.
            </div>
          )}

          {/* Botón rápido para usar GPS desde el buscador */}
          <div className="mt-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                void loadData(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800/60 rounded-lg"
            >
              <Navigation className="w-3.5 h-3.5" />
              Usar mi ubicación actual por GPS
            </button>
          </div>
        </section>
      )}

      {/* Caso 1: Sin conexión a internet */}
      {!isOnline && (
        <section className="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center text-center my-auto">
          <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mb-3">
            <WifiOff className="w-6 h-6 text-zinc-400" />
          </div>
          <h2 className="text-lg font-semibold">Sin conexión a internet</h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-xs">
            Verificá tu conexión a Wi-Fi o datos móviles para poder ver el pronóstico meteorológico.
          </p>
          <button
            onClick={() => loadData(false)}
            className="mt-4 px-4 py-2 bg-white text-black text-sm font-medium rounded-xl active:scale-95 transition-transform"
          >
            Reintentar
          </button>
        </section>
      )}

      {/* Caso 2: Cargando */}
      {isOnline && loading && (
        <section className="flex flex-col items-center justify-center my-auto py-16 text-center">
          <RefreshCw className="w-8 h-8 text-zinc-500 animate-spin mb-3" />
          <p className="text-zinc-400 text-sm">Obteniendo clima...</p>
        </section>
      )}

      {/* Caso 3: Error */}
      {isOnline && !loading && errorMsg && (
        <section className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-center my-auto">
          <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
          <button
            onClick={() => loadData(false)}
            className="mt-4 px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-xl hover:bg-zinc-700 active:scale-95 transition-all"
          >
            Reintentar
          </button>
        </section>
      )}

      {/* Caso 4: Clima cargado correctamente */}
      {isOnline && !loading && weather && (
        <div className="flex flex-col gap-6">
          {/* Tarjeta de Clima Actual */}
          <section className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg">
            {currentIconUrl && (
              <img
                src={currentIconUrl}
                alt={weather.current.condition.text}
                className="w-20 h-20 drop-shadow mb-1 object-contain"
              />
            )}

            <div className="text-6xl font-light tracking-tighter my-1">
              {Math.round(weather.current.temp_c)}°
            </div>

            <div className="text-lg font-medium text-zinc-200 capitalize">
              {weather.current.condition.text}
            </div>

            {/* Máxima y Mínima de hoy */}
            {todayForecast && (
              <div className="flex gap-4 text-sm text-zinc-400 mt-2 font-medium">
                <span>Máx: {Math.round(todayForecast.day.maxtemp_c)}°</span>
                <span>•</span>
                <span>Mín: {Math.round(todayForecast.day.mintemp_c)}°</span>
              </div>
            )}

            {/* Sensación térmica y Humedad */}
            <div className="flex gap-6 text-xs text-zinc-400 mt-4 pt-4 border-t border-zinc-800/80 w-full justify-center">
              <div className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sensación: {Math.round(weather.current.feelslike_c)}°</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Humedad: {weather.current.humidity}%</span>
              </div>
            </div>
          </section>

          {/* Pronóstico de los días siguientes */}
          <section className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-5">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase mb-4 px-1">
              Pronóstico de la semana
            </h3>

            <div className="flex flex-col divide-y divide-zinc-800/60">
              {weather.forecast.forecastday.map((fDay, index) => {
                const dayIconUrl = fDay.day.condition.icon.startsWith("http")
                  ? fDay.day.condition.icon
                  : `https:${fDay.day.condition.icon}`;
                const maxTemp = Math.round(fDay.day.maxtemp_c);
                const minTemp = Math.round(fDay.day.mintemp_c);

                return (
                  <div
                    key={fDay.date}
                    className="flex items-center justify-between py-3 px-1 text-sm"
                  >
                    <span className="w-14 font-medium text-zinc-300">
                      {formatDayName(fDay.date, index)}
                    </span>

                    <div className="flex items-center gap-2 flex-1 justify-center">
                      <img
                        src={dayIconUrl}
                        alt={fDay.day.condition.text}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-xs text-zinc-400 hidden sm:inline capitalize">
                        {fDay.day.condition.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-medium">
                      <span className="text-white">{maxTemp}°</span>
                      <span className="text-zinc-500 text-xs">{minTemp}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Barra de navegación inferior */}
      <NavBar />
    </main>
  );
}

export default Climate;
