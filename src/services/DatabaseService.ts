import type { SQLiteDatabase } from 'expo-sqlite';
import { Book, Verse, Comment, SearchResult, DictionaryEntry, Article } from '../types';

let db: SQLiteDatabase | null = null;
let ready = false;

export function setDb(database: SQLiteDatabase): void {
  db = database;
  ready = true;
}

export function isReady(): boolean {
  return ready;
}

function getDb(): SQLiteDatabase {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export async function getBooks(): Promise<Book[]> {
  const rows = await getDb().getAllAsync<Omit<Book, 'totalChapters'> & { total_chapters: number; book_order: number }>(
    'SELECT id, name, abbreviation, testament, total_chapters, book_order FROM books ORDER BY book_order ASC'
  );
  return rows.map(r => ({
    ...r,
    totalChapters: r.total_chapters,
    order: r.book_order,
  }));
}

export async function getTotalChapters(bookId: number): Promise<number> {
  const row = await getDb().getFirstAsync<{ total_chapters: number }>(
    'SELECT total_chapters FROM books WHERE id = ?',
    bookId
  );
  return row?.total_chapters ?? 0;
}

export async function getVerses(bookId: number, chapter: number): Promise<Verse[]> {
  const book = await getDb().getFirstAsync<{ name: string }>(
    'SELECT name FROM books WHERE id = ?',
    bookId
  );
  const bookName = book?.name ?? '';
  const rows = await getDb().getAllAsync<any>(
    `SELECT id, chapter, verse, text FROM verses WHERE book_id = ? AND chapter = ? ORDER BY verse ASC`,
    bookId,
    chapter
  );
  return rows.map(r => ({
    id: r.id,
    bookId,
    bookName,
    chapter: r.chapter,
    verse: r.verse,
    text: r.text,
  }));
}

export async function getVerseById(verseId: string): Promise<Verse | null> {
  const row = await getDb().getFirstAsync<any>(
    `SELECT v.id, v.book_id AS bookId, b.name AS bookName, v.chapter, v.verse, v.text
     FROM verses v JOIN books b ON b.id = v.book_id WHERE v.id = ?`,
    verseId
  );
  if (!row) return null;
  return {
    id: row.id,
    bookId: row.bookId,
    bookName: row.bookName ?? '',
    chapter: row.chapter,
    verse: row.verse,
    text: row.text,
  };
}

export async function getComments(verseId: string): Promise<Comment[]> {
  try {
    const rows = await getDb().getAllAsync<any>(
      'SELECT id, verse_id AS verseId, theologian, text FROM comments WHERE verse_id = ? ORDER BY theologian ASC',
      verseId
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getTheologians(verseId: string): Promise<string[]> {
  try {
    const rows = await getDb().getAllAsync<{ theologian: string }>(
      'SELECT DISTINCT theologian FROM comments WHERE verse_id = ? ORDER BY theologian ASC',
      verseId
    );
    return rows.map(r => r.theologian);
  } catch {
    return [];
  }
}

export async function searchContent(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  const verseRows = await getDb().getAllAsync<any>(
    `SELECT v.id, v.book_id AS bookId, b.name AS bookName, v.chapter, v.verse, v.text
     FROM verses v JOIN books b ON b.id = v.book_id
     WHERE LOWER(v.text) LIKE '%' || ? || '%' LIMIT 50`,
    q
  );

  for (const v of verseRows) {
    const idx = v.text.toLowerCase().indexOf(q);
    const start = Math.max(0, idx - 30);
    const excerpt = (start > 0 ? '…' : '') + v.text.slice(start, idx + q.length + 60).trim() + '…';
    results.push({
      verse: {
        id: v.id,
        bookId: v.bookId,
        bookName: v.bookName,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      },
      matchType: 'verse',
      excerpt,
    });
  }

  try {
    const commentRows = await getDb().getAllAsync<any>(
      `SELECT c.id, c.verse_id AS verseId, c.theologian, c.text,
              v.id AS vid, v.book_id AS bookId, b.name AS bookName,
              v.chapter, v.verse, v.text AS verseText
       FROM comments c
       JOIN verses v ON v.id = c.verse_id
       JOIN books b ON b.id = v.book_id
       WHERE LOWER(c.text) LIKE '%' || ? || '%' LIMIT 50`,
      q
    );

    for (const c of commentRows) {
      const idx = c.text.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 30);
      const excerpt = (start > 0 ? '…' : '') + c.text.slice(start, idx + q.length + 60).trim() + '…';
      results.push({
        verse: {
          id: c.vid,
          bookId: c.bookId,
          bookName: c.bookName,
          chapter: c.chapter,
          verse: c.verse,
          text: c.verseText,
        },
        matchType: 'comment',
        excerpt,
        theologian: c.theologian,
      });
    }
  } catch {
    // comments table may not exist yet
  }

  return results.slice(0, 50);
}

export async function getDictionaryEntries(): Promise<DictionaryEntry[]> {
  try {
    const rows = await getDb().getAllAsync<DictionaryEntry>(
      'SELECT id, title, content FROM dictionary_entries ORDER BY title ASC LIMIT 200'
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getDictionaryEntry(id: string): Promise<DictionaryEntry | null> {
  try {
    const row = await getDb().getFirstAsync<DictionaryEntry>(
      'SELECT id, title, content FROM dictionary_entries WHERE id = ?',
      id
    );
    return row ?? null;
  } catch {
    return null;
  }
}

export async function searchDictionary(query: string): Promise<DictionaryEntry[]> {
  if (!query.trim()) return [];
  try {
    const q = query.toLowerCase().trim();
    const rows = await getDb().getAllAsync<DictionaryEntry>(
      `SELECT id, title, content FROM dictionary_entries
       WHERE LOWER(title) LIKE '%' || ? || '%' OR LOWER(content) LIKE '%' || ? || '%'
       ORDER BY title ASC LIMIT 50`,
      q, q
    );
    return rows;
  } catch {
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const rows = await getDb().getAllAsync<any>(
      "SELECT id, title, summary, content, category, image_url AS imageUrl, date FROM articles ORDER BY date DESC"
    );
    return rows.map(r => ({
      ...r,
      imageUrl: r.imageUrl ?? '',
    }));
  } catch {
    return [];
  }
}

export async function getArticle(id: string): Promise<Article | null> {
  try {
    const row = await getDb().getFirstAsync<any>(
      "SELECT id, title, summary, content, category, image_url AS imageUrl, date FROM articles WHERE id = ?",
      id
    );
    if (!row) return null;
    return { ...row, imageUrl: row.imageUrl ?? '' };
  } catch {
    return null;
  }
}
