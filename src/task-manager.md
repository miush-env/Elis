# Task Manager - Pantalla Principal de Alarmas (Aura)

Objetivo: Replicar con fidelidad pixel-perfect el diseño oscuro y minimalista de la pantalla de alarmas de la imagen.

---

## 1. 🎨 Estilos Globales y Layout Base

- [ X ] **Fondo AMOLED puro**: Configurar el contenedor principal con fondo negro absoluto (`bg-black` / `#000000`) y texto blanco.
- [ X ] **Tipografía**: Asegurar la fuente sans-serif geométrica moderna (Plus Jakarta Sans o Inter) para números grandes y títulos.
- [  ] **Safe Area & Scrolling**: Contenedor principal con scroll vertical (`overflow-y-auto pb-24`) para que las tarjetas no queden tapadas por la barra inferior.

---

## 2. 🔝 Cabecera Superior (Header / NextAlarm)

- [ X ] **Título dinámico principal**: Texto grande y en negrita: `Alarma programada a las [HH:MM]` (obtenido de la alarma activa más próxima).

- [ X ] **Subtítulo temporal**: Fecha y hora de la próxima alarma o contexto actual (ej: `mar, 3 nov 06:20`) en color gris tenue (`text-zinc-400 text-sm`).
- [ X ] **Botones de acción (Esquina superior derecha)**:
  - [ ] Botón con icono `+` (`Plus` de Lucide) que abra el modal/drawer para crear una nueva alarma.
  - [ ] Botón con icono `⋮` (`MoreVertical` de Lucide) para menú de opciones/ajustes.

---

## 3. 📋 Lista de Alarmas en Tarjetas Píldora (ListAlarm)

- [ ] **Reemplazar estructura de `<Table>`**: Migrar de una tabla HTML clásica a una lista de tarjetas en píldora (`rounded-3xl` o `rounded-full`).

- [ ] **Diseño de cada tarjeta de alarma**:
  - [ ] Fondo gris oscuro sutil (`bg-[#18181b]` o `bg-[#1c1c1e]`), con esquinas muy redondeadas (`rounded-3xl`) y padding interno espacioso (`p-5` o `px-6 py-4`).
  - [ ] Separación entre tarjetas con `space-y-3` o `gap-3`.
- [ ] **Sección Izquierda - Hora**:
  - [ ] Tipografía de hora en tamaño grande (`text-3xl` o `text-4xl`), fuente tabular o monoespaciada para evitar saltos.
- [ ] **Sección Central - Selector visual de Días (`L M X J V S D`)**:
  - [ ] Mostrar las 7 iniciales: `L`, `M`, `X`, `J`, `V`, `S`, `D`.
  - [ ] **Días inactivos**: Color gris oscuro apagado (`text-zinc-600`).
  - [ ] **Días activos**: Color blanco (`text-white`) con un punto circular blanco (`w-1 h-1 bg-white rounded-full`) centrado justo encima de la letra.
- [ ] **Sección Derecha - Toggle de Encendido / Apagado**:
  - [ ] Switch o botón circular minimalista (anillo blanco cuando está activa, apagado/atenuado cuando está inactiva).
  - [ ] Conectar el evento `toggleAlarm(id)` para alternar `isEnable` en la base de datos local y cancelar/reprogramar la notificación nativa.

---

## 4. 🧭 Barra de Navegación Inferior (Bottom Navigation Bar)

- [ ] **Contenedor fijo**: Fijado en la parte inferior (`fixed bottom-0 left-0 w-full bg-black/95 backdrop-blur-md`).

- [ ] **Items de navegación**:
  - [ ] **Alarma** (Pestaña activa): Texto en blanco, con una pequeña barra horizontal blanca indicadora debajo (`border-b-2 border-white` o píldora indicadora).
  - [ ] **Reloj Mundial** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
  - [ ] **Cronómetro** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
  - [ ] **Temporizador** (Inactivo): Texto gris tenue (`text-zinc-500 text-xs font-medium`).
- [ ] **Margen inferior para barra de gestos**: Padding inferior extra (`pb-4`) para no chocar con la barra de navegación gestual de Android.

---

## 5. ⚙️ Lógica de Próxima Alarma

- [ ] Crear función auxiliar `getNextAlarm(alarms: Alarm[])` que determine cuál es la alarma habilitada (`isEnable === true`) más cercana al horario actual para alimentar el texto del Header.
