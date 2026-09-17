const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'assets', 'bible.db');
const sqlPath = path.join(__dirname, 'add_rv1909_migration.sql');

console.log('Running migration: add translations table and translation_id...\n');

const sql = fs.readFileSync(sqlPath, 'utf8');
const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to database:', dbPath);
});

let current = 0;
function runNext() {
  if (current >= statements.length) {
    console.log('\nMigration completed successfully!');
    db.close();
    return;
  }
  const stmt = statements[current];
  current++;
  
  db.run(stmt, function(err) {
    if (err) {
      // Ignore "duplicate column" or "already exists" errors
      if (err.message.includes('duplicate column') || 
          err.message.includes('already exists') ||
          err.message.includes('UNIQUE constraint failed')) {
        console.log(`  Skipped (already exists): ${stmt.substring(0, 60)}...`);
      } else {
        console.error(`Error in statement ${current}:`, err.message);
        console.error('Statement:', stmt.substring(0, 100));
      }
    } else {
      console.log(`  ✓ Statement ${current}/${statements.length}`);
    }
    runNext();
  });
}

runNext();