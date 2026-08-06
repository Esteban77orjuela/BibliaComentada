const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '..', 'assets', 'bible.db');

const BOOK_ID = 1;
const CHAPTER = 1;

const MULTI_VERSE = [
  { theologian: 'Matthew Henry', start: 1, end: 2 },
  { theologian: 'Comentario del Púlpito', start: 1, end: 2 },
  { theologian: 'Charles Spurgeon', start: 1, end: 31 },
  { theologian: 'Chuck Smith', start: 1, end: 8 },
  { theologian: 'A.C. Gaebelein', start: 1, end: 31 },
  { theologian: 'Nicoll (Expositor)', start: 1, end: 31 },
  { theologian: 'JFB Conciso', start: 1, end: 31 },
  { theologian: 'Arthur Peake', start: 1, end: 4 },
  { theologian: 'Dummelow', start: 1, end: 31 },
  { theologian: 'Frederick Brotherton Meyer', start: 1, end: 5 },
  { theologian: 'Leslie M. Grant', start: 1, end: 31 },
  { theologian: 'Pozos de agua viva', start: 1, end: 5 },
  { theologian: 'Gary Hampton', start: 1, end: 26 },
  { theologian: 'William Kelly', start: 1, end: 31 },
  { theologian: 'Homilético Completo del Predicador', start: 1, end: 2 },
  { theologian: 'G. Campbell Morgan', start: 1, end: 31 },
  { theologian: 'Cambridge', start: 1, end: 5 },
  { theologian: 'Charles Henry Mackintosh', start: 1, end: 31 },
  { theologian: 'John Darby (Sinopsis)', start: 1, end: 31 },
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error('bible.db not found');
    process.exit(1);
  }

  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync(DB_PATH));

  db.run(`CREATE TABLE IF NOT EXISTS range_comments (
    id TEXT PRIMARY KEY,
    book_id INTEGER NOT NULL,
    chapter INTEGER NOT NULL,
    start_verse INTEGER NOT NULL,
    end_verse INTEGER NOT NULL,
    theologian TEXT NOT NULL,
    text TEXT NOT NULL
  )`);

  let moved = 0;
  let missing = 0;

  const allRows = db.exec("SELECT id, theologian, text FROM comments WHERE verse_id = '1-1-1'");
  const rows = allRows.length ? allRows[0].values : [];

  for (const item of MULTI_VERSE) {
    const matches = rows.filter(row => row[1] === item.theologian);

    if (!matches.length) {
      console.log(`  SKIP (no row): ${item.theologian}`);
      missing++;
      continue;
    }

    for (const [id, theologian, text] of matches) {
      const rangeId = `range-${BOOK_ID}-${CHAPTER}-${item.start}-${item.end}-${slugify(item.theologian)}`;
      db.run(
        'INSERT OR REPLACE INTO range_comments (id, book_id, chapter, start_verse, end_verse, theologian, text) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [rangeId, BOOK_ID, CHAPTER, item.start, item.end, item.theologian, text]
      );
      db.run('DELETE FROM comments WHERE id = ?', [id]);
      moved++;
      console.log(`  MOVED: ${item.theologian} (1:${item.start}-${item.end})`);
    }
  }

  db.run("INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '4')");
  const today = new Date().toISOString().split('T')[0];
  db.run('INSERT OR REPLACE INTO _metadata (key, value) VALUES (?, ?)', ['updated_at', today]);

  const outBuffer = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, outBuffer);

  const comments = db.exec("SELECT COUNT(*) FROM comments WHERE verse_id = '1-1-1'");
  const ranges = db.exec('SELECT COUNT(*) FROM range_comments');
  console.log(`\nMoved: ${moved}, Missing: ${missing}`);
  console.log(`comments (1-1-1): ${comments[0].values[0][0]}`);
  console.log(`range_comments: ${ranges[0].values[0][0]}`);
  console.log(`DB version: 4`);
  console.log(`DB size: ${(outBuffer.length / 1024 / 1024).toFixed(1)} MB`);
  db.close();
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });
