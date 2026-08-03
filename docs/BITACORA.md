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
