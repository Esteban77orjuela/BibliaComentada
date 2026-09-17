// ============================================================
// Importa traducciones CC (ONBV + PdDpt) desde USFM a bible.db
// - Reconstruye tabla verses con PRIMARY KEY (translation_id, id)
// - Parsea USFM: multilínea, "\\v 11-12", notas \\f descartadas
// - ONBV -> translation_id=2, PdDpt -> translation_id=3
// ============================================================
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DATA_ROOT = path.join(__dirname, 'data');
const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');

const USFM_ORDER = [
  'GEN','EXO','LEV','NUM','DEU','JOS','JDG','RUT','1SA','2SA','1KI','2KI',
  '1CH','2CH','EZR','NEH','EST','JOB','PSA','PRO','ECC','SNG','ISA','JER',
  'LAM','EZK','DAN','HOS','JOL','AMO','OBA','JON','MIC','NAM','HAB','ZEP',
  'HAG','ZEC','MAL','MAT','MRK','LUK','JHN','ACT','ROM','1CO','2CO','GAL',
  'EPH','PHP','COL','1TH','2TH','1TI','2TI','TIT','PHM','HEB','JAS','1PE',
  '2PE','1JN','2JN','3JN','JUD','REV',
];
const CODE_TO_ID = {};
USFM_ORDER.forEach((c, i) => { CODE_TO_ID[c] = i + 1; });

const SKIP_PREFIX = /^\\(s|ms|cl|mt|mr|d|r|h|toc|ide|rem|ip|io|imt|im|is|tr|tc)\d*\s*/;
const POETRY_LINE = /^\\q\d*\s*/;
const PARA_MARKER = /^\\(p|b|nb)\s*$/;
const VERSE_MARKER = /^\\v\s+(\d+)(?:-(\d+))?\s*(.*)$/;

function cleanInline(segment) {
  let out = String(segment);

  // Quitar lemas anidados de palabras (lo más interno primero)
  out = out.replace(/\\\+w\s*([^|\\]*)(?:\|[^\\]*)?\\\+w\*/g, '$1');
  out = out.replace(/\\w\s*([^|\\]*)(?:\|[^\\]*)?\\w\*/g, '$1');

  // Colapsar pares \+nd / \+add / \+wj ... (pueden anidarse)
  let prev;
  do { prev = out; out = out.replace(/\\\+\w+\s*([\s\S]*?)\\\+\w+\*/g, '$1'); } while (out !== prev);

  // Colapsar \wj ... \wj* , \nd ... \nd* , \add ... \add*
  for (const re of [/\\wj\s*([\s\S]*?)\\wj\*/g, /\\nd\s*([\s\S]*?)\\nd\*/g, /\\add\s*([\s\S]*?)\\add\*/g]) {
    let p;
    do { p = out; out = out.replace(re, '$1'); } while (out !== p);
  }

  // Normalizar "+" sobrante y limpiar marcadores sueltos
  out = out.replace(/\[\[|\]\]/g, ' ');
  out = out.replace(/\\\+/g, '\\');
  out = out.replace(/\\f.*?\\f\*/g, ' ');
  out = out.replace(/\\x.*?\\x\*/g, ' ');
  out = out.replace(/\\[a-z]+\d*/g, ' ');
  out = out.replace(/\\\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return out;
}

function parseBook(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const idMatch = raw.match(/^\\id\s+(\S+)/m);
  if (!idMatch) return null;
  const code = idMatch[1];
  const bookId = CODE_TO_ID[code];
  if (!bookId) return null;

  const verses = [];
  let chapter = 0;
  let current = null;

  const flush = (text) => {
    if (current && text) {
      verses.push({ bookId, chapter: current.chapter, verse: current.verse, text: cleanInline(text) });
    }
    current = null;
  };

  const lines = raw.split('\n');
  for (const line of lines) {
    const cm = line.match(/^\\c\s+(\d+)/);
    if (cm) { flush(current ? current.buffer : null); chapter = parseInt(cm[1], 10); continue; }

    const vm = line.match(VERSE_MARKER);
    if (vm) {
      flush(current ? current.buffer : null);
      current = { chapter, verse: parseInt(vm[1], 10), buffer: vm[3] };
      continue;
    }

    if (!current) continue;

    if (SKIP_PREFIX.test(line)) continue;
    if (PARA_MARKER.test(line)) continue;

    let append = line;
    const pm = line.match(POETRY_LINE);
    if (pm) append = line.replace(POETRY_LINE, '');
    append = append.trim();
    if (append) current.buffer = current.buffer ? current.buffer + ' ' + append : append;
  }
  flush(current ? current.buffer : null);
  return verses;
}

function parseDir(dirName) {
  const dir = path.join(DATA_ROOT, dirName);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.usfm'));
  files.sort();
  const all = [];
  for (const f of files) {
    const verses = parseBook(path.join(dir, f));
    if (verses && verses.length) {
      all.push(...verses);
      console.log(`  ${f.slice(0, 16)} -> ${verses.length} versos`);
    }
  }
  return all;
}

// Inserción multi-row en bloques de 500
function insertVersesBulk(db, translationId, records) {
  return new Promise((resolve, reject) => {
    const BATCH = 500;
    let i = 0;
    let dup = 0;
    const seen = new Set();
    db.serialize(() => {
      db.run('BEGIN');
      const nextBatch = () => {
        if (i >= records.length) {
          db.run('COMMIT', (err) => (err ? reject(err) : resolve({ dup })));
          return;
        }
        const batch = records.slice(i, i + BATCH);
        i += BATCH;
        const rows = [];
        for (const r of batch) {
          const id = `${r.bookId}-${r.chapter}-${r.verse}`;
          const key = `${translationId}|${id}`;
          if (seen.has(key)) { dup++; continue; }
          seen.add(key);
          rows.push({ id, bookId: r.bookId, chapter: r.chapter, verse: r.verse, text: r.text, t: translationId });
        }
        if (!rows.length) { nextBatch(); return; }
        const placeholders = rows.map(() => '(?,?,?,?,?,?)').join(',');
        const flat = rows.flatMap((x) => [x.id, x.bookId, x.chapter, x.verse, x.text, x.t]);
        db.run(
          `INSERT INTO verses (id, book_id, chapter, verse, text, translation_id) VALUES ${placeholders}`,
          flat,
          nextBatch
        );
      };
      nextBatch();
    });
  });
}

function runSql(db, sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function query(db, sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

async function main() {
  console.log('Parsing ONBV (Nueva Biblia Viva 2008)...');
  const onbv = parseDir('onbv_usfm');
  console.log('Parsing PdDpt (Palabra de Dios para ti)...');
  const pddpt = parseDir('pddpt_usfm');
  console.log(`\nONBV: ${onbv.length}, PdDpt: ${pddpt.length}`);

  const db = new sqlite3.Database(DB_PATH);
  console.log('\nConnected to', DB_PATH);

  const before = await query(db, 'SELECT COUNT(*) AS c FROM verses');
  console.log('Verses before:', before[0].c);

  await runSql(db, 'DROP INDEX IF EXISTS idx_verses_translation');
  await runSql(db, 'DROP INDEX IF EXISTS idx_verses_book_chapter_translation');
  await runSql(db, `
    CREATE TABLE verses_new (
      id TEXT NOT NULL,
      book_id INTEGER NOT NULL,
      chapter INTEGER NOT NULL,
      verse INTEGER NOT NULL,
      text TEXT NOT NULL,
      translation_id INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (translation_id, id),
      FOREIGN KEY (book_id) REFERENCES books(id)
    )
  `);
  await runSql(db, 'INSERT INTO verses_new (id, book_id, chapter, verse, text, translation_id) SELECT id, book_id, chapter, verse, text, translation_id FROM verses');
  await runSql(db, 'DROP TABLE verses');
  await runSql(db, 'ALTER TABLE verses_new RENAME TO verses');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses(translation_id)');
  await runSql(db, 'CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_translation ON verses(book_id, chapter, translation_id)');
  console.log('Reconstruida tabla verses con PK compuesta');

  await runSql(db, `UPDATE translations SET code='ONBV', name='Nueva Biblia Viva 2008', full_name='Biblica® Open Nueva Biblia Viva 2008', copyright='© 2008 Biblica, Inc. — CC BY-SA 4.0', is_default=0, sort_order=2 WHERE id=2`);
  await runSql(db, `INSERT OR IGNORE INTO translations (id, code, name, full_name, copyright, is_default, sort_order) VALUES (3, 'PdDpt', 'Palabra de Dios para ti', 'Palabra de Dios para ti — Asociación Bíblica Latinoamericana', '© 2020 Asociación Bíblica Latinoamericana — CC BY 4.0', 0, 3)`);
  console.log('Metadatos translations actualizados');

  const t0 = Date.now();
  const r1 = await insertVersesBulk(db, 2, onbv);
  console.log(`ONBV insertado en ${(Date.now() - t0) / 1000}s. Duplicados: ${r1.dup}`);
  const t1 = Date.now();
  const r2 = await insertVersesBulk(db, 3, pddpt);
  console.log(`PdDpt insertado en ${(Date.now() - t1) / 1000}s. Duplicados: ${r2.dup}`);

  await runSql(db, "INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '7')");

  const counts = await query(db, 'SELECT translation_id, COUNT(*) AS c FROM verses GROUP BY translation_id ORDER BY translation_id');
  console.log('\nCounts per translation:', counts);
  const j316 = await query(db, "SELECT translation_id, text FROM verses WHERE book_id = 43 AND chapter = 3 AND verse = 16 ORDER BY translation_id");
  console.log('\nJuan 3:16 por traducción:');
  j316.forEach((r) => console.log(`  [${r.translation_id}] ${r.text}`));

  db.close();
  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });