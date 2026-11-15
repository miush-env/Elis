# Task Manager - Pantalla Principal de Alarmas (Aura)

Objetivo: Replicar con fidelidad pixel-perfect el diseño oscuro y minimalista de la pantalla de alarmas de la imagen y asegurar el funcionamiento nativo en Android.

---

## 1. 🎨 Estilos Globales y Layout Base

- [ X ] **Fondo AMOLED puro**: Configurar el contenedor principal con fondo negro absoluto (`bg-black` / `#000000`) y texto blanco.
- [ X ] **Tipografía**: Asegurar la fuente sans-serif geométrica moderna (Plus Jakarta Sans o Inter) para números grandes y títulos.
- [ X ] **Safe Area & Scrolling**: Contenedor principal con scroll vertical (`overflow-y-auto pb-24`) para que las tarjetas no queden tapadas por la barra inferior.

---

## 2. 🔝 Cabecera Superior (Header / NextAlarm)

- [ - ] **Título dinámico principal**: Conectar el texto grande: `Alarma programada a las [HH:MM]` obtenido en tiempo real de la alarma activa más próxima (o mensaje cuando no hay alarmas activas).
- [ - ] **Subtítulo temporal dinámico**: Fecha y hora de la próxima alarma activa (ej: `mar, 3 nov 06:20`) calculada en base al día correspondiente.
- [ X ] **Botón de crear alarma**: Botón con icono `+` (`Plus` de Lucide) que abre el modal/drawer para crear una nueva alarma.
- [ ] **Botón de menú de ajustes**: Conectar el botón con icono `⋮` (`EllipsisVertical` de Lucide) con menú/popover de opciones.

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

- [ ] **Contenedor fijo**: Fijado en la parte inferior (`fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-900`).
- [ ] **Items de navegación**:
  - [ ] **Alarma** (Pestaña activa): Texto blanco con barra horizontal/píldora blanca indicadora debajo.
  - [ ] **Reloj Mundial** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
  - [ ] **Cronómetro** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
  - [ ] **Temporizador** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
- [ ] **Margen inferior para barra de gestos**: Padding inferior extra (`pb-4` / `safe-area`) para no chocar con la barra de gestos de Android.

---

## 5. ⚙️ Lógica de Próxima Alarma (NextAlarm Logic)

- [ - ] Crear función auxiliar `getNextAlarm(alarms: Alarm[])`:
  - [ - ] Filtrar solo las alarmas activas (`isEnable === true`).
  - [ ] Si la alarma tiene días de la semana seleccionados, calcular la fecha/hora exacta del próximo día de disparo.
  - [ ] Si no tiene días seleccionados, calcular para hoy o mañana según la hora actual.
  - [ ] Ordenar por la fecha más cercana y retornar la próxima alarma.
- [ ] Pasar `alarms` desde `App.tsx` a `NextAlarm` para alimentar el componente con datos reales.
- [ ] Manejar estado vacío cuando no haya alarmas activadas (ej: *"Sin alarmas programadas"*).

---

## 6. 🔔 Notificaciones Nativas y Repetición en Android

- [ X ] **Canal de Máxima Prioridad**: Crear `alarm_channel` con `importance: 5` y sonido `musica.mp3`.
- [ X ] **Permisos de Android**: Configurados en `AndroidManifest.xml` (`WAKE_LOCK`, `USE_EXACT_ALARM`, `POST_NOTIFICATIONS`, etc.).
- [ X ] **Repetición Semanal**: Diccionario de días (`D=1, L=2...`) y programación con `schedule.on.weekday` y `repeats: true`.
- [ X ] **Fix de Desbordamiento de 32 bits**: Acotar el `baseId = alarm.id % 100000000` para evitar el error `IDENTIFIER_NOT_INT`.
- [ X ] **Cancelación Masiva de IDs**: Cancelar tanto el ID base como los IDs de cada día de la semana (`baseId * 10 + day`).
- [ ] **Verificación en Celular Real**: Confirmar que la alarma suene en la hora programada con pantalla bloqueada.

---

## 7. 🪄 Polish, Sonidos y Ajustes Finales

- [ ] **Gestión de Audios**: Definir si se reemplaza `musica.mp3` por el nuevo audio de Cloudflare R2 y cómo se utilizará el archivo de subtítulos `.vtt`.
- [ ] **Feedback Háptico / Vibración**: Integrar vibración táctil sutil al alternar el Switch o interactuar con los botones.
