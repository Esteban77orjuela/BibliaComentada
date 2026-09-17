const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'assets', 'bible.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to database:', dbPath);
});

async function inspectAndClean() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Check tables
      db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
          console.error('Error getting tables:', err);
          return reject(err);
        }
        console.log('Tables:', tables.map(t => t.name).join(', '));
        
        // 2. Check verses table structure
        db.all("PRAGMA table_info(verses)", [], (err, cols) => {
          if (err) {
            console.error('Error getting columns:', err);
            return reject(err);
          }
          console.log('Verses columns:', cols.map(c => `${c.name}:${c.type}`).join(', '));
          
          // 3. Check for literal \n in text
          db.all("SELECT COUNT(*) as count FROM verses WHERE text LIKE '%\\n%'", [], (err, rows) => {
            if (err) {
              console.error('Error counting:', err);
              return reject(err);
            }
            const count = rows[0].count;
            console.log(`Verses with literal \\n: ${count}`);
            
            if (count > 0) {
              // Show some examples
              db.all("SELECT id, book_id, chapter, verse, text FROM verses WHERE text LIKE '%\\n%' LIMIT 5", [], (err, rows) => {
                if (err) {
                  console.error('Error getting examples:', err);
                  return reject(err);
                }
                console.log('Examples with literal \\n:');
                rows.forEach(r => {
                  console.log(`  ${r.id} (book:${r.book_id} ${r.chapter}:${r.verse}): "${r.text.substring(0, 80)}..."`);
                });
                
                // 4. Check Psalms specifically
                db.all("SELECT id, verse, text FROM verses WHERE book_id = 19 LIMIT 10", [], (err, rows) => {
                  if (err) {
                    console.error('Error getting Psalms:', err);
                    return reject(err);
                  }
                  console.log('\nPsalms sample:');
                  rows.forEach(r => {
                    const hasSlashN = r.text.includes('\\n');
                    console.log(`  Ps ${r.verse}: "${r.text.substring(0, 100)}" ${hasSlashN ? ' [HAS \\n]' : ''}`);
                  });
                  
                  // 5. Clean if needed
                  if (count > 0) {
                    console.log('\nCleaning literal \\n...');
                    db.run("UPDATE verses SET text = REPLACE(text, '\\n', ' ') WHERE text LIKE '%\\n%'", function(err) {
                      if (err) {
                        console.error('Error cleaning:', err);
                        return reject(err);
                      }
                      console.log(`Cleaned ${this.changes} verses.`);
                      
                      // Verify
                      db.all("SELECT COUNT(*) as count FROM verses WHERE text LIKE '%\\n%'", [], (err, rows) => {
                        if (err) {
                          console.error('Error verifying:', err);
                          return reject(err);
                        }
                        console.log(`Remaining with literal \\n: ${rows[0].count}`);
                        db.close();
                        resolve();
                      });
                    });
                  } else {
                    console.log('\nNo literal \\n found. Database is clean.');
                    db.close();
                    resolve();
                  }
                });
              });
            } else {
              console.log('\nNo literal \\n found. Database is clean.');
              db.close();
              resolve();
            }
          });
        });
      });
    });
  });
}

inspectAndClean().catch(err => {
  console.error('Fatal error:', err);
  db.close();
  process.exit(1);
});