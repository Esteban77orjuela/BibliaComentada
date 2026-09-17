// ============================================================
// BibliaPlus — Scraper generalizado de comentarios  (v1)
// Uso: node scripts/scrape-commentaries.js {libro} {capitulo} {versiculo}
// Ejemplo: node scripts/scrape-commentaries.js genesis 1 2
//
// Regla de oro (docs/COMENTARIOS.md):
//   - Nodo de UN solo versículo            -> comments
//   - Nodo que cubre MÁS de un versículo   -> range_comments
//
// Descubrimiento: página del versículo (10 tarjetas) + AJAX verse-ajax/more.
// El contenido se extrae de la página completa del nodo (<div class="content">).
// Si escribe filas nuevas, incrementa _metadata.db_version (y hay que actualizar
// la versión esperada en App.tsx).
// ============================================================

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');
const BASE = 'https://www.bibliaplus.org';

// Slugs de libro usados por bibliaplus.org (solo 'genesis' está verificado en sitio;
// verificar cada slug al usarlo por primera vez).
const BOOKS = {
  genesis: { id: 1, name: 'Génesis' },
  exodo: { id: 2, name: 'Éxodo' },
  levitico: { id: 3, name: 'Levítico' },
  numeros: { id: 4, name: 'Números' },
  deuteronomio: { id: 5, name: 'Deuteronomio' },
  josue: { id: 6, name: 'Josué' },
  jueces: { id: 7, name: 'Jueces' },
  rut: { id: 8, name: 'Rut' },
  '1-samuel': { id: 9, name: '1 Samuel' },
  '2-samuel': { id: 10, name: '2 Samuel' },
  '1-reyes': { id: 11, name: '1 Reyes' },
  '2-reyes': { id: 12, name: '2 Reyes' },
  '1-cronicas': { id: 13, name: '1 Crónicas' },
  '2-cronicas': { id: 14, name: '2 Crónicas' },
  esdras: { id: 15, name: 'Esdras' },
  nehemias: { id: 16, name: 'Nehemías' },
  ester: { id: 17, name: 'Ester' },
  job: { id: 18, name: 'Job' },
  salmos: { id: 19, name: 'Salmos' },
  proverbios: { id: 20, name: 'Proverbios' },
  eclesiastes: { id: 21, name: 'Eclesiastés' },
  cantares: { id: 22, name: 'Cantares' },
  isaias: { id: 23, name: 'Isaías' },
  jeremias: { id: 24, name: 'Jeremías' },
  lamentaciones: { id: 25, name: 'Lamentaciones' },
  ezequiel: { id: 26, name: 'Ezequiel' },
  daniel: { id: 27, name: 'Daniel' },
  oseas: { id: 28, name: 'Oseas' },
  joel: { id: 29, name: 'Joel' },
  amos: { id: 30, name: 'Amós' },
  abdias: { id: 31, name: 'Abdías' },
  jonas: { id: 32, name: 'Jonás' },
  miqueas: { id: 33, name: 'Miqueas' },
  nahum: { id: 34, name: 'Nahúm' },
  habacuc: { id: 35, name: 'Habacuc' },
  sofonias: { id: 36, name: 'Sofonías' },
  ageo: { id: 37, name: 'Ageo' },
  zacarias: { id: 38, name: 'Zacarías' },
  malaquias: { id: 39, name: 'Malaquías' },
  mateo: { id: 40, name: 'Mateo' },
  marcos: { id: 41, name: 'Marcos' },
  lucas: { id: 42, name: 'Lucas' },
  juan: { id: 43, name: 'Juan' },
  hechos: { id: 44, name: 'Hechos' },
  romanos: { id: 45, name: 'Romanos' },
  '1-corintios': { id: 46, name: '1 Corintios' },
  '2-corintios': { id: 47, name: '2 Corintios' },
  galatas: { id: 48, name: 'Gálatas' },
  efesios: { id: 49, name: 'Efesios' },
  filipenses: { id: 50, name: 'Filipenses' },
  colosenses: { id: 51, name: 'Colosenses' },
  '1-tesalonicenses': { id: 52, name: '1 Tesalonicenses' },
  '2-tesalonicenses': { id: 53, name: '2 Tesalonicenses' },
  '1-timoteo': { id: 54, name: '1 Timoteo' },
  '2-timoteo': { id: 55, name: '2 Timoteo' },
  tito: { id: 56, name: 'Tito' },
  filemon: { id: 57, name: 'Filemón' },
  hebreos: { id: 58, name: 'Hebreos' },
  santiago: { id: 59, name: 'Santiago' },
  '1-pedro': { id: 60, name: '1 Pedro' },
  '2-pedro': { id: 61, name: '2 Pedro' },
  '1-juan': { id: 62, name: '1 Juan' },
  '2-juan': { id: 63, name: '2 Juan' },
  '3-juan': { id: 64, name: '3 Juan' },
  judas: { id: 65, name: 'Judas' },
  apocalipsis: { id: 66, name: 'Apocalipsis' },
};

const THEOLOGIANS = {
  999: 'BibliaPlus',
  1: 'Jamieson, Fausset y Brown',
  3: 'Juan Calvino',
  2: 'Matthew Henry',
  7: 'Adam Clarke',
  4: 'Albert Barnes',
  5: 'Comentario del Púlpito',
  8: 'John Gill',
  9: 'Charles Spurgeon',
  6: 'Scofield',
  267: 'Chuck Smith',
  79: 'A.C. Gaebelein',
  103: 'George Haydock',
  73: 'Nicoll (Expositor)',
  163: 'Comentario bíblico del sermón',
  193: 'John Trapp',
  10: 'JFB Conciso',
  145: 'Arthur Peake',
  63: 'Coke',
  54: 'Dummelow',
  67: 'Ellicott',
  121: 'Frederick Brotherton Meyer',
  57: 'Joseph Benson',
  85: 'Biblia de Estudio de Ginebra',
  91: 'Leslie M. Grant',
  139: 'Peter Pett',
  175: 'James Nisbet',
  115: 'Kretzmann',
  133: 'Pozos de agua viva',
  351: 'Gary Hampton',
  501: 'Cuando los críticos preguntan',
  321: 'ETCBC',
  363: 'William Kelly',
  157: 'Homilético Completo del Predicador',
  187: 'El ilustrador bíblico',
  127: 'G. Campbell Morgan',
  97: "Hawker's Poor man's",
  255: 'Cambridge',
  60: 'Bullinger',
  303: 'Jonathan Edwards',
  297: 'Darby',
  205: 'Wesley',
  369: 'Notas al Margen en la Versión King James (1611)',
  231: 'Comentario bíblico de B. W. Johnson',
  169: 'Horae Homileticae de Charles Simeon',
  181: 'Comentario de Sutcliffe sobre el Antiguo y el Nuevo Testamento',
  405: 'Charles Henry Mackintosh',
  273: 'College Press',
  285: 'John Darby (Sinopsis)',
  199: 'Tesoro del conocimiento',
};

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; BiblePlusApp/1.0)' };

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function humanizeSlug(slug) {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function parseRange(last) {
  const m = last.match(/^(\d+)(?:[,\-](\d+))?$/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : start;
  return { start, end };
}

async function fetchWithRetry(url, retries = 3, extraHeaders = {}) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url, {
        headers: { ...UA, ...extraHeaders },
        signal: AbortSignal.timeout(20000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.text();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function extractHTMLContent(html) {
  const contentMatch = html.match(/<div class="content">([\s\S]*?)<\/div>\s*(?:<div class="share"|<\/article|<nav class="nav_buttons"|$)/);
  if (!contentMatch) return null;
  let text = contentMatch[1];
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#039;/g, "'");
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/<a\s+class="bible"[^>]*>/g, '');
  text = text.replace(/<\/a>/g, '');
  text = text.trim();
  return text;
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/\u200B|\u200C|\u200D/g, '');
}

function parseInline(text) {
  const segments = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] !== '<') {
      const nextIdx = text.indexOf('<', i);
      const chunk = nextIdx !== -1 ? text.slice(i, nextIdx) : text.slice(i);
      if (chunk) segments.push(chunk);
      i = nextIdx !== -1 ? nextIdx : text.length;
      continue;
    }
    const closeIdx = text.indexOf('>', i);
    if (closeIdx === -1) { segments.push(text.slice(i)); break; }
    const raw = text.slice(i + 1, closeIdx);
    const tagName = raw.split(/\s/)[0].toLowerCase();

    if (tagName === 'strong' || tagName === 'b') {
      const endTag = `</${tagName}>`;
      const end = text.indexOf(endTag, closeIdx + 1);
      const inner = end !== -1 ? text.slice(closeIdx + 1, end) : text.slice(closeIdx + 1);
      const parsed = cleanSegments(parseInline(decodeEntities(inner)));
      if (parsed.length === 1 && typeof parsed[0] === 'string') {
        segments.push(['b', parsed[0]]);
      } else if (parsed.length > 0) {
        segments.push(['b', parsed]);
      }
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'em' || tagName === 'i') {
      const endTag = `</${tagName}>`;
      const end = text.indexOf(endTag, closeIdx + 1);
      const inner = end !== -1 ? text.slice(closeIdx + 1, end) : text.slice(closeIdx + 1);
      const parsed = cleanSegments(parseInline(decodeEntities(inner)));
      if (parsed.length === 1 && typeof parsed[0] === 'string') {
        segments.push(['i', parsed[0]]);
      } else if (parsed.length > 0) {
        segments.push(['i', parsed]);
      }
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'br') {
      segments.push('\n');
      i = closeIdx + 1;
      continue;
    }
    i = closeIdx + 1;
  }
  return cleanSegments(segments);
}

function cleanSegments(segs) {
  const out = [];
  for (const s of segs) {
    if (typeof s === 'string') {
      if (!s.trim()) continue;
      out.push(s);
    } else {
      const inner = s[1];
      const isEmpty = Array.isArray(inner) ? inner.length === 0 : !inner.trim();
      if (isEmpty) continue;
      out.push(s);
    }
  }
  const merged = [];
  for (const s of out) {
    const last = merged[merged.length - 1];
    if (typeof s === 'string' && typeof last === 'string') {
      merged[merged.length - 1] = last + s;
    } else if (Array.isArray(s) && Array.isArray(last) && last[0] === s[0]) {
      const prevInner = last[1];
      const curInner = s[1];
      merged[merged.length - 1] = [s[0], prevInner + (typeof curInner === 'string' ? curInner : '')];
    } else {
      merged.push(s);
    }
  }
  return merged;
}

function fixParagraph(paragraph) {
  if (!Array.isArray(paragraph)) return paragraph;
  const out = [];
  for (const seg of paragraph) {
    if (typeof seg === 'string') {
      if (seg.indexOf('<') !== -1) {
        out.push(...cleanSegments(parseInline(decodeEntities(seg))));
      } else {
        out.push(seg);
      }
    } else if (Array.isArray(seg) && typeof seg[1] === 'string' && seg[1].indexOf('<') !== -1) {
      const parsed = cleanSegments(parseInline(decodeEntities(seg[1])));
      if (parsed.length === 1 && typeof parsed[0] === 'string') out.push([seg[0], parsed[0]]);
      else if (parsed.length > 0) out.push([seg[0], parsed]);
    } else {
      out.push(seg);
    }
  }
  return cleanSegments(out);
}

function fixCommentJson(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    if (!Array.isArray(parsed)) return jsonText;
    const fixed = parsed.map((p) => (Array.isArray(p) ? fixParagraph(p) : p));
    return JSON.stringify(fixed);
  } catch {
    return jsonText;
  }
}

function htmlToJSON(html) {
  const paragraphs = [];
  const pRegex = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = pRegex.exec(html)) !== null) {
    const inner = match[1].trim();
    if (!inner) continue;
    paragraphs.push(parseInline(inner));
  }
  if (paragraphs.length === 0) {
    const plain = html.replace(/<[^>]+>/g, '').trim();
    if (plain) paragraphs.push([plain]);
  }
  return JSON.stringify(paragraphs);
}

function collectNodeUrls(html) {
  const urls = [];
  const re = /https:\/\/www\.bibliaplus\.org\/\/?es\/commentaries\/\d+\/[^"<]+/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const clean = m[0].replace(/\/\//g, '/');
    if (clean.includes('es/commentaries/')) urls.push(clean);
  }
  return urls;
}

async function discover(bookSlug, chapter, verse) {
  const base = `${BASE}/es/${bookSlug}/${chapter}/${verse}`;
  const page = await fetchWithRetry(base);
  const initial = collectNodeUrls(page);

  const moreMatch = page.match(/data-more-url="([^"]+)"/);
  let more = [];
  if (moreMatch) {
    const moreHtml = await fetchWithRetry(moreMatch[1], 3, { 'X-Requested-With': 'XMLHttpRequest' });
    more = collectNodeUrls(moreHtml);
  }
  return { initial, more, all: [...new Set([...initial, ...more])] };
}

function parseNodeUrl(url) {
  const idMatch = url.match(/commentaries\/(\d+)\//);
  if (!idMatch) return null;
  const id = parseInt(idMatch[1], 10);
  const segments = url.split('/').filter(Boolean); // [es, commentaries, id, slug, book, ch, range]
  const range = parseRange(segments[segments.length - 1]);
  const theologian = THEOLOGIANS[id] || humanizeSlug(segments[5]);
  return { id, theologian, range, url };
}

async function main() {
  const [bookSlugArg, chapterArg, verseArg] = process.argv.slice(2);
  if (!bookSlugArg || !chapterArg || !verseArg) {
    console.error('Uso: node scripts/scrape-commentaries.js {libro} {capitulo} {versiculo}');
    process.exit(1);
  }
  const bookSlug = bookSlugArg.trim();
  const chapter = parseInt(chapterArg, 10);
  const verse = parseInt(verseArg, 10);
  const book = BOOKS[bookSlug];
  if (!book) {
    console.error(`Libro desconocido: ${bookSlug}. Añádelo al mapa BOOKS (verificando su slug en el sitio).`);
    process.exit(1);
  }

  const SQL = await initSqlJs();
  if (!fs.existsSync(DB_PATH)) {
    console.error('bible.db not found');
    process.exit(1);
  }
  const db = new SQL.Database(fs.readFileSync(DB_PATH));

  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY, verse_id TEXT NOT NULL, theologian TEXT NOT NULL, text TEXT NOT NULL,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS range_comments (
    id TEXT PRIMARY KEY, book_id INTEGER NOT NULL, chapter INTEGER NOT NULL,
    start_verse INTEGER NOT NULL, end_verse INTEGER NOT NULL,
    theologian TEXT NOT NULL, text TEXT NOT NULL
  )`);
  db.run('CREATE TABLE IF NOT EXISTS _metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)');

  const verseId = `${book.id}-${chapter}-${verse}`;
  console.log(`Objetivo: ${book.name} ${chapter}:${verse} (book_id=${book.id}, verse_id=${verseId})`);
  console.log('Descubriendo nodos…');
  const { initial, more, all } = await discover(bookSlug, chapter, verse);
  console.log(`  tarjetas iniciales: ${initial.length}, AJAX: ${more.length}, total únicos: ${all.length}`);

  const hasRow = (row) => (Array.isArray(row) ? row.length > 0 : !!row);
  const existsComment = (id) => {
    const stmt = db.prepare('SELECT 1 FROM comments WHERE id = ?');
    const row = stmt.get([id]);
    stmt.free();
    return hasRow(row);
  };
  const existsRange = (id) => {
    const stmt = db.prepare('SELECT 1 FROM range_comments WHERE id = ?');
    const row = stmt.get([id]);
    stmt.free();
    return hasRow(row);
  };
  const commentsAdded = [];
  const rangesAdded = [];
  const skipped = [];
  const errors = [];
  let inserted = 0;

  for (const url of all) {
    const node = parseNodeUrl(url);
    if (!node || !node.range) {
      console.log(`  BAD URL: ${url}`);
      errors.push(url);
      continue;
    }
    if (node.range.start < 1) {
      console.log(`  SKIP ${node.theologian} (rango inválido ${node.range.start}-${node.range.end}: no existe versículo 0)`);
      skipped.push(url);
      continue;
    }
    const isSingle = node.range.start === node.range.end;
    const label = node.theologian;

    if (isSingle) {
      const commentId = `gen${book.id}-${chapter}-${verse}-${slugify(node.theologian)}`;
      if (existsComment(commentId)) {
        skipped.push(commentId);
        continue;
      }
      process.stdout.write(`  FETCH ${label} (${commentId})… `);
      try {
        const rawHtml = await fetchWithRetry(node.url);
        const content = extractHTMLContent(rawHtml);
        if (!content || content.trim().length < 20) {
          process.stdout.write('EMPTY\n');
          errors.push(url);
        } else {
          let json = htmlToJSON(content);
          if (json.indexOf('<') !== -1) json = fixCommentJson(json);
          db.run('INSERT OR REPLACE INTO comments (id, verse_id, theologian, text) VALUES (?, ?, ?, ?)',
            [commentId, verseId, node.theologian, json]);
          commentsAdded.push(node.theologian);
          inserted++;
          process.stdout.write(`OK (${json.length} chars)\n`);
        }
      } catch (err) {
        process.stdout.write(`ERROR: ${err.message}\n`);
        errors.push(url);
      }
    } else {
      const rangeId = `range-${book.id}-${chapter}-${node.range.start}-${node.range.end}-${slugify(node.theologian)}`;
      if (existsRange(rangeId)) {
        skipped.push(rangeId);
        continue;
      }
      process.stdout.write(`  FETCH ${label} (${node.range.start}-${node.range.end})… `);
      try {
        const rawHtml = await fetchWithRetry(node.url);
        const content = extractHTMLContent(rawHtml);
        if (!content || content.trim().length < 20) {
          process.stdout.write('EMPTY\n');
          errors.push(url);
        } else {
          let json = htmlToJSON(content);
          if (json.indexOf('<') !== -1) json = fixCommentJson(json);
          db.run('INSERT OR REPLACE INTO range_comments (id, book_id, chapter, start_verse, end_verse, theologian, text) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [rangeId, book.id, chapter, node.range.start, node.range.end, node.theologian, json]);
          rangesAdded.push(`${node.theologian} (${node.range.start}-${node.range.end})`);
          inserted++;
          process.stdout.write(`OK (${json.length} chars)\n`);
        }
      } catch (err) {
        process.stdout.write(`ERROR: ${err.message}\n`);
        errors.push(url);
      }
    }

    await new Promise((r) => setTimeout(r, 1200));
  }

  let newVersion = null;
  if (inserted > 0) {
    const v = db.exec("SELECT value FROM _metadata WHERE key = 'db_version'");
    const current = v.length ? parseInt(v[0].values[0][0], 10) : 0;
    newVersion = String(current + 1);
    db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['db_version', newVersion]);
  }
  const today = new Date().toISOString().split('T')[0];
  db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['updated_at', today]);

  const outBuffer = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, outBuffer);

  console.log('\n=== RESUMEN ===');
  console.log(`comments añadidos (${commentsAdded.length}):`);
  commentsAdded.forEach((t) => console.log(`  - ${t}`));
  console.log(`range_comments añadidos (${rangesAdded.length}):`);
  rangesAdded.forEach((r) => console.log(`  - ${r}`));
  console.log(`omitidos ya existentes: ${skipped.length}`);
  console.log(`errores: ${errors.length}`);
  if (newVersion) console.log(`db_version: ${newVersion}  (actualizar App.tsx a esperar '${newVersion}')`);
  console.log(`DB size: ${(outBuffer.length / 1024 / 1024).toFixed(1)} MB`);

  db.close();
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});