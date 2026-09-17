const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'assets', 'bible.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);

console.log('Verifying migration...\n');

db.serialize(() => {
  // Check translations table
  db.all("SELECT * FROM translations", [], (err, rows) => {
    console.log('Translations table:');
    console.log(JSON.stringify(rows, null, 2));
    
    // Check verses have translation_id
    db.get("SELECT COUNT(*) as count FROM verses WHERE translation_id = 1", [], (err, row) => {
      console.log(`Verses with translation_id=1 (RV1960): ${row.count}`);
      
      db.get("SELECT COUNT(*) as count FROM verses WHERE translation_id = 2", [], (err, row) => {
        console.log(`Verses with translation_id=2 (RV1909): ${row.count}`);
        
        // Check _metadata
        db.all("SELECT * FROM _metadata", [], (err, rows) => {
          console.log('\nMetadata:');
          console.log(JSON.stringify(rows, null, 2));
          
          // Sample verse with translation_id
          db.get("SELECT id, translation_id, text FROM verses LIMIT 1", [], (err, row) => {
            console.log('\nSample verse:');
            console.log(JSON.stringify(row, null, 2));
            process.exit(0);
          });
        });
      });
    });
  });
});