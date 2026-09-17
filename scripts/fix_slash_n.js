const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'assets', 'bible.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

console.log('Fixing literal /n in verses...\n');

db.serialize(() => {
  // First, count affected verses
  db.get("SELECT COUNT(*) as count FROM verses WHERE text LIKE '%/n%'", [], (err, row) => {
    if (err) {
      console.error('Error counting:', err.message);
      return;
    }
    console.log(`Verses with literal /n: ${row.count}`);
    
    if (row.count === 0) {
      console.log('No /n found. Database clean.');
      db.close();
      return;
    }
    
    // Show some examples before fix
    db.all("SELECT id, book_id, chapter, verse, text FROM verses WHERE text LIKE '%/n%' LIMIT 3", [], (err, rows) => {
      console.log('\nExamples before fix:');
      rows.forEach(r => {
        console.log(`  ${r.id} (book:${r.book_id} ${r.chapter}:${r.verse}): "${r.text.substring(0, 100)}..."`);
      });
      
      // Fix: replace /n with actual newline
      db.run("UPDATE verses SET text = REPLACE(text, '/n', CHAR(10)) WHERE text LIKE '%/n%'", function(err) {
        if (err) {
          console.error('Error fixing:', err.message);
          return;
        }
        console.log(`\nFixed ${this.changes} verses.`);
        
        // Verify
        db.get("SELECT COUNT(*) as count FROM verses WHERE text LIKE '%/n%'", [], (err, row) => {
          console.log(`Remaining with literal /n: ${row.count}`);
          
          // Show some after fix
          db.all("SELECT id, book_id, chapter, verse, text FROM verses WHERE book_id = 19 LIMIT 5", [], (err, rows) => {
            console.log('\nPsalms after fix:');
            rows.forEach(r => {
              const hasNL = r.text.includes('\n');
              console.log(`  Ps ${r.verse}: "${r.text.substring(0, 100)}" | hasNewline: ${hasNL}`);
            });
            db.close();
            console.log('\nDone!');
          });
        });
      });
    });
  });
});