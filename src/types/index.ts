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
  id: string;
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

export interface DictionaryEntry {
  id: string;
  title: string;
  content: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  date: string;
}

export interface Translation {
  id: number;
  code: string;
  name: string;
  fullName: string;
  copyright: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface ChapterTarget {
  book: Book;
  chapter: number;
}

export interface Favorite {
  id: string;
  verseId: string;
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
}

export interface SearchResult {
  verse: Verse;
  matchType: 'verse' | 'comment';
  excerpt: string;
  theologian?: string;
}

export type BibleStackParamList = {
  Home: undefined;
  Books: { testament?: Testament };
  Chapters: { book: Book };
  Reader: { book: Book; chapter: number; highlightVerseId?: string };
  Settings: undefined;
};

export type DictionaryStackParamList = {
  DictionaryList: undefined;
  DictionaryDetail: { entry: DictionaryEntry };
};

export type ArticlesStackParamList = {
  ArticlesList: undefined;
  ArticleDetail: { article: Article };
};

export type RootTabParamList = {
  BibleTab: undefined;
  SearchTab: undefined;
  DictionariesTab: undefined;
  ArticlesTab: undefined;
  FavoritesTab: undefined;
};