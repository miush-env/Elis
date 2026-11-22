# Task Manager - Proyecto Elis (Alarma, Clima, Temporizador y Cronómetro)

Objetivo: Replicar con fidelidad pixel-perfect el diseño oscuro y minimalista AMOLED de la app y asegurar el funcionamiento nativo en Android.

---

## 1. 🎨 Estilos Globales y Layout Base

- [ X ] **Fondo AMOLED puro**: Configurar el contenedor principal con fondo negro absoluto (`bg-black` / `#000000`) y texto blanco.
- [ X ] **Tipografía**: Asegurar la fuente sans-serif geométrica moderna (Inter / Sans) para números grandes y títulos.
- [ X ] **Safe Area & Scrolling**: Contenedor principal con scroll vertical (`overflow-y-auto pb-24`) para que las tarjetas no queden tapadas por la barra inferior.

---

## 2. 🔝 Cabecera Superior (Header / NextAlarm)

- [ X ] **Título dinámico principal**: Conectar el texto grande: `Alarma programada a las [HH:MM]` obtenido en tiempo real de la alarma activa más próxima (o mensaje cuando no hay alarmas activas).
- [ X ] **Subtítulo temporal dinámico**: Fecha y hora de la próxima alarma activa (ej: `mar, 3 nov 06:20`) calculada en base al día correspondiente.
- [ X ] **Botón de crear alarma**: Botón con icono `+` (`Plus` de Lucide) que abre el modal/drawer para crear una nueva alarma.
- [ ] **Botón de menú de opciones**: Conectar el botón con icono `⋮` (`EllipsisVertical` de Lucide) con menú/popover de opciones (Configuración, Acerca de Elis).

---

## 3. 📋 Lista de Alarmas en Tarjetas Píldora (ListAlarm & AlarmCard)

- [ X ] **Modularización de Componentes**: Separar `AlarmCard` de `ListAlarm` para código limpio y mantenible.
- [ X ] **Diseño de cada tarjeta de alarma**: Fondo gris oscuro sutil (`bg-[#18181A]`), esquinas redondeadas (`rounded-[24px]`) y padding generoso.
- [ X ] **Sección Hora**: Tipografía grande (`text-[40px] font-light`) con formato de dos dígitos (`00:00`).
- [ X ] **Sección Días (`L M X J V S D`)**:
  - [ X ] Mostrar siempre las 7 iniciales fijas.
  - [ X ] **Días inactivos**: Color gris apagado (`text-gray-500`).
  - [ X ] **Días activos**: Color blanco (`text-white`) con punto indicador blanco (`active-dot bg-white`) centrado arriba de la letra.
- [ X ] **Sección Toggle de Encendido / Apagado**:
  - [ X ] Switch minimalista conectado a `alarm.isEnable`.
  - [ X ] Sincronización con base de datos local (`toggleAlarmStatus`).
  - [ X ] Programar/cancelar notificación al alternar el switch.
- [ X ] **Eliminación de Alarma**: Popover contextual para borrar la alarma del storage y cancelar sus notificaciones.

---

## 4. 🧭 Barra de Navegación Inferior (Bottom Navigation Bar)

- [ X ] **Contenedor fijo**: Fijado en la parte inferior (`fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900`).
- [ X ] **Distribución limpia de 4 accesos**:
  - [ X ] **Alarma** (`/`): Pestaña activa con indicador blanco inferior.
  - [ X ] **Clima** (`/climate`): Acceso a pronóstico del tiempo.
  - [ X ] **Cronómetro** (`/stopwatch`): Acceso a cronómetro de precisión con vueltas.
  - [ X ] **Temporizador** (`/timer`): Acceso a cuenta regresiva.
  - [ X ] **Reloj Mundial**: Descartado y eliminado del proyecto para simplificar la barra.
- [ X ] **Margen inferior para barra de gestos**: Padding inferior extra (`pb-6` / `safe-area`) para no chocar con la barra de gestos de Android.

---

## 5. ⚙️ Lógica de Próxima Alarma (NextAlarm Logic)

- [ X ] Crear función auxiliar `getNextAlarm(alarms: Alarm[])`:
  - [ X ] Filtrar solo las alarmas activas (`isEnable === true`).
  - [ X ] Si la alarma tiene días de la semana seleccionados, calcular la fecha/hora exacta del próximo día de disparo.
  - [ X ] Si no tiene días seleccionados, calcular para hoy o mañana según la hora actual.
  - [ X ] Ordenar por la fecha más cercana y retornar la próxima alarma.
- [ X ] Pasar `alarms` desde `App.tsx` a `NextAlarm` para alimentar el componente con datos reales.
- [ X ] Manejar estado vacío cuando no haya alarmas activadas (*"Sin alarmas programadas"*).

---

## 6. 🔔 Notificaciones Nativas y Servicio de Alarma en Android

- [ X ] **Canal de Máxima Prioridad**: Configurado con `importance: 5` para despertar pantalla y mostrar alerta Heads-Up.
- [ X ] **Servicio Nativo de Audio (`AlarmSoundService`)**:
  - [ X ] Reproducción en bucle con `MediaPlayer` en canal nativo de alarma (`USAGE_ALARM`).
  - [ X ] Puente nativo Capacitor (`AlarmSoundPlugin`).
- [ X ] **Fix de Panel de Notificaciones**:
  - [ X ] Vinculación como notificación de servicio en primer plano (`startForeground`).
  - [ X ] Banderas `FLAG_ONGOING_EVENT` y `FLAG_NO_CLEAR` para que sea persistente y no se pueda deslizar ni borrar mientras suena.
  - [ X ] Solución al corte de audio: abrir la cortina de notificaciones de Android no silencia la música.
- [ X ] **Apagado seguro instantáneo**: Silenciado inmediato al presionar "Apagar" o "Aplazar", o al descartar la notificación.
- [ X ] **Repetición Semanal y acotación de 32 bits**: Evita desbordamiento `IDENTIFIER_NOT_INT`.
- [ X ] **Verificación en Celular Real**: Alarma probada y funcionando en dispositivo físico.

---

## 7. ⏱️ Pantalla de Temporizador (`/timer`)

- [ X ] **Diseño AMOLED puro**: Selectores de Horas, Minutos y Segundos con presets rápidos (+1m, +5m, +10m, +15m, +30m).
- [ X ] **Cálculo de delta por Timestamp Real**: No se congela ni pierde precisión al bloquear el teléfono o cambiar de app.
- [ X ] **Anillo de progreso SVG dinámico**: Círculo visual animado con indicación de hora de finalización prevista.
- [ X ] **Botón `+1m` al vuelo**: Para añadir 60 segundos mientras está corriendo sin pausar.
- [ X ] **Notificación en segundo plano**: Notificación local nativa programada para cuando finalice la cuenta con pantalla apagada.
- [ X ] **Persistencia en `localStorage`**: Si se reinicia la app, recupera el estado exacto del temporizador.
- [ X ] **Alarma de finalización**: Reproducción sonora y animación de tiempo cumplido con botón "Detener".

---

## 8. ⏱️ Pantalla de Cronómetro (`/stopwatch`)

- [ X ] **Componentes shadcn/ui**: Implementado con `Card`, `Button`, `ScrollArea` y `Table`.
- [ X ] **Precisión de Centésimas**: Reloj fluido a 60 FPS mostrando `MM:SS.cs` (y `HH` si supera 60 min).
- [ X ] **Lógica de deltas con `useRef`**: Evita bugs de re-renderizado de React y mantiene sincronía real.
- [ X ] **Registro de Vueltas (Laps)**:
  - [ X ] Cálculo diferencial entre vueltas.
  - [ X ] Tabla detallada con número de vuelta, tiempo de vuelta y tiempo total acumulado.
  - [ X ] Resaltado automático de la vuelta más rápida en verde y la más lenta en rojo.
- [ X ] **Persistencia en `localStorage`**: El cronómetro no se reinicia al navegar entre pestañas.

---

## 9. ☀️ Pantalla de Clima (`/climate`)

- [ X ] **Conexión WeatherAPI**: Datos meteorológicos actualizados en tiempo real.
- [ X ] **Buscador interactivo de ciudades**: Permite seleccionar municipios específicos (ej: Hurlingham, Buenos Aires).
- [ X ] **Detección por geolocalización GPS nativa**: Con `@capacitor/geolocation`.
- [ X ] **Métricas detalladas**: Temperatura, sensación térmica, humedad, viento, visibilidad y pronóstico horario.

---

## 10. 🪄 Polish y Próximos Pasos Pendientes

- [ ] **Menú de Opciones en Cabecera (`⋮`)**: Menú desplegable con información de la app, ajustes o licencia.
- [ ] **Gestión de Tonos / Audios Personalizados**: Selector de tonos o sincronización de audio con subtítulos `.vtt`.
- [ ] **Feedback Háptico / Vibración sutil**: Vibración táctil háptica al interactuar con botones y switches (`@capacitor/haptics`).
- [ ] **Commit y Push de Cronómetro**: Subir a GitHub los cambios de `Stopwatch.tsx` y `main.tsx`.
