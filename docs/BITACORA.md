# BibliaComentada — Bitácora de Desarrollo

> Registro cronológico de todo lo que se ha construido, mejorado y decidido.
> Formato: fecha — qué se hizo — por qué / resultado.

---

## 2026-07 — Lanzamiento del proyecto

### 2026-07-29
- **Creación del proyecto** Expo/React Native (TypeScript) con el nombre de trabajo *BiblePlus*.
- **Sistema de diseño** en `src/constants/theme.ts`: paleta "pergamino + dorado", tipografías Playfair Display (títulos), Merriweather (lectura bíblica) e Inter (UI).
- **Navegación principal**: tab bar inferior con 5 pestañas (Inicio, Buscar, Guardados, Diccionario, Artículos) + stacks de navegación por módulo.
- **Pantalla de inicio**: versículo del día rotatorio, tarjetas AT/NT, accesos rápidos.
- **Flujo de lectura**: Inicio → Libros (AT/NT) → Capítulos → Lector de versículos.
- **Búsqueda** y **favoritos** funcionales.
- **Base de datos embebida** `assets/bible.db` generada con `scripts/import-content.js` (usa `sql.js`): 66 libros, 31 103 versículos RVR1960 (fuente de dominio público/MIT), 8 artículos, 111 entradas de diccionario.
- **`_metadata`**: tabla para versionado de datos (`db_version`).

### 2026-07-30
- **Scraper de comentarios** (`scripts/import-commentary-gen1-1.js`): se obtuvieron los 43 comentarios exegéticos del sitio bibliaplus.org para **Génesis 1:1** (BibliaPlus, Jamieson-Fausset-Brown, Calvino, Matthew Henry, Spurgeon, Adam Clarke, etc.). Almacenados con su HTML original.
- **`db_version = 2`**: la app ahora reimporta la BD automáticamente si la versión embebida no coincide con la esperada en `App.tsx`.

### 2026-07-31
- **Formato de comentarios v3**: se abandonó el HTML crudo por **JSON estructurado** (párrafos + segmentos `b`/`i`). La app dejó de depender de parsear HTML en el cliente.
- **`SimpleHTML.tsx`**: nuevo componente que renderiza el JSON con párrafos reales, negritas y cursivas (Merriweather Bold/Italic). Se ven correctamente espaciados y con títulos en negrita.
- **`db_version = 3`** y verificación de que los 43 comentarios quedaron en formato JSON.

## 2026-08 — Pulido visual y profesionalización

### 2026-08-01
- **Accesos rápidos centrados** en la pantalla de inicio (`justifyContent: 'center'`).
- **Tab bar rediseñada** (v2): píldora oscura flotante con altura dinámica según el área segura del dispositivo; los íconos dejaron de desbordarse del óvalo.
- **Tab bar v3**: barra 100% personalizada (`CustomTabBar`), con `overflow: hidden` en la píldora, íconos y etiquetas perfectamente centrados, e indicador visual de pestaña activa (cápsula translúcida).
- **Ajuste final**: se eliminó el fondo de cápsula de la pestaña activa; solo cambia el color a blanco (ícono + etiqueta).

### 2026-08-03
- **Documentación profesional**: se creó esta bitácora, el `docs/PLAN-DESARROLLO.md` (visión, requerimientos, arquitectura, roadmap, backlog Scrum) y `docs/CLASE.md` (material de estudio del desarrollador).
- **`README.md`**: presentación pública del repositorio.
- **Limpieza del repositorio**: se retiraron del control de versiones los archivos de configuración de asistentes de edición (`AGENTS.md`, `CLAUDE.md`, `.claude/`), añadidos a `.gitignore`.
- **Commit y push** inicial del estado completo a GitHub (`Esteban77orjuela/BibliaComentada`).
- 🔜 **Próximo paso**: sistema de updates OTA con EAS Update (ver FASE C en el plan).

## 2026-09 — Comentarios masivos (BibliaPlus) y reglas definitivas

### 2026-09-07
- **`docs/COMENTARIOS.md`**: documento fuente de verdad con la **regla de oro** (SÓLO
  comentarios de un único versículo van a `comments`; los rangos → `range_comments`),
  el mecanismo de descubrimiento (página de versículo + AJAX `verse-ajax/more`), el
  control de calidad, el estado aprobado y el protocolo de ejecución.
- **`scripts/scrape-commentaries.js`**: scraper generalizado reutilizable que descubre los
  nodos de cada versículo (10 tarjetas iniciales + resto vía `verse-ajax/more`), clasifica
  por la regla de oro, extrae el contenido de cada nodo (`<div class="content">`) y escribe
  en `comments`/`range_comments` con ids deterministas (sin duplicados; reanudable).
- **Génesis 1:2 procesado**: 20 comentarios de versículo único → `comments` (`1-1-2`) y 4
  nodos de rango nuevos → `range_comments` (Sermón 1-31, Ellicott 1-31, Kretzmann 1-5,
  College Press 2-5). Los demás rangos ya existían de 1:1.
- **Génesis 1:3, 1:4 y 1:5 procesados** con el mismo scraper (0 errores, sin duplicados):
  - 1:3 → 17 comentarios + 4 rangos nuevos (Henry 3-5, Barnes 3-5, Homilético 3-5,
    Ilustrador 3-4).
  - 1:4 → 10 comentarios + 3 rangos nuevos (JFB 4-5, Peter Pett 4-5, Hawker's 4-5).
  - 1:5 → 13 comentarios + 1 rango nuevo (Arthur Peake 1-5). Nuevo comentario de versículo
    único descubierto: **Notas al Margen en la Versión King James (1611)** (id 369).
- **`db_version = 12`** (+ actualización de la versión esperada en `App.tsx`) para forzar el
  reimport de la BD en el dispositivo.

### 2026-09-09
- **Génesis 1 completo**: se procesaron los versículos 1:6–1:31 con el scraper generalizado
  (lotes de 5; 0 errores, 0 duplicados). El capítulo 1 queda con **345 comentarios** de
  versículo único (1:1–1:31) y **109 rangos** en `range_comments`.
- **Nuevos comentaristas descubiertos**: **BibliaPlus** (id 999, aparece en 1:26 y 1:27) y
  **Comentario bíblico de B. W. Johnson** (id 231, en 1:26–1:31); B.W. Johnson se renombró en
  BD con su nombre real y se agregó a `THEOLOGIANS`.
- **Limpieza**: se eliminaron 2 filas heredadas de `1-1-26` (`c-1-1-26-cal`, `c-1-1-26-mh`);
  la de Matthew Henry violaba la regla de oro (su nodo en 26 es el rango 26-28).
- **`db_version = 38`** + `App.tsx` actualizado a esperar '38' (reimport automático);
  `npx tsc --noEmit` limpio.

### 2026-09-09 (Génesis 2–5)
- **Génesis 2, 3, 4 y 5 procesados por completo** (107 versículos, 0 errores por corrida):
  el libro 1 queda con **1.670 comments** en 138 versículos y **371 rangos** (cap.2=78,
  cap.3=73, cap.4=70, cap.5=41).
- **Nuevos comentaristas catalogados**: **Horae Homileticae de Charles Simeon** (id 169;
  versículo único 3:4, 3:15, 4:26, 5:24 + rangos) y **Comentario de Sutcliffe sobre el
  Antiguo y el Nuevo Testamento** (id 181; rangos 1-25/1-26/1-32). Agregados a `THEOLOGIANS`
  y renombrados en BD.
- **Limpieza**: borradas las 2 filas heredadas de `1-3-15` (HTML crudo; la de Calvino
  duplicaba el canónico) y corregido el nombre "B. W. Johnson" con byte corrupto en los
  6 registros del cap.1.
- **`db_version = 145`** + `App.tsx` esperando '145'; `npx tsc --noEmit` limpio.
- ⚠️ Queda pendiente (fuera de alcance) revisar el legado histórico en HTML crudo de
  **Juan 1:1, 1:14 y 3:16** (8 filas) cuando se procese ese libro.

### 2026-09-09 (Génesis 6–10)
- **Génesis 6, 7, 8, 9 y 10 procesados por completo** (129 versículos, 0 errores por corrida):
  el libro 1 queda con **3.126 comments** en 267 versículos y **638 rangos**
  (cap.6=317, cap.7=235, cap.8=243, cap.9=340, cap.10=321 comments;
  rangos cap.6=59, cap.7=49, cap.8=56, cap.9=60, cap.10=43).
- **Sin comentaristas nuevos** en estos capítulos: todos los nombres ya estaban en
  `THEOLOGIANS`; 0 duplicados, 0 JSON inválido, sin limpiezas necesarias.
- **`db_version = 274`** + `App.tsx` esperando '274'; `npx tsc --noEmit` limpio.
- Logs de corrida en `scripts/logs/gen-{6..10}.log`.

### 2026-09-14 (Génesis 11–20)
- **Génesis 11 al 20 procesados por completo** (247 versículos, 0 errores por corrida):
  el libro 1 queda con **6.020 comments** en 514 versículos y **1.201 rangos**
  (cap.11=300, cap.12=282, cap.13=226, cap.14=284, cap.15=284, cap.16=212, cap.17=296,
  cap.18=353, cap.19=434, cap.20=223 comments;
  rangos cap.11=56, cap.12=56, cap.13=55, cap.14=62, cap.15=46, cap.16=43, cap.17=59,
  cap.18=61, cap.19=88, cap.20=37).
- **Sin comentaristas nuevos**: todos los nombres ya catalogados; 0 duplicados, 0 JSON inválido.
- **Limpieza**: corregida 1 fila heredada de `Notas al Margen en la Versión King James (1611)`
  (id 369) cuyo nombre quedó con byte corrupto (`Versi?n`) en 1:5; ahora 105 filas con nombre correcto.
- **Fix en scraper**: los nodos con rango inválido que empiezan en 0 (`Cambridge 0-19` en cap.18,
  HTTP 404 en el sitio) ahora se saltan (`start < 1`); el rango válido `16-33` sí se almacena.
- **`db_version = 521`** + `App.tsx` esperando '521'; `npx tsc --noEmit` limpio.
- Logs de corrida en `scripts/logs/gen-{11..20}.log`.

### 2026-09-15 (Génesis 21–30)
- **Génesis 21 al 30 procesados por completo** (360 versículos, 0 errores por corrida):
  el libro 1 queda con **9.697 comments** en 874 versículos y **1.842 rangos**
  (cap.21=381, cap.22=300, cap.23=221, cap.24=580, cap.25=375, cap.26=371, cap.27=424,
  cap.28=266, cap.29=360, cap.30=399 comments;
  rangos cap.21=64, cap.22=56, cap.23=40, cap.24=92, cap.25=81, cap.26=63, cap.27=76,
  cap.28=51, cap.29=63, cap.30=55).
- **Sin comentaristas nuevos ni nombres corruptos**: los 50 nombres distintos en BD coinciden
  1:1 con `THEOLOGIANS`; 0 duplicados, 0 JSON inválido.
- **`db_version = 881`** + `App.tsx` esperando '881'; `npx tsc --noEmit` limpio.
- Logs de corrida en `scripts/logs/gen-{21..30}.log`.

### 2026-09-15 (Pausa en la extracción + navegación de capítulos)
- **Punto de guardado**: Génesis **1–30 COMPLETOS** (`db_version 881`). Faltan los capítulos
  **31–50** (658 versículos según la BD: 31=55, 32=32, 33=19, 34=31, 35=29, 36=43, 37=36, 38=30,
  39=23, 40=23, 41=57, 42=38, 43=34, 44=34, 45=28, 46=34, 47=31, 48=22, 49=33, 50=26) para cerrar
  el libro. Continuar con `genesis 31` → esperado `db_version 1539` (881 + 658).
- **Feature UI** (sin extracción): navegación de capítulos en el **encabezado del lector**, no
  como barra inferior. Dos flechas circulares `ChapterArrowButton` (chevrones dibujados con View,
  sin dependencias) flanquean los selectores de libro y traducción; el dropdown de libro ahora
  muestra "Libro N" (evita duplicar el capítulo que antes aparecía dos veces) y se eliminó el
  título grande repetido; meta centrada "Capítulo N de M · X versículos". La barra inferior
  original se retiró (chocaba con la tab bar de Inicio/Buscar/Guardados/Diccionario/Artículos) y
  se borró `ChapterNavigator.tsx`. Cruza de libro en los extremos (Génesis 50 → Éxodo 1), botón
  deshabilitado en límites, `navigation.replace`. `ChapterTarget` movido a `src/types/index.ts`.
  Verificado con `npx tsc --noEmit`.
- **Selectora "Ir a ubicación" (dropdown de libro)**: ahora es un selector jerárquico de 3 niveles.
  Al abrirlo, el libro actual aparece expandido con su grilla de capítulos (el capítulo en curso
  resaltado); tocar un capítulo revela sus versículos (grilla de chips, consulta bajo demanda vía
  `getVerses`) y tocar un versículo navega hasta él con `highlightVerseId` (auto-scroll).
  Botón "Abrir capítulo ›" para saltar al capítulo sin versículo. El resto de libros quedan
  debajo con scroll (AT/NT); tocar un libro lo expande mostrando sus capítulos (ya no salta a
  cap.1). `ChapterArrowButton` (44×44) flanquea los selectores; `ChapterTarget` en types.

### 2026-09-16 (Génesis 31–50 → LIBRO 1 COMPLETO)
- Corridas `genesis {31..50}` (658 versículos; logs en `scripts/logs/gen-{31..50}.log`). Varias
  corridas con `exit=1` (37:18-21) quedaron igualmente cubiertas por rangos; ninguna fila perdida.
- Libro Génesis cerrado con **15.432 comments** (5.735 nuevos en 31-50) y
  **2.968 rangos** (1.126 nuevos) sobre 1.532 versículos. 0 versículos sin cobertura, 0
  duplicados por nodo, 0 JSON inválido, 0 comentaristas nuevos (siguen 50 en `THEOLOGIANS`).
- `db_version` real = **1531** (esperado 1539: 8 corridas insertaron 0 filas — todas ya cubiertas
  por rangos). `App.tsx` actualizado a esperar '1531' (líneas ~126 y ~153); `npx tsc --noEmit`
  limpio. Docs: tabla de caps.31-50 en `COMENTARIOS.md` §4.
- Sondeo idempotente: un vistazo de cobertura midió "658 sin comentario" por leer la BD mientras
  procesos hijos del lote cortado por timeout aún escribían; reiterar el chequeo da 0 faltantes.
- Pendiente histórico (sin cambios): RV1909 (migration SQL) y revisar 8 filas de HTML crudo en
  Juan cuando se procese ese libro.

### 2026-09-21 (Éxodo 1–10, continuación)
- Corridas `exodo {1..10}` (274 versículos; logs en `scripts/logs/exo-{1..10}.log`). Slug `exodo`
  validado en el sitio (1:1 inserta 23 comments + 19 rangos). Todas las corridas con `errores: 0`
  salvo una anomalía benigna: 5:7 "Tesoro del conocimiento" devolvió contenido vacío (nodo obsoleto)
  y el versículo quedó cubierto igualmente (5 comments + 1 rango en la misma corrida).
- Resultado: **3.079 comments** en 274/274 versículos y **597 rangos** (por capítulo: 51/65/51/78/
  48/58/52/59/79/56). 0 versículos sin cobertura, 0 duplicados, 0 JSON inválido, 0 comentaristas
  nuevos (siguen los 50 de `THEOLOGIANS`).
- `db_version` = **1805**. `App.tsx` actualizado a esperar '1805' (3 sitios); `npx tsc --noEmit`
  limpio. Docs: tabla de Éxodo 1-10 en `COMENTARIOS.md` §4.
- Optimización al scraper (sin cambio de datos): el sleep de 1.2 s tras cada nodo ahora solo aplica
  cuando se descarga contenido (los nodos ya existentes saltan al instante); mismo ritmo de red.
- Pendiente: continuar Éxodo 11-40 y revisar las 8 filas de HTML crudo de Juan.

### 2026-09-24 (Éxodo 11–20, lote 1 de 3)
- Corridas `exodo {11..20}` (271 versículos; logs en `scripts/logs/exo-{11..20}.log`). Todas con
  `errores: 0` y 0 anomalías (`EMPTY`/`BAD URL`/`FETCH ERROR`).
- Resultado: **3.236 comments** nuevos (→ 6.315 en libro) y **572 rangos** nuevos (→ 1.169),
  sobre 271/271 versículos cubiertos (→ 545 en 1-20). 0 versículos sin cobertura, 0 duplicados,
  0 JSON inválido, 0 comentaristas nuevos (siguen los 50 de `THEOLOGIANS`).
- `db_version` = **2076** (2076 `App.tsx` actualizado en 3 sitios; `npx tsc --noEmit` limpio).
- Docs: tabla Éxodo 11-20 y totales actualizados en `COMENTARIOS.md` §4.
- Pendiente: Éxodo 21-40 (lotes 2 y 3) y las 8 filas de HTML crudo de Juan.

### 2026-09-24 (Éxodo 21–30, lote 2 de 3)
- Corridas `exodo {21..30}` (343 versículos; logs en `scripts/logs/exo-{21..30}.log`). La corrida
  25 se cortó en el vers.18 tras una interrupción; reanudada completa (la BD es idempotente: los
  1-17 se omiten al instante). Todas las corridas OK.
- Resultado: **3.148 comments** nuevos (→ **9.463** en libro) y **654 rangos** nuevos (→ **1.823**),
  sobre 343/343 versículos cubiertos (→ 888 en 1-30). 0 sin cobertura, 0 duplicados, 0 JSON
  inválido, 0 comentaristas nuevos (siguen 50 en `THEOLOGIANS`).
- Anomalía benigna: nodo "Tesoro del conocimiento" vacío en 28:25 y 29:42 (mismo caso de 5:7);
  ambos versículos cubiertos por otros nodos propios y rangos.
- `db_version` = **2419**; `App.tsx` actualizado (3 sitios); `npx tsc --noEmit` limpio. Docs:
  tabla Éxodo 1-30 (30 filas) en `COMENTARIOS.md` §4.
- Pendiente: Éxodo 31-40 (lote 3, cierra el libro 2) y las 8 filas de HTML crudo de Juan.
