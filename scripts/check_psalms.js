const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'assets', 'bible.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

db.all("SELECT id, verse, text FROM verses WHERE book_id = 19 LIMIT 30", [], (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
  rows.forEach(r => {
    const hasNL = r.text.includes('\n');
    const hasCR = r.text.includes('\r');
    const hasSlashN = r.text.includes('\\n');
    const hasBr = r.text.includes('<br');
    const hasDoubleSpace = r.text.includes('  ');
    console.log(`Ps ${r.verse}: "${r.text.substring(0,120)}" | NL:${hasNL} CR:${hasCR} slashN:${hasSlashN} BR:${hasBr} DS:${hasDoubleSpace}`);
  });
  db.close();
  process.exit(0);
});