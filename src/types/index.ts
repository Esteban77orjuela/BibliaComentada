// ============================================================
// BibliaPlus Pro — Global Types
// ============================================================

export type Testament = 'AT' | 'NT';

export interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: Testament;
  totalChapters: number;
  order: number;
}

export interface Verse {
  id: string; // format: "bookId-chapter-verse"
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Comment {
  id: string;
  verseId: string;
  theologian: string;
  text: string;
}

export interface Favorite {
  id: string;
  verseId: string;
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number; // timestamp
}

export interface SearchResult {
  verse: Verse;
  matchType: 'verse' | 'comment';
  excerpt: string;
  theologian?: string;
}

// ============================================================
// Navigation Types
// ============================================================

export type RootTabParamList = {
  BibleTab: undefined;
  SearchTab: undefined;
  FavoritesTab: undefined;
};

export type BibleStackParamList = {
  Books: undefined;
  Chapters: { book: Book };
  Reader: { book: Book; chapter: number; highlightVerseId?: string };
};
