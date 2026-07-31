const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BASE_URL = 'https://raw.githubusercontent.com/josevladimir/bible-json/master/procesados';

const BOOKS = [
  { id: 1,  name: 'Génesis',        file: 'genesis.js',        abbreviation: 'Gén',  testament: 'AT', totalChapters: 50, order: 1  },
  { id: 2,  name: 'Éxodo',          file: 'exodo.js',          abbreviation: 'Éx',   testament: 'AT', totalChapters: 40, order: 2  },
  { id: 3,  name: 'Levítico',       file: 'levitico.js',       abbreviation: 'Lev',  testament: 'AT', totalChapters: 27, order: 3  },
  { id: 4,  name: 'Números',        file: 'numeros.js',        abbreviation: 'Núm',  testament: 'AT', totalChapters: 36, order: 4  },
  { id: 5,  name: 'Deuteronomio',   file: 'deuteronomio.js',   abbreviation: 'Dt',   testament: 'AT', totalChapters: 34, order: 5  },
  { id: 6,  name: 'Josué',          file: 'josue.js',          abbreviation: 'Jos',  testament: 'AT', totalChapters: 24, order: 6  },
  { id: 7,  name: 'Jueces',         file: 'jueces.js',         abbreviation: 'Jue',  testament: 'AT', totalChapters: 21, order: 7  },
  { id: 8,  name: 'Rut',            file: 'rut.js',            abbreviation: 'Rut',  testament: 'AT', totalChapters: 4,  order: 8  },
  { id: 9,  name: '1 Samuel',       file: '1_samuel.js',       abbreviation: '1 S',  testament: 'AT', totalChapters: 31, order: 9  },
  { id: 10, name: '2 Samuel',       file: '2_samuel.js',       abbreviation: '2 S',  testament: 'AT', totalChapters: 24, order: 10 },
  { id: 11, name: '1 Reyes',        file: '1_reyes.js',        abbreviation: '1 R',  testament: 'AT', totalChapters: 22, order: 11 },
  { id: 12, name: '2 Reyes',        file: '2_reyes.js',        abbreviation: '2 R',  testament: 'AT', totalChapters: 25, order: 12 },
  { id: 13, name: '1 Crónicas',     file: '1_cronicas.js',     abbreviation: '1 Cr', testament: 'AT', totalChapters: 29, order: 13 },
  { id: 14, name: '2 Crónicas',     file: '2_cronicas.js',     abbreviation: '2 Cr', testament: 'AT', totalChapters: 36, order: 14 },
  { id: 15, name: 'Esdras',         file: 'esdras.js',         abbreviation: 'Esd',  testament: 'AT', totalChapters: 10, order: 15 },
  { id: 16, name: 'Nehemías',       file: 'nehemias.js',       abbreviation: 'Neh',  testament: 'AT', totalChapters: 13, order: 16 },
  { id: 17, name: 'Ester',          file: 'ester.js',          abbreviation: 'Est',  testament: 'AT', totalChapters: 10, order: 17 },
  { id: 18, name: 'Job',            file: 'job.js',            abbreviation: 'Job',  testament: 'AT', totalChapters: 42, order: 18 },
  { id: 19, name: 'Salmos',         file: 'salmos.js',         abbreviation: 'Sal',  testament: 'AT', totalChapters: 150, order: 19 },
  { id: 20, name: 'Proverbios',     file: 'proverbios.js',     abbreviation: 'Pr',   testament: 'AT', totalChapters: 31, order: 20 },
  { id: 21, name: 'Eclesiastés',    file: 'eclesiastes.js',    abbreviation: 'Ec',   testament: 'AT', totalChapters: 12, order: 21 },
  { id: 22, name: 'Cantares',       file: 'cantares.js',       abbreviation: 'Cnt',  testament: 'AT', totalChapters: 8,  order: 22 },
  { id: 23, name: 'Isaías',         file: 'isaias.js',         abbreviation: 'Is',   testament: 'AT', totalChapters: 66, order: 23 },
  { id: 24, name: 'Jeremías',       file: 'jeremias.js',       abbreviation: 'Jer',  testament: 'AT', totalChapters: 52, order: 24 },
  { id: 25, name: 'Lamentaciones',  file: 'lamentaciones.js',  abbreviation: 'Lm',   testament: 'AT', totalChapters: 5,  order: 25 },
  { id: 26, name: 'Ezequiel',       file: 'ezequiel.js',       abbreviation: 'Ez',   testament: 'AT', totalChapters: 48, order: 26 },
  { id: 27, name: 'Daniel',         file: 'daniel.js',         abbreviation: 'Dn',   testament: 'AT', totalChapters: 12, order: 27 },
  { id: 28, name: 'Oseas',          file: 'oseas.js',          abbreviation: 'Os',   testament: 'AT', totalChapters: 14, order: 28 },
  { id: 29, name: 'Joel',           file: 'joel.js',           abbreviation: 'Jl',   testament: 'AT', totalChapters: 3,  order: 29 },
  { id: 30, name: 'Amós',           file: 'amos.js',           abbreviation: 'Am',   testament: 'AT', totalChapters: 9,  order: 30 },
  { id: 31, name: 'Abdías',         file: 'abdias.js',         abbreviation: 'Abd',  testament: 'AT', totalChapters: 1,  order: 31 },
  { id: 32, name: 'Jonás',          file: 'jonas.js',          abbreviation: 'Jon',  testament: 'AT', totalChapters: 4,  order: 32 },
  { id: 33, name: 'Miqueas',        file: 'miqueas.js',        abbreviation: 'Mi',   testament: 'AT', totalChapters: 7,  order: 33 },
  { id: 34, name: 'Nahúm',          file: 'nahum.js',          abbreviation: 'Nah',  testament: 'AT', totalChapters: 3,  order: 34 },
  { id: 35, name: 'Habacuc',        file: 'habacuc.js',        abbreviation: 'Hab',  testament: 'AT', totalChapters: 3,  order: 35 },
  { id: 36, name: 'Sofonías',       file: 'sofonias.js',       abbreviation: 'Sof',  testament: 'AT', totalChapters: 3,  order: 36 },
  { id: 37, name: 'Hageo',          file: 'hageo.js',          abbreviation: 'Hag',  testament: 'AT', totalChapters: 2,  order: 37 },
  { id: 38, name: 'Zacarías',       file: 'zacarias.js',       abbreviation: 'Zac',  testament: 'AT', totalChapters: 14, order: 38 },
  { id: 39, name: 'Malaquías',      file: 'malaquias.js',      abbreviation: 'Mal',  testament: 'AT', totalChapters: 4,  order: 39 },
  { id: 40, name: 'Mateo',          file: 'mateo.js',          abbreviation: 'Mt',   testament: 'NT', totalChapters: 28, order: 40 },
  { id: 41, name: 'Marcos',         file: 'marcos.js',         abbreviation: 'Mr',   testament: 'NT', totalChapters: 16, order: 41 },
  { id: 42, name: 'Lucas',          file: 'lucas.js',          abbreviation: 'Lc',   testament: 'NT', totalChapters: 24, order: 42 },
  { id: 43, name: 'Juan',           file: 'juan.js',           abbreviation: 'Jn',   testament: 'NT', totalChapters: 21, order: 43 },
  { id: 44, name: 'Hechos',         file: 'hechos.js',         abbreviation: 'Hch',  testament: 'NT', totalChapters: 28, order: 44 },
  { id: 45, name: 'Romanos',        file: 'romanos.js',        abbreviation: 'Ro',   testament: 'NT', totalChapters: 16, order: 45 },
  { id: 46, name: '1 Corintios',    file: '1_corintios.js',    abbreviation: '1 Co', testament: 'NT', totalChapters: 16, order: 46 },
  { id: 47, name: '2 Corintios',    file: '2_corintios.js',    abbreviation: '2 Co', testament: 'NT', totalChapters: 13, order: 47 },
  { id: 48, name: 'Gálatas',        file: 'galatas.js',        abbreviation: 'Gá',   testament: 'NT', totalChapters: 6,  order: 48 },
  { id: 49, name: 'Efesios',        file: 'efesios.js',        abbreviation: 'Ef',   testament: 'NT', totalChapters: 6,  order: 49 },
  { id: 50, name: 'Filipenses',     file: 'filipenses.js',     abbreviation: 'Fil',  testament: 'NT', totalChapters: 4,  order: 50 },
  { id: 51, name: 'Colosenses',     file: 'colosenses.js',     abbreviation: 'Col',  testament: 'NT', totalChapters: 4,  order: 51 },
  { id: 52, name: '1 Tesalonicenses', file: '1_tesalonicenses.js', abbreviation: '1 Ts', testament: 'NT', totalChapters: 5, order: 52 },
  { id: 53, name: '2 Tesalonicenses', file: '2_tesalonicenses.js', abbreviation: '2 Ts', testament: 'NT', totalChapters: 3, order: 53 },
  { id: 54, name: '1 Timoteo',       file: '1_timoteo.js',       abbreviation: '1 Ti', testament: 'NT', totalChapters: 6,  order: 54 },
  { id: 55, name: '2 Timoteo',       file: '2_timoteo.js',       abbreviation: '2 Ti', testament: 'NT', totalChapters: 4,  order: 55 },
  { id: 56, name: 'Tito',            file: 'tito.js',            abbreviation: 'Tit',  testament: 'NT', totalChapters: 3,  order: 56 },
  { id: 57, name: 'Filemón',         file: 'filemon.js',         abbreviation: 'Flm',  testament: 'NT', totalChapters: 1,  order: 57 },
  { id: 58, name: 'Hebreos',         file: 'hebreos.js',         abbreviation: 'He',   testament: 'NT', totalChapters: 13, order: 58 },
  { id: 59, name: 'Santiago',        file: 'santiago.js',        abbreviation: 'Stg',  testament: 'NT', totalChapters: 5,  order: 59 },
  { id: 60, name: '1 Pedro',         file: '1_pedro.js',         abbreviation: '1 P',  testament: 'NT', totalChapters: 5,  order: 60 },
  { id: 61, name: '2 Pedro',         file: '2_pedro.js',         abbreviation: '2 P',  testament: 'NT', totalChapters: 3,  order: 61 },
  { id: 62, name: '1 Juan',          file: '1_juan.js',          abbreviation: '1 Jn', testament: 'NT', totalChapters: 5,  order: 62 },
  { id: 63, name: '2 Juan',          file: '2_juan.js',          abbreviation: '2 Jn', testament: 'NT', totalChapters: 1,  order: 63 },
  { id: 64, name: '3 Juan',          file: '3_juan.js',          abbreviation: '3 Jn', testament: 'NT', totalChapters: 1,  order: 64 },
  { id: 65, name: 'Judas',           file: 'judas.js',           abbreviation: 'Jud',  testament: 'NT', totalChapters: 1,  order: 65 },
  { id: 66, name: 'Apocalipsis',     file: 'apocalipsis.js',     abbreviation: 'Ap',   testament: 'NT', totalChapters: 22, order: 66 },
];

async function fetchFile(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.text();
}

function parseChapters(sourceText) {
  const code = sourceText.replace('export default', 'module.exports = ');
  const tmpFile = path.join(os.tmpdir(), `_bible_${Date.now()}.js`);
  fs.writeFileSync(tmpFile, code, 'utf-8');
  const data = require(tmpFile);
  fs.unlinkSync(tmpFile);
  return data;
}

async function main() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  let totalVerses = 0;

  db.run('PRAGMA journal_mode=MEMORY');
  db.run('PRAGMA synchronous=OFF');

  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    abbreviation TEXT NOT NULL,
    testament TEXT NOT NULL CHECK (testament IN ('AT', 'NT')),
    total_chapters INTEGER NOT NULL,
    book_order INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS verses (
    id TEXT PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id)
  )`);

  db.run(`CREATE INDEX IF NOT EXISTS idx_verses_book_chapter ON verses(book_id, chapter)`);

  const insertBook = db.prepare(
    'INSERT INTO books (id, name, abbreviation, testament, total_chapters, book_order) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertVerse = db.prepare(
    'INSERT INTO verses (id, book_id, chapter, verse, text) VALUES (?, ?, ?, ?, ?)'
  );

  for (const book of BOOKS) {
    insertBook.run([book.id, book.name, book.abbreviation, book.testament, book.totalChapters, book.order]);
  }

  const totalBooks = BOOKS.length;

  for (let bi = 0; bi < totalBooks; bi++) {
    const book = BOOKS[bi];
    const url = `${BASE_URL}/${book.file}`;
    process.stdout.write(`[${bi + 1}/${totalBooks}] ${book.name}... `);

    try {
      const content = await fetchFile(url);
      const chapters = parseChapters(content);

      if (!Array.isArray(chapters)) {
        process.stdout.write(`SKIP (not an array)\n`);
        continue;
      }

      let bookVerseCount = 0;

      for (let ci = 0; ci < chapters.length; ci++) {
        const chapter = chapters[ci];
        if (!Array.isArray(chapter)) continue;

        const chapterNumber = ci + 1;

        for (let vi = 0; vi < chapter.length; vi++) {
          const verseText = (chapter[vi] || '').trim();
          if (!verseText) continue;

          const verseNumber = vi + 1;
          const id = `${book.id}-${chapterNumber}-${verseNumber}`;
          insertVerse.run([id, book.id, chapterNumber, verseNumber, verseText]);
          bookVerseCount++;
          totalVerses++;
        }
      }

      process.stdout.write(`${book.totalChapters} cap, ${bookVerseCount} vers\n`);
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
    }
  }

  insertBook.free();
  insertVerse.free();

  process.stdout.write(`\n✅ ${totalBooks} books, ${totalVerses} verses imported\n`);

  const outPath = path.join(__dirname, '..', 'assets', 'bible.db');
  const buffer = Buffer.from(db.export());
  fs.writeFileSync(outPath, buffer);

  const mb = (buffer.length / 1024 / 1024).toFixed(1);
  process.stdout.write(`✅ Saved: ${outPath} (${mb} MB)\n`);

  db.close();
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
