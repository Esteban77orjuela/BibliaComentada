# BibliaComentada — Clase del Proyecto

> Material de estudio para dominar el proyecto de memoria.
> Estructura: **Idea General** (el bosque en una frase) → **Idea Particular** (cada árbol, cada archivo, cada comando) → **Tips de memorización**.

---

## PARTE 1 — IDEA GENERAL (el mapa)

> **"Una app móvil 100% offline que lleva la Biblia RVR1960 completa, comentarios de teólogos, diccionarios y artículos en una base SQLite embebida, y se actualiza sola sin reinstalar."**

**El viaje del usuario (flujo principal):**

```
Abre la app
  → Inicio (versículo del día, AT/NT, accesos rápidos)
  → Libros (39 AT / 27 NT)
  → Capítulo (lista de versículos)
  → Toca un versículo
  → Se expande: Guardar favorito + comentarios de teólogos
  → Cambia de teólogo con las pestañas
```

**Los 4 módulos de la app (las 5 pestañas de abajo):**

| Pestaña | Módulo | Qué contiene |
|---------|--------|--------------|
| Inicio | Biblia | Libros → Capítulos → Versículos con comentarios |
| Buscar | Búsqueda | Texto en Biblia, diccionario y artículos |
| Guardados | Favoritos | Versículos marcados (se guardan en el dispositivo) |
| Diccionario | Diccionarios | 111 términos bíblicos con detalle |
| Artículos | Artículos | 8 artículos de estudio |

**El corazón del proyecto: una base de datos, dos mundos:**

```
┌─ GENERACIÓN (en tu PC) ──────────────┐     ┌─ CONSUMO (en el celular) ──────────────┐
│ scripts/import-content.js            │     │ src/services/DatabaseService.ts       │
│   + scripts/import-commentary...js   │     │  (lee las mismas tablas con SQL)      │
│   → produce assets/bible.db          │──→──│  → se copia al dispositivo            │
└──────────────────────────────────────┘     └───────────────────────────────────────┘
                      App.tsx verifica db_version y reimporta si cambió
```

---

## PARTE 2 — IDEA PARTICULAR (cada pieza)

### 2.1 Inicio de la app — `App.tsx`

**Qué hace (secuencia de memoria):**
1. Carga las fuentes tipográficas (3 familias: Playfair, Merriweather, Inter).
2. Abre la BD SQLite.
3. **Pregunta a la BD**: "¿cuál es tu `db_version`?" (`_metadata`).
4. **Compara** con la versión que el código espera (`'3'`).
5. Si NO coincide → cierra la BD y **reimporta** `assets/bible.db` (copia el archivo embebido al dispositivo).
6. Abre de nuevo y lanza la navegación.

> 🧠 **Clave de memoria**: "La app es un portero que pide documento de identidad a su base de datos al entrar. Si el documento está desactualizado, la echa y trae una copia nueva del maletín (el asset)."

### 2.2 Base de datos — tablas

| Tabla | Guarda | Forma del id |
|-------|--------|--------------|
| `books` | Los 66 libros | `1` (id numérico, orden) |
| `verses` | Versículos RVR1960 | `"1-1-1"` = libro-capítulo-versículo |
| `comments` | Comentarios de teólogos | `"gen1-1-<teólogo>"` |
| `articles` | Artículos de estudio | id propio |
| `dictionary_entries` | Términos del diccionario | id propio |
| `comment_authors` | Autores de comentarios | slug |
| `_metadata` | Metadatos (clave/valor) | `db_version`, `updated_at` |

> 🧠 **Clave de memoria**: "La Biblia tiene 66 libros, 1:1:1 es el primer versículo del mundo, y `_metadata` es la cédula de la BD."

### 2.3 Formato de comentarios (JSON estructurado)

Cada comentario es un JSON: **arreglo de párrafos → arreglo de segmentos**.

```json
[
  [["b","Significado."], " En el principio, Dios crea…"],
  [["b","Contexto."], " Génesis es el primer libro…"]
]
```

- `"texto"` → texto normal
- `["b","…"]` → **negrita**
- `["i","…"]` → *cursiva*

Lo interpreta `src/components/ui/SimpleHTML.tsx`. Por eso los comentarios se ven con párrafos separados y títulos en negrita.

> 🧠 **Clave de memoria**: "b = bold (negrita), i = italic (cursiva), y el corchete grande es un párrafo."

### 2.4 Capas de código (patrón en capas)

| Carpeta | Rol | Analogía |
|---------|-----|----------|
| `src/constants/theme.ts` | Sistema de diseño | La paleta del pintor |
| `src/types/` | Tipos TypeScript | Los moldes de la fábrica |
| `src/services/` | Acceso a datos | El cajero del banco (solo él toca la caja fuerte) |
| `src/store/` | Favoritos en el dispositivo | Tu libreta personal |
| `src/components/` | Piezas de UI reutilizables | Los ladrillos de Lego |
| `src/screens/` | Pantallas completas | Las habitaciones de la casa |
| `src/navigation/` | Rutas entre pantallas | El plano de la casa |

> 🧠 **Clave de memoria**: "Las pantallas (habitaciones) solo hablan con los componentes (muebles), y los muebles solo piden datos al servicio (cajero). Nadie salta capas."

### 2.5 Tab bar personalizada — `TabNavigator.tsx`

- Barra **"píldora" oscura** flotante (`borderRadius: 31`, altura 62).
- 100% personalizada con `CustomTabBar` — no usa la barra interna de React Navigation.
- Cada pestaña: ícono SVG hecho con `View`s + etiqueta.
- `overflow: 'hidden'` → nada se sale del óvalo.
- Altura total = 62 + área segura del dispositivo (`useSafeAreaInsets`).

> 🧠 **Clave de memoria**: "Píldora = borderRadius de la mitad de la altura. Siempre. Por eso 62 y 31."

### 2.6 Versículo expandible — `VerseRow.tsx`

Al tocar un versículo:
1. Animación de expansión (Reanimated-style con `Animated`).
2. Carga los teólogos disponibles: `DatabaseService.getTheologians(verseId)`.
3. Muestra pestañas de teólogos (iniciales con colores).
4. `fetchComment(teólogo)` → busca el comentario en la BD → `CommentCard` → `SimpleHTML`.

---

## PARTE 3 — COMANDOS (los que TÚ ejecutas)

### Git (flujo diario)

```bash
git status                    # ver qué cambió
git add .                     # marcar todo para el commit
git commit -m "mensaje"       # guardar el cambio con descripción
git push origin main          # subir a GitHub
```

### Proyecto

```bash
npx expo start                # arrancar el servidor de desarrollo
npx expo start -c             # arrancar limpiando caché (¡imprescindible tras cambiar bible.db!)
npx tsc --noEmit              # revisar errores de TypeScript sin ejecutar
node scripts/import-content.js            # regenerar la BD completa
node scripts/import-commentary-gen1-1.js  # raspar los 43 comentarios de Génesis 1:1
```

### Updates OTA (FASE C — próximamente)

```bash
npx expo install expo-updates # instalar el sistema de updates
eas login                     # conectar tu cuenta expo.dev
eas init                      # vincular el proyecto a EAS
eas build --platform android  # crear APK/AAB (la primera build incluye el sistema)
eas update                    # publicar cambios de JS/UI sin reinstalar
```

> 🧠 **Regla de oro**: si cambiaste `assets/bible.db` → sube la versión en el script y en `App.tsx`, regenera, y arranca con `npx expo start -c`.

---

## PARTE 4 — TIPS DE MEMORIZACIÓN

1. **El método de la analogía**: cada pieza técnica → una imagen cotidiana (portero, cajero, paleta, Lego, píldora).
2. **El método del viaje**: recorre el flujo del usuario en tu mente (Inicio → Libros → Capítulo → Versículo → Comentario). Ese recorrido es la columna vertebral del proyecto.
3. **Pregunta y responde en voz alta** cada semana:
   - ¿Qué hace `App.tsx` al abrir? (pedir `db_version` y comparar)
   - ¿Dónde se guardan los comentarios? (tabla `comments`, JSON estructurado)
   - ¿Qué renderiza `SimpleHTML`? (párrafos y estilos desde JSON)
   - ¿Por qué se usa `overflow: 'hidden'` en la tab bar? (para que nada salga del óvalo)
4. **Regla del porqué**: nunca memorices un comando sin su "por qué". `-c` = clear cache porque Metro no detecta cambios en `.db`.
5. **Tarjeta mental de 7 conceptos**: 66 libros · 31 103 versículos · 43 comentarios · 111 diccionario · 8 artículos · BD v3 · OTA.
