# BibliaComentada — Plan de Desarrollo

> Documento maestro del proyecto. Contiene la visión, los requerimientos, la arquitectura, el roadmap por fases y el backlog de trabajo.
> Actualizado: 2026-08-03 — Versión 1.0

---

## 1. Visión del Producto (Idea General)

**¿Qué es?** BibliaComentada es una aplicación móvil (Android/iOS/web) para estudiar la Biblia en español, completamente **offline**: el texto bíblico Reina-Valera 1960, comentarios exegéticos de teólogos clásicos, diccionarios bíblicos y artículos de estudio viajan dentro de la aplicación en una base de datos SQLite local.

**¿Qué problema resuelve?** El estudio bíblico serio requiere tener a la mano texto, comentarios y diccionarios de referencia. Las soluciones existentes requieren internet, suscripciones o descargas de contenido pesado por separado.

**¿Quién lo usará?** Estudiantes de la Biblia, pastores, líderes de iglesia y cualquier persona hispanohablante que quiera profundizar en las Escrituras sin depender de conexión.

**¿Qué valor entrega?**
- Lectura fluida y agradable de la Biblia RVR1960 completa (31 103 versículos)
- Comentarios exegéticos de teólogos reconocidos (Matthew Henry, Calvino, Spurgeon, etc.)
- Diccionarios y artículos de estudio
- Búsqueda y marcadores de versículos favoritos
- 100% offline, sin anuncios, sin registro

**¿Cómo se mantiene actualizado?** Sistema de actualizaciones OTA (EAS Update): los cambios de contenido y de interfaz se publican en la nube y llegan a los usuarios sin necesidad de reinstalar la aplicación. Solo los cambios nativos requieren una build nueva.

---

## 2. Requerimientos

### 2.1 Funcionales

| ID | Requerimiento | Estado |
|----|--------------|--------|
| RF-01 | Ver los 66 libros de la Biblia (AT y NT) | ✅ Implementado |
| RF-02 | Navegar por capítulos y leer versículos RVR1960 | ✅ Implementado |
| RF-03 | Expandir un versículo para ver comentarios exegéticos | ✅ Implementado |
| RF-04 | Cambiar de teólogo comentarista (43 disponibles en Génesis 1:1) | ✅ Implementado |
| RF-05 | Guardar versículos favoritos (persistencia con AsyncStorage) | ✅ Implementado |
| RF-06 | Buscar textos en la Biblia, diccionario y artículos | ✅ Implementado |
| RF-07 | Ver diccionarios bíblicos (111 entradas) | ✅ Implementado |
| RF-08 | Ver artículos de estudio (8 artículos) | ✅ Implementado |
| RF-09 | Versículo del día en la pantalla de inicio | ✅ Implementado |
| RF-10 | Accesos rápidos a libros destacados | ✅ Implementado |
| RF-11 | Actualizaciones OTA de contenido y UI | 🔜 Planificado (Fase C) |
| RF-12 | Comentarios de todos los versículos (no solo Génesis 1:1) | 🔜 Roadmap |

### 2.2 No funcionales

| ID | Requerimiento | Estado |
|----|--------------|--------|
| RNF-01 | Funcionar 100% sin conexión a internet | ✅ Implementado |
| RNF-02 | Tiempo de arranque < 3 segundos en dispositivo medio | ✅ |
| RNF-03 | Base de datos embebida ~6.4 MB | ✅ |
| RNF-04 | Interfaz en español, tipografía legible (Merriweather) | ✅ |
| RNF-05 | Tema visual cálido (pergamino + dorado) | ✅ |
| RNF-06 | TypeScript estricto, código tipado | ✅ |
| RNF-07 | Actualizaciones sin reinstalar la APK | 🔜 Fase C |

---

## 3. Arquitectura

### 3.1 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Lenguaje | TypeScript 5.9 |
| Base de datos | SQLite local (`expo-sqlite` ~16) — archivo embebido `assets/bible.db` |
| Navegación | React Navigation 7 (native-stack + bottom-tabs personalizada) |
| Fuentes | Playfair Display (títulos), Merriweather (lectura), Inter (UI) |
| Almacenamiento extra | AsyncStorage (versículos favoritos) |
| Generación de BD | `sql.js` + scripts Node en `scripts/` |
| Updates OTA | EAS Update (`expo-updates`) — Fase C |

### 3.2 Estructura de carpetas

```
BibliaComentada/
├── App.tsx                    # Entrada: inicializa BD con chequeo de versión
├── assets/
│   └── bible.db               # Base de datos SQLite embebida (v3)
├── scripts/
│   ├── import-content.js      # Genera la BD completa (biblia, artículos, diccionario)
│   └── import-commentary-gen1-1.js  # Scraper de 43 comentarios de Génesis 1:1
├── src/
│   ├── constants/theme.ts     # Sistema de diseño (colores, tipografías, espacios)
│   ├── types/index.ts         # Tipos TypeScript (Book, Verse, Comment, Article…)
│   ├── services/
│   │   └── DatabaseService.ts # Capa de acceso a datos (CRUD SQLite)
│   ├── store/
│   │   └── FavoritesStore.ts  # Favoritos (AsyncStorage)
│   ├── navigation/
│   │   ├── TabNavigator.tsx   # Tab bar "píldora" personalizada (5 pestañas)
│   │   ├── BibleStack.tsx     # Stack: Home → Books → Chapters → Reader
│   │   ├── DictionaryStack.tsx
│   │   └── ArticlesStack.tsx
│   ├── screens/
│   │   ├── bible/             # Home, Books, Chapters, Reader
│   │   ├── dictionaries/      # Lista y detalle
│   │   ├── articles/          # Lista y detalle
│   │   ├── SearchScreen.tsx
│   │   └── FavoritesScreen.tsx
│   └── components/
│       ├── ui/                # VerseRow, CommentCard, SimpleHTML, tabs…
│       └── layout/
└── docs/                      # Documentación del proyecto (este plan, bitácora, clase)
```

### 3.3 Base de datos

Tablas: `books`, `verses`, `articles`, `dictionary_entries`, `comments`, `comment_authors`, `_metadata`.

**Versionado de datos:** la tabla `_metadata` guarda `db_version`. La app compara esa versión con la esperada en el código (`App.tsx`). Si no coinciden, reimporta el archivo `assets/bible.db` sobre el dispositivo. Esto permite actualizar contenido simplemente regenerando la BD y subiendo una build.

- v1: contenido inicial
- v2: comentarios de Génesis 1:1 con formato HTML
- v3: comentarios en formato JSON estructurado (párrafos + negritas/cursivas)

### 3.4 Formato de comentarios (v3)

Cada comentario se almacena como JSON: un arreglo de párrafos, y cada párrafo es un arreglo de segmentos. Un segmento es texto plano (`"texto"`) o formateado (`["b","negrita"]`, `["i","cursiva"]`).

```json
[
  [["b","Significado."], " En el principio, Dios crea…"],
  [["b","Contexto."], " Génesis es el primer libro…"]
]
```

El componente `SimpleHTML.tsx` interpreta este JSON y renderiza párrafos y estilos tipográficos reales (Merriweather Bold/Italic).

---

## 4. Roadmap por Fases

Las 13 fases del ciclo de vida profesional, aplicadas a este proyecto:

| Fase | Nombre | Estado en el proyecto |
|------|--------|----------------------|
| 0 | Visión del producto | ✅ Este documento |
| 1 | Requerimientos | ✅ Sección 2 |
| 2 | Arquitectura | ✅ Sección 3 |
| 3 | Diseño técnico | ✅ Capas `src/` implementadas |
| 4 | Desarrollo | 🔄 En curso (sprints) |
| 5 | Base de datos | ✅ SQLite + scripts + versionado |
| 6 | Testing | 🔜 Pendiente (próximo sprint) |
| 7 | Seguridad | ✅ App offline, sin datos sensibles; escaneo de dependencias pendiente |
| 8 | Docker | N/A (app móvil, sin backend) |
| 9 | CI/CD | 🔜 EAS Update + GitHub Actions (Fase C) |
| 10 | Cloud | 🔜 EAS (builds y updates en la nube de Expo) |
| 11 | Observabilidad | 🔜 Logs de errores (próximo sprint) |
| 12 | Escalabilidad | N/A en cliente; se aplica si hay backend futuro |
| 13 | Mantenimiento | 🔄 Bitácora + versionado semántico |

---

## 5. Backlog (Metodología Scrum/Agile)

> Trabajamos en sprints cortos: hacemos → revisamos → ajustamos. Cada sprint deja la aplicación en estado funcional.

### Sprint actual

| # | Tarea | Estado |
|---|-------|--------|
| S1-1 | Base documental: plan, bitácora, clase, README | ✅ |
| S1-2 | Limpieza de archivos de configuración del repositorio | ✅ |
| S1-3 | Commit y push a GitHub | 🔜 |
| S1-4 | Sistema de updates OTA (EAS Update) | 🔜 |

### Backlog futuro (ordenado por prioridad)

- [ ] Publicar comentarios de más versículos (scraper masivo)
- [ ] Ajustes de tamaño de letra en el lector
- [ ] Modo oscuro
- [ ] Testing unitario (Jest) del DatabaseService y SimpleHTML
- [ ] Logs de errores en producción (Sentry o similar)
- [ ] Pantalla de ajustes
- [ ] Favoritos sincronizados (requeriría backend — evaluar)
- [ ] Mejoras de accesibilidad (VoiceOver/TalkBack)

---

## 6. Notas técnicas del equipo

- **Expo cambia rápido**: consultar siempre la documentación de la versión exacta del SDK en uso (https://docs.expo.dev/versions/v54.0.0/ y expo-sqlite para SDK 54) antes de escribir código nuevo.
- **Regenerar la BD**: `node scripts/import-content.js` recrea el archivo `assets/bible.db` completo (no se debe editar la BD a mano).
- **Versionar contenido**: cada cambio de contenido en `bible.db` debe subir `db_version` y ajustar la constante esperada en `App.tsx`.
- **Consola**: el desarrollador ejecuta todos los comandos de terminal manualmente.
