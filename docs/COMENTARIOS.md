# BibliaPlus — Comentarios bíblicos (fuente de verdad del scraper)

> Este documento es la **fuente de verdad** de cómo se extraen, clasifican y almacenan
> los comentarios exegéticos importados desde **https://www.bibliaplus.org**.
> Cada vez que se pida *"haz como Génesis 1:1 para el versículo X"*, se aplica EXACTAMENTE
> lo escrito aquí.

---

## 1. La regla de oro (NO negociable)

**Solo** los comentarios cuyo nivel/anclaje cubre **UN ÚNICO versículo** van a la tabla
`comments` (y se muestran en la tarjeta del versículo en la app).

Cualquier comentario que cubra **más de un versículo** (p. ej. `Génesis 1:1-31`,
`Génesis 1:1-5`, `Génesis 1:1,2`) va a la tabla `range_comments` y **NO** se muestra en
la tarjeta del versículo.

```
título = "Génesis 1:2"              → comments (verse_id = '1-1-2')
título = "Génesis 1:1-31"           → range_comments (start 1, end 31)
título = "Génesis 1:1,2"            → range_comments (start 1, end 2)
```

### Cómo se detecta sin ambigüedad

La URL del nodo del comentario termina siempre en el rango:

```
/es/commentaries/{id}/{slug}/{libro}/{capitulo}/{rango}
                                    └───────────────┘
                                    último segmento = rango
```

- `…/genesis/1/2`        → inicio === fin (2)      → **comments**
- `…/genesis/1/1,2`      → inicio 1, fin 2         → **range_comments**
- `…/genesis/1/1-31`     → inicio 1, fin 31        → **range_comments**
- `…/genesis/1/2-5`      → inicio 2, fin 5         → **range_comments**

Patrón de parseo (`parseRange`): `^(\d+)(?:[,\-](\d+))?$`

---

## 2. Cómo se descubren los comentarios del versículo

La página del versículo `https://www.bibliaplus.org/es/{libro}/{cap}/{ver}` lista las
tarjetas de comentarios relevantes a ese versículo:

1. **Primeras 10 tarjetas** vienen en el HTML inicial, enlazadas por
   `<a class="commentary_block_more" href="…">Seguir leyendo →</a>` (URL completa del nodo).
2. El resto se cargan por AJAX: la misma página expone
   `<section … data-more-url="https://www.bibliaplus.org/es/verse-ajax/more/{libro}/{cap}/{ver}">`.
   Se consulta ese endpoint con cabecera `X-Requested-With: XMLHttpRequest` y devuelve el
   resto de tarjetas con el mismo marcado.
3. Se hace la **unión y dedupe** de URLs de nodos.

Cada URL de nodo se clasifica por su último segmento (regla de oro) y el contenido se
obtiene de la **página completa del nodo** (`/es/commentaries/…`), extrayendo el bloque
`<div class="content">`.

---

## 3. Cómo se vigila cada comentario (control de calidad)

Antes de insertar, y en cada verificación posterior, se comprueba:

1. **Norma cumplida**: el rango de la URL del nodo corresponde a la tabla de destino
   (single → `comments` / multi → `range_comments`).
2. **Formato JSON válido**: `[ [segmentos…], … ]` por párrafo.
3. **Sin HTML crudo**: el texto no debe contener `<` tras la limpieza (si aparece, se
   re-parsea con `fixCommentJson`).
4. **Sin trunques**: el contenido extraído no debe terminar cortado (mínimo ~20 chars,
   y debe cerrar el último párrafo).
5. **Dedupe**: los ids son deterministas (`INSERT OR REPLACE` re-importable sin duplicar;
   los nodos rango ya existentes se omiten).

---

## 4. Estado actual (aprobado)

Fuente inspeccionada el 2026-09-16. `db_version = 1531`.

**Génesis LIBRO 1 COMPLETO**: 15.432 comentarios de versículo único repartidos entre los
1.532 versículos (Gén 1:1 – 50:26), 2.968 rangos en `range_comments`, 0 duplicados, 0 JSON
inválido.

| capítulo | versículos con datos | comments | rangos |
|:--------:|:--------------------:|:--------:|:------:|
|    1     |          31          |   345    |  109   |
|    2     |          25          |   333    |   78   |
|    3     |          24          |   342    |   73   |
|    4     |          26          |   383    |   70   |
|    5     |          32          |   267    |   41   |
|    6     |          22          |   317    |   59   |
|    7     |          24          |   235    |   49   |
|    8     |          22          |   243    |   56   |
|    9     |          29          |   340    |   60   |
|   10     |          32          |   321    |   43   |
|   11     |          32          |   300    |   56   |
|   12     |          20          |   282    |   56   |
|   13     |          18          |   226    |   55   |
|   14     |          24          |   284    |   62   |
|   15     |          21          |   284    |   46   |
|   16     |          16          |   212    |   43   |
|   17     |          27          |   296    |   59   |
|   18     |          33          |   353    |   61   |
|   19     |          38          |   434    |   88   |
|   20     |          18          |   223    |   37   |
|   21     |          34          |   381    |   64   |
|   22     |          24          |   300    |   56   |
|   23     |          20          |   221    |   40   |
|   24     |          67          |   580    |   92   |
|   25     |          34          |   375    |   81   |
|   26     |          35          |   371    |   63   |
|   27     |          46          |   424    |   76   |
|   28     |          22          |   266    |   51   |
|   29     |          35          |   360    |   63   |
|   30     |          43          |   399    |  55   |
|   31     |          55          |   476    |  78   |
|   32     |          32          |   339    |  70   |
|   33     |          19          |   192    |  41   |
|   34     |          31          |   257    |  50   |
|   35     |          29          |   299    |  55   |
|   36     |          43          |   267    |  46   |
|   37     |          36          |   314    |  70   |
|   38     |          30          |   233    |  40   |
|   39     |          23          |   183    |  48   |
|   40     |          23          |   204    |  48   |
|   41     |          57          |   474    |  83   |
|   42     |          38          |   328    |  63   |
|   43     |          34          |   270    |  62   |
|   44     |          34          |   214    |  49   |
|   45     |          28          |   275    |  59   |
|   46     |          34          |   252    |  42   |
|   47     |          31          |   294    |  56   |
|   48     |          22          |   229    |  47   |
|   49     |          33          |   393    |  69   |
|   50     |          26          |   242    |  50   |

- **Capítulos 11–20**: sin comentaristas nuevos; todos los nombres ya catalogados en
  `THEOLOGIANS`. Corregido 1 fila heredada de `Notas al Margen en la Versión King James (1611)`
  (id 369) con nombre corrupto (`Versi?n`) en 1:5; ahora 105 filas con nombre correcto.
- Nota: los nodos con rango inválido `Cambridge (0-19)` en cap.18 dan HTTP 404 — parcheados en
  el scraper (salta `start < 1`). No se pierde contenido: el rango válido `Cambridge (16-33)` sí
  se almacena.
- **Capítulos 21–30**: sin comentaristas nuevos ni nombres corruptos; los 50 nombres distintos en
  BD coinciden 1:1 con `THEOLOGIANS`. Nada que limpiar.
- **Capítulos 31–50** (2026-09-16): 5.735 comments nuevos y 1.126 rangos → libro Génesis cerrado.
  `db_version` real **1531** (881 + 650 corridas que insertaron; 8 corridas insertaron 0 filas).
  Cobertura completa (0 versículos sin ningún nodo); 0 duplicados; 0 JSON inválido; ningún
  comentarista nuevo (siguen siendo los 50 de `THEOLOGIANS`). Los 4 versículos 37:18-21 quedaron
  cubiertos solo por rangos (26 nodos rango), sin comentario de versículo único — consistente con
  la regla de oro.

Historial de comentaristas nuevos y limpiezas (caps.1–10):
- **Horae Homileticae de Charles Simeon** (id 169; versículo único en 3:4, 3:15, 4:26, 5:24 +
  rangos) y **Comentario de Sutcliffe sobre el Antiguo y el Nuevo Testamento** (id 181; solo
  rangos de capítulo: 1-25, 1-26, 1-32), agregados a `THEOLOGIANS` y renombrados con su nombre real.
- Limpieza (caps.1–5): eliminadas las 2 filas heredadas de `1-3-15` (`c-1-3-15-cal`,
  `c-1-3-15-mh`), que estaban en HTML crudo y la de Calvino duplicaba el nodo canónico; y
  corregido el nombre "B. W. Johnson" que quedó con un byte corrupto en los 6 registros del
  cap.1 (ahora todos a "Comentario bíblico de B. W. Johnson", 32 filas).
- Limpieza (caps.1–5): eliminadas las 2 filas heredadas de `1-3-15` (`c-1-3-15-cal`,
  `c-1-3-15-mh`), que estaban en HTML crudo y la de Calvino duplicaba el nodo canónico; y
  corregido el nombre "B. W. Johnson" que quedó con un byte corrupto en los 6 registros del
  cap.1 (ahora todos a "Comentario bíblico de B. W. Johnson", 32 filas).
- ⚠️ Legado histórico en **Juan** (fuera de alcance): 8 filas en HTML crudo en
  `43-1-1` (3), `43-1-14` (2) y `43-3-16` (3) — revisarlas al procesar Juan.

### Génesis 1:1 — COMPLETO y PERFECTO (24 + 19)

**`comments` (24)** — versículo único:

BibliaPlus, Jamieson Fausset y Brown, Juan Calvino, Adam Clarke, Albert Barnes, John Gill,
Scofield, George Haydock, Comentario bíblico del sermón (1:1), John Trapp, Coke, Ellicott
(1:1), Biblia de Estudio de Ginebra, Peter Pett, James Nisbet, Kretzmann (1:1), Cuando los
críticos preguntan, ETCBC (1:1), El ilustrador bíblico, Hawker's Poor man's, Darby, Wesley,
College Press y Tesoro del conocimiento.

(Ver listas exactas en `scripts/import-commentary-gen1-1.js`.)

**`range_comments` (19)** — no mostrados en la tarjeta:

Matthew Henry (1-2), Comentario del Púlpito (1-2), Spurgeon (1-31), Chuck Smith (1-8),
A.C. Gaebelein (1-31), Nicoll/Expositor (1-31), JFB Conciso (1-31), Arthur Peake (1-4),
Dummelow (1-31), F.B. Meyer (1-5), Leslie Grant (1-31), Pozos de agua viva (1-5),
Gary Hampton (1-26), William Kelly (1-31), Homilético (1-2), G. Campbell Morgan (1-31),
Cambridge (1-5), C.H. Mackintosh (1-31) y John Darby Sinopsis (1-31).

### Génesis 1:2 — COMPLETO (20 + 4 nuevos)

**`comments` (20)** — todos nodos `…/genesis/1/2`:

JFB, Juan Calvino, Adam Clarke, Albert Barnes, John Gill, Scofield, George Haydock,
John Trapp, Coke, Joseph Benson, Biblia de Estudio de Ginebra, Peter Pett, ETCBC,
El ilustrador bíblico, Hawker's Poor man's, Bullinger, Jonathan Edwards, Darby, Wesley
y Tesoro del conocimiento.

**`range_comments` nuevos (4):**

Comentario bíblico del sermón (1-31), Ellicott (1-31), Kretzmann (1-5),
College Press (2-5).

*(Los demás rangos detectados en la página de 1:2 ya existían de la pasada de 1:1 y no se
duplican.)*

### Génesis 1:3 — COMPLETO (17 + 4 nuevos)

**`comments` (17)** — todos nodos `…/genesis/1/3`:

JFB, Juan Calvino, Adam Clarke, John Gill, Scofield, George Haydock, John Trapp, Coke,
Joseph Benson, Biblia de Estudio de Ginebra, Peter Pett, James Nisbet, ETCBC,
Hawker's Poor man's, Bullinger, Wesley y Tesoro del conocimiento.

**`range_comments` nuevos (4):**

Matthew Henry (3-5), Albert Barnes (3-5), Homilético Completo del Predicador (3-5),
El ilustrador bíblico (3-4).

### Génesis 1:4 — COMPLETO (10 + 3 nuevos)

**`comments` (10)** — todos nodos `…/genesis/1/4`:

Juan Calvino, Adam Clarke, John Gill, George Haydock, John Trapp, Coke, Joseph Benson,
ETCBC, Bullinger y Tesoro del conocimiento.

**`range_comments` nuevos (3):**

Jamieson, Fausset y Brown (4-5), Peter Pett (4-5), Hawker's Poor man's (4-5).

### Génesis 1:5 — COMPLETO (13 + 1 nuevo)

**`comments` (13)** — todos nodos `…/genesis/1/5`:

Juan Calvino, John Gill, Scofield, John Trapp, Coke, Joseph Benson, James Nisbet, ETCBC,
El ilustrador bíblico, Notas al Margen en la Versión King James (1611), Bullinger, Darby
y Tesoro del conocimiento.

**`range_comments` nuevos (1):**

Arthur Peake (1-5).

*(Nota: un mismo teólogo puede tener varios nodos con rangos distintos, p. ej.
Peake tiene un nodo (1-4) y otro (1-5); son dos nodos reales del sitio, no duplicados.)*

### Génesis 1:6 — 1:31 — COMPLETO (resumen)

Extraído con `node scripts/scrape-commentaries.js genesis 1 {6..31}` (5 de seguridad: 0 errores,
0 duplicados). Total 345 comments en 31 versículos y 109 `range_comments`.

- Commentaristas nuevos descubiertos en estos versículos:
  - **BibliaPlus** (id 999) — introducción de BibliaPlus en 1:26 y 1:27 (solo esos versículos lo tienen).
  - **Comentario bíblico de B. W. Johnson** (id 231) — presente en 1:26–1:31; se renombró en BD
    y se agregó al mapa `THEOLOGIANS` del scraper con su nombre real.
- Limpieza puntual: se eliminaron 2 filas duplicadas heredadas de `1-1-26` (`c-1-1-26-cal`,
  `c-1-1-26-mh`). La de Matthew Henry violaba la regla de oro (su nodo en 26 es el rango 26-28,
  ya guardado en `range_comments`).
- Rangos relevantes no singulares: JFB (14-19, 20-23, 24-31…), Matthew Henry (14-19, 20-25), Albert
  Barnes (14-19, 20-23, 24-31), El ilustrador bíblico (14-19, 20-23, 24-25, 26-27, 29-30),
  Homilético (14-19, 20-23, 21-28, 29-31), entre otros — todos en `range_comments`.

---

## 5. Formato de almacenamiento

### `comments`

```
id          TEXT PK   →  gen{bookId}-{ch}-{v}-{slug-del-teólogo}
verse_id    TEXT      →  "{bookId}-{ch}-{v}"  (FOREIGN KEY → verses.id)
theologian  TEXT
text        TEXT      →  JSON de párrafos
```

### `range_comments`

```
id          TEXT PK   →  range-{bookId}-{ch}-{start}-{end}-{slug-del-teólogo}
book_id / chapter / start_verse / end_verse
theologian  TEXT
text        TEXT      →  JSON de párrafos
```

### JSON de párrafos

```jsonc
[
  [["b","Significado."], " En el principio, Dios crea de la nada…"],
  ["Texto plano", ["i","cosas en cursiva"], "."],
  [["b","Título"], " cuerpo…"]        // párrafo-título cuando TODO es negrita
]
```

Cada segmento es un `string` o `["b"|"i", inner]` (inner puede ser string o sublista).

---

## 6. Presentación visual (IMPORTANTE)

- **El texto almacenado es SAGRADO**: nunca se modifica, reordena ni resume. Solo se
  *estiliza* al renderizar (`SimpleHTML.tsx`).
- Negrita → fuente serif bold; cursiva → serif italic; párrafos separados con aire.
- Un párrafo compuesto **solo** por negritas se trata como **encabezado** (p. ej.
  "LA SEMANA CREATIVA…" de Ellicott, "VER. 1.").
- Integridad: antes/después de cualquier cambio de presentación se verifica que el hash
  del JSON almacenado no cambie.

---

## 7. Pipeline y scripts

| Script | Función |
|---|---|
| `scripts/scrape-commentaries.js` | Scraper generalizado: descubre nodos (página + `verse-ajax/more`), aplica la norma y escribe `comments`/`range_comments`. Uso: `node scripts/scrape-commentaries.js {libro} {cap} {ver}` |
| `scripts/import-commentary-gen1-1.js` | Histórico: versión manual/codificada de Génesis 1:1 (helpers reutilizables: `extractHTMLContent`, `htmlToJSON`, `parseInline`, `cleanSegments`, `parseRange`, `fetchWithRetry`). |
| `scripts/migrate-comments-v4.js` | Histórico: movió los 19 rangos de 1:1 fuera de `comments`. |
| `scripts/fix-comment-html-v5.js` | Histórico: sanitiza JSON con HTML crudo residual (`fixCommentJson`). |

Al terminar cualquier corrida que inserte filas: se incrementa `db_version` en `_metadata`
**y** se actualiza la versión esperada en `App.tsx` (actual: `'12'`), para forzar el
reimport en el dispositivo.

---

## 8. Protocolo de ejecución ("haz como Génesis 1:1 para X")

1. Leer este documento.
2. Correr `node scripts/scrape-commentaries.js {libro-url} {cap} {ver}` (p. ej. `genesis 1 2`).
3. El script: descubre nodos, clasifica por la regla de oro, guarda JSON, omite duplicados,
   e incrementa `db_version` si escribió algo.
4. Actualizar la versión esperada en `App.tsx` al nuevo `db_version` (debe coincidir).
5. **Sondeo de verificación** (igual que para 1:1 y 1:2):
   - `comments` del versículo: todos con `verse_id` correcto, 0 rangos, JSON válido.
   - `range_comments` del capítulo: rangos correctos y la suma (únicos + rangos) coincide
     con el total de nodos del sitio para ese versículo.
6. Actualizar la tabla de "Estado actual" de este documento.

**Alcance final:** TODA la Biblia (66 libros), por tandas: libro → capítulo → versículos.
Al completar cada tanda se actualiza este documento y se avisa al usuario.