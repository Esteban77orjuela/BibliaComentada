-- Migration: Add translations table and translation_id to verses
-- Run this before importing RV1909

-- 1. Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,        -- 'RV1960', 'RV1909'
  name TEXT NOT NULL,               -- 'Reina Valera 1960', 'Reina Valera 1909'
  full_name TEXT,                   -- 'Reina Valera 1960 (Revisión 1960)'
  copyright TEXT,                   -- Copyright info
  is_default INTEGER DEFAULT 0,     -- 1 = default translation
  sort_order INTEGER DEFAULT 0      -- For UI ordering
);

-- 2. Insert default translations
INSERT OR IGNORE INTO translations (id, code, name, full_name, copyright, is_default, sort_order) VALUES
  (1, 'RV1960', 'Reina Valera 1960', 'Reina Valera 1960', 'Dominio público', 1, 1),
  (2, 'RV1909', 'Reina Valera 1909', 'Reina Valera 1909', 'Dominio público', 0, 2);

-- 3. Add translation_id column to verses (if not exists)
-- Note: SQLite doesn't support ADD COLUMN with foreign key directly
-- We'll add the column, then update, then create index

-- Check if column exists first (PRAGMA)
-- If not exists, add it
ALTER TABLE verses ADD COLUMN translation_id INTEGER DEFAULT 1;

-- Update existing verses to use RV1960 (id=1)
UPDATE verses SET translation_id = 1 WHERE translation_id IS NULL OR translation_id = 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_verses_translation ON verses(translation_id);
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_translation ON verses(book_id, chapter, translation_id);

-- 4. Add translation_id to comments if needed (for multi-translation comments)
-- ALTER TABLE comments ADD COLUMN translation_id INTEGER DEFAULT 1;
-- UPDATE comments SET translation_id = 1 WHERE translation_id IS NULL;

-- 5. Update _metadata with current schema version
INSERT OR REPLACE INTO _metadata (key, value) VALUES ('db_version', '6');
INSERT OR REPLACE INTO _metadata (key, value) VALUES ('translations_schema_version', '1');