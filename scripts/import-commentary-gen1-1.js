const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');

const VERSE_ID = '1-1-1';

const COMMENTARIES = [
  { id: 999, theologian: 'BibliaPlus', url: 'https://www.bibliaplus.org/es/commentaries/999/comentario-biblico-bibliaplus/genesis/1/1' },
  { id: 1, theologian: 'Jamieson, Fausset y Brown', url: 'https://www.bibliaplus.org/es/commentaries/1/comentario-critico-y-explicativo-de-toda-la-biblia/genesis/1/1' },
  { id: 3, theologian: 'Juan Calvino', url: 'https://www.bibliaplus.org/es/commentaries/3/comentario-biblico-de-juan-calvino/genesis/1/1' },
  { id: 2, theologian: 'Matthew Henry', url: 'https://www.bibliaplus.org/es/commentaries/2/comentario-biblico-de-matthew-henry/genesis/1/1,2' },
  { id: 7, theologian: 'Adam Clarke', url: 'https://www.bibliaplus.org/es/commentaries/7/comentario-biblico-de-adam-clarke/genesis/1/1' },
  { id: 4, theologian: 'Albert Barnes', url: 'https://www.bibliaplus.org/es/commentaries/4/comentario-biblico-de-albert-barnes/genesis/1/1' },
  { id: 5, theologian: 'Comentario del Púlpito', url: 'https://www.bibliaplus.org/es/commentaries/5/comentario-biblico-del-pulpito/genesis/1/1,2' },
  { id: 8, theologian: 'John Gill', url: 'https://www.bibliaplus.org/es/commentaries/8/comentario-biblico-de-john-gill/genesis/1/1' },
  { id: 9, theologian: 'Charles Spurgeon', url: 'https://www.bibliaplus.org/es/commentaries/9/comentario-biblico-de-spurgeon/genesis/1/1-31' },
  { id: 6, theologian: 'Scofield', url: 'https://www.bibliaplus.org/es/commentaries/6/comentario-biblico-scofield/genesis/1/1' },
  { id: 267, theologian: 'Chuck Smith', url: 'https://www.bibliaplus.org/es/commentaries/267/a-traves-de-la-biblia-serie-c2000-por-chuck-smith/genesis/1/1-8' },
  { id: 79, theologian: 'A.C. Gaebelein', url: 'https://www.bibliaplus.org/es/commentaries/79/biblia-anotada-por-ac-gabelein/genesis/1/1-31' },
  { id: 103, theologian: 'George Haydock', url: 'https://www.bibliaplus.org/es/commentaries/103/comentario-biblico-catolico-de-george-haydock/genesis/1/1' },
  { id: 73, theologian: 'Nicoll (Expositor)', url: 'https://www.bibliaplus.org/es/commentaries/73/comentario-biblico-del-expositor-nicoll/genesis/1/1-31' },
  { id: 163, theologian: 'Comentario bíblico del sermón', url: 'https://www.bibliaplus.org/es/commentaries/163/comentario-biblico-del-sermon/genesis/1/1' },
  { id: 193, theologian: 'John Trapp', url: 'https://www.bibliaplus.org/es/commentaries/193/comentario-completo-de-john-trapp/genesis/1/1' },
  { id: 10, theologian: 'JFB Conciso', url: 'https://www.bibliaplus.org/es/commentaries/10/comentario-critico-y-explicativo-de-toda-la-biblia-conciso/genesis/1/1-31' },
  { id: 145, theologian: 'Arthur Peake', url: 'https://www.bibliaplus.org/es/commentaries/145/comentario-de-arthur-peake-sobre-la-biblia/genesis/1/1-4' },
  { id: 63, theologian: 'Coke', url: 'https://www.bibliaplus.org/es/commentaries/63/comentario-de-coke-sobre-la-santa-biblia/genesis/1/1' },
  { id: 54, theologian: 'Dummelow', url: 'https://www.bibliaplus.org/es/commentaries/54/comentario-de-dummelow-sobre-la-biblia/genesis/1/1-31' },
  { id: 67, theologian: 'Ellicott', url: 'https://www.bibliaplus.org/es/commentaries/67/comentario-de-ellicott-sobre-toda-la-biblia/genesis/1/1' },
  { id: 121, theologian: 'Frederick Brotherton Meyer', url: 'https://www.bibliaplus.org/es/commentaries/121/comentario-de-frederick-brotherton-meyer/genesis/1/1-5' },
  { id: 85, theologian: 'Biblia de Estudio de Ginebra', url: 'https://www.bibliaplus.org/es/commentaries/85/comentario-de-la-biblia-de-estudio-de-ginebra/genesis/1/1' },
  { id: 91, theologian: 'Leslie M. Grant', url: 'https://www.bibliaplus.org/es/commentaries/91/comentario-de-la-biblia-de-leslie-m-grant/genesis/1/1-31' },
  { id: 139, theologian: 'Peter Pett', url: 'https://www.bibliaplus.org/es/commentaries/139/comentario-de-peter-pett-sobre-la-biblia/genesis/1/1' },
  { id: 175, theologian: 'James Nisbet', url: 'https://www.bibliaplus.org/es/commentaries/175/comentario-del-pulpito-de-la-iglesia-de-james-nisbet/genesis/1/1' },
  { id: 115, theologian: 'Kretzmann', url: 'https://www.bibliaplus.org/es/commentaries/115/comentario-popular-de-la-biblia-de-kretzmann/genesis/1/1' },
  { id: 133, theologian: 'Pozos de agua viva', url: 'https://www.bibliaplus.org/es/commentaries/133/comentario-sobre-los-pozos-de-agua-viva/genesis/1/1-5' },
  { id: 351, theologian: 'Gary Hampton', url: 'https://www.bibliaplus.org/es/commentaries/351/comentarios-de-gary-hampton/genesis/1/1-26' },
  { id: 501, theologian: 'Cuando los críticos preguntan', url: 'https://www.bibliaplus.org/es/commentaries/501/cuando-los-criticos-preguntan-manual-popular-de-dificultades-biblicas/genesis/1/1' },
  { id: 321, theologian: 'ETCBC', url: 'https://www.bibliaplus.org/es/commentaries/321/datos-de-la-etcbc-sobre-la-biblia-hebrea/genesis/1/1' },
  { id: 363, theologian: 'William Kelly', url: 'https://www.bibliaplus.org/es/commentaries/363/discursos-introductorios-comentario-de-william-kelly/genesis/1/1-31' },
  { id: 157, theologian: 'Homilético Completo del Predicador', url: 'https://www.bibliaplus.org/es/commentaries/157/el-comentario-homiletico-completo-del-predicador/genesis/1/1,2' },
  { id: 187, theologian: 'El ilustrador bíblico', url: 'https://www.bibliaplus.org/es/commentaries/187/el-ilustrador-biblico/genesis/1/1' },
  { id: 127, theologian: 'G. Campbell Morgan', url: 'https://www.bibliaplus.org/es/commentaries/127/exposicion-de-g-campbell-morgan-sobre-toda-la-biblia/genesis/1/1-31' },
  { id: 97, theologian: "Hawker's Poor man's", url: 'https://www.bibliaplus.org/es/commentaries/97/hawkers-poor-mans-comentario/genesis/1/1' },
  { id: 255, theologian: 'Cambridge', url: 'https://www.bibliaplus.org/es/commentaries/255/la-biblia-de-cambridge-para-escuelas-y-colegios/genesis/1/1-5' },
  { id: 297, theologian: 'Darby', url: 'https://www.bibliaplus.org/es/commentaries/297/notas-de-la-traduccion-de-darby-1890/genesis/1/1' },
  { id: 205, theologian: 'Wesley', url: 'https://www.bibliaplus.org/es/commentaries/205/notas-explicativas-de-wesley/genesis/1/1' },
  { id: 405, theologian: 'Charles Henry Mackintosh', url: 'https://www.bibliaplus.org/es/commentaries/405/notas-sobre-el-pentateuco-de-charles-henry-mackintosh/genesis/1/1-31' },
  { id: 273, theologian: 'College Press', url: 'https://www.bibliaplus.org/es/commentaries/273/serie-de-libros-de-estudio-de-la-biblia-de-college-press/genesis/1/1' },
  { id: 285, theologian: 'John Darby (Sinopsis)', url: 'https://www.bibliaplus.org/es/commentaries/285/sinopsis-de-john-darby/genesis/1/1-31' },
  { id: 199, theologian: 'Tesoro del conocimiento', url: 'https://www.bibliaplus.org/es/commentaries/199/tesoro-del-conocimiento-de-las-escrituras/genesis/1/1' },
];

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
      segments.push(['b', inner]);
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'em' || tagName === 'i') {
      const endTag = `</${tagName}>`;
      const end = text.indexOf(endTag, closeIdx + 1);
      const inner = end !== -1 ? text.slice(closeIdx + 1, end) : text.slice(closeIdx + 1);
      segments.push(['i', inner]);
      i = end !== -1 ? end + endTag.length : text.length;
      continue;
    }
    if (tagName === 'br') {
      segments.push("\n");
      i = closeIdx + 1;
      continue;
    }
    i = closeIdx + 1;
  }
  return segments;
}

function generateId(theologian) {
  const slug = theologian.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `gen1-1-${slug}`;
}

function parseRange(url) {
  const last = url.split('/').filter(Boolean).pop();
  const m = last.match(/^(\d+)(?:[,\-](\d+))?$/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : start;
  return { start, end };
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BiblePlusApp/1.0)' },
        signal: AbortSignal.timeout(15000),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.text();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

async function main() {
  const SQL = await initSqlJs();

  if (!fs.existsSync(DB_PATH)) {
    console.error('bible.db not found. Run scripts/import-bible.js first.');
    process.exit(1);
  }

  const buffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(buffer);

  db.run(`CREATE TABLE IF NOT EXISTS range_comments (
    id TEXT PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    start_verse INTEGER NOT NULL,
    end_verse INTEGER NOT NULL,
    theologian TEXT NOT NULL,
    text TEXT NOT NULL
  )`);

  let imported = 0;
  let errors = 0;

  for (const c of COMMENTARIES) {
    const commentId = generateId(c.theologian);
    const range = parseRange(c.url);

    process.stdout.write(`  FETCH ${c.theologian}... `);
    try {
      const rawHtml = await fetchWithRetry(c.url);
      const htmlContent = extractHTMLContent(rawHtml);

      if (!htmlContent || htmlContent.length < 20) {
        process.stdout.write(`EMPTY\n`);
        errors++;
        continue;
      }

      const jsonContent = htmlToJSON(htmlContent);
      if (range && range.start === 1 && range.end === 1) {
        db.run(
          'INSERT OR REPLACE INTO comments (id, verse_id, theologian, text) VALUES (?, ?, ?, ?)',
          [commentId, VERSE_ID, c.theologian, jsonContent]
        );
      } else if (range) {
        const rangeId = `range-1-1-${range.start}-${range.end}-${commentId.replace('gen1-1-', '')}`;
        db.run(
          'INSERT OR REPLACE INTO range_comments (id, book_id, chapter, start_verse, end_verse, theologian, text) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [rangeId, 1, 1, range.start, range.end, c.theologian, jsonContent]
        );
      } else {
        process.stdout.write(`BAD URL\n`);
        errors++;
        continue;
      }
      process.stdout.write(`OK (${jsonContent.length} chars)\n`);
      imported++;
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
      errors++;
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  db.run('CREATE TABLE IF NOT EXISTS _metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL)');
  db.run("INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '4')");
  const today = new Date().toISOString().split('T')[0];
  db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['updated_at', today]);

  const outBuffer = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, outBuffer);

  console.log(`\nDone: ${imported} imported, ${errors} errors`);
  console.log(`DB size: ${(outBuffer.length / 1024 / 1024).toFixed(1)} MB`);
  console.log(`DB version: 4`);

  db.close();
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
