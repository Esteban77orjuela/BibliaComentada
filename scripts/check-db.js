const initSqlJs = require('sql.js');
const fs = require('fs');

async function main() {
  const SQL = await initSqlJs();
  const buffer = fs.readFileSync(__dirname + '/../assets/bible.db');
  const db = new SQL.Database(buffer);
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log('Tables:', tables[0]?.values.map(v => v[0]).join(', '));
  for (const t of tables[0]?.values || []) {
    const count = db.exec('SELECT COUNT(*) FROM "' + t[0] + '"');
    console.log('  ' + t[0] + ': ' + count[0]?.values[0][0] + ' rows');
  }
  const pragma = db.exec('PRAGMA integrity_check');
  console.log('Integrity:', pragma[0]?.values[0][0]);
  db.close();
}
main().catch(e => console.error('ERROR:', e));
