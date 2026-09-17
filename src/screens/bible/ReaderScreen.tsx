// ============================================================
// BibliaPlus Pro — ReaderScreen  (Redesign 2026)
// Vista de capítulo — toca versículo → abre BottomSheet
// ============================================================

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BibleStackParamList, Verse, Book, Translation, ChapterTarget } from '../../types';

type Nav = NativeStackNavigationProp<BibleStackParamList, 'Reader'>;
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';
import VerseRow from '../../components/ui/VerseRow';
import VerseBottomSheet from '../../components/ui/VerseBottomSheet';
import { EmptyState } from '../../components/layout';
import BookSelectorDropdown from '../../components/ui/BookSelectorDropdown';
import TranslationSwitcher from '../../components/ui/TranslationSwitcher';
import ChapterArrowButton from '../../components/ui/ChapterArrowButton';

type Route = RouteProp<BibleStackParamList, 'Reader'>;

export default function ReaderScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<Route>();
  const { book, chapter, highlightVerseId } = route.params;
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<Nav>();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [booksLoading, setBooksLoading] = useState(true);
  const [translationId, setTranslationId] = useState<number>(1);

  // Load selected translation from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('selected_translation_id').then(saved => {
      if (saved) setTranslationId(parseInt(saved, 10));
    });
  }, []);

  // BottomSheet state
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Load books for dropdown
  useEffect(() => {
    DatabaseService.getBooks()
      .then(b => {
        setBooks(b);
        setBooksLoading(false);
      })
      .catch(e => console.warn('Error loading books:', e));
  }, []);

  // Load translations for switcher
  const [translations, setTranslations] = useState<Translation[]>([]);
  useEffect(() => {
    DatabaseService.getTranslations().then(t => setTranslations(t)).catch(() => {});
  }, []);

  const handleTranslationSelect = useCallback((id: number) => {
    setTranslationId(id);
    AsyncStorage.setItem('selected_translation_id', id.toString()).catch(() => {});
  }, []);

  // ── Load verses ──
  const prevTranslationRef = useRef<number>(translationId);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadingError('');
    if (prevTranslationRef.current !== translationId) {
      prevTranslationRef.current = translationId;
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
    DatabaseService.getVerses(book.id, chapter, translationId)
      .then(v => {
        if (cancelled) return;
        setVerses(v);
        setLoading(false);
      })
      .catch(e => {
        if (cancelled) return;
        console.warn('Error loading verses:', e);
        setLoadingError(e?.message ?? String(e));
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [book.id, chapter, translationId, reloadKey]);

  const handleGoto = useCallback(
    (targetBook: Book, chapterNum: number, verseId?: string) => {
      navigation.replace('Reader', {
        book: targetBook,
        chapter: chapterNum,
        highlightVerseId: verseId,
      });
    },
    [navigation]
  );

  // ── Capítulo anterior / siguiente (cruza de libro en los extremos) ──
  const { prevChapter, nextChapter } = useMemo(() => {
    const bookIndex = books.findIndex(b => b.id === book.id);
    const prevBook = bookIndex > 0 ? books[bookIndex - 1] : null;
    const nextBook = bookIndex >= 0 && bookIndex < books.length - 1 ? books[bookIndex + 1] : null;

    const prevTarget: ChapterTarget | null =
      chapter > 1
        ? { book, chapter: chapter - 1 }
        : prevBook
          ? { book: prevBook, chapter: prevBook.totalChapters }
          : null;

    const nextTarget: ChapterTarget | null =
      chapter < book.totalChapters
        ? { book, chapter: chapter + 1 }
        : nextBook
          ? { book: nextBook, chapter: 1 }
          : null;

    return { prevChapter: prevTarget, nextChapter: nextTarget };
  }, [books, book, chapter]);

  const handleChapterNavigate = useCallback(
    (target: ChapterTarget) => {
      navigation.replace('Reader', { book: target.book, chapter: target.chapter });
    },
    [navigation]
  );

  // ── Auto-scroll to highlighted verse ──
  useEffect(() => {
    if (!highlightVerseId || verses.length === 0) return;
    const idx = verses.findIndex(v => v.id === highlightVerseId);
    if (idx >= 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: idx, animated: true, viewOffset: 40 });
      }, 400);
    }
  }, [verses, highlightVerseId]);

  const handleVersePress = useCallback((verse: Verse) => {
    setSelectedVerse(verse);
    setSheetVisible(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Verse>) => (
      <VerseRow
        verse={item}
        isHighlighted={item.id === highlightVerseId && !sheetVisible}
        onPress={handleVersePress}
      />
    ),
    [highlightVerseId, sheetVisible, handleVersePress]
  );

  if (loading && verses.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (loadingError) {
    return (
      <View style={styles.loadingContainer}>
        <EmptyState
          emoji="⚠️"
          title="No se pudo cargar el capítulo"
          subtitle={`${loadingError}\nToca Reintentar para volver a intentarlo.`}
        />
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setReloadKey(k => k + 1)}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (verses.length === 0) {
    return (
      <EmptyState
        emoji="📜"
        title="Sin versículos disponibles"
        subtitle="Los datos de este capítulo aún no están disponibles."
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={verses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
<ChapterHeader
        book={book}
        chapter={chapter}
        total={verses.length}
        books={books}
        translations={translations}
        translationId={translationId}
        prevTarget={prevChapter}
        nextTarget={nextChapter}
        onGoto={handleGoto}
        onTranslationSelect={handleTranslationSelect}
        onChapterNavigate={handleChapterNavigate}
      />
        }
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />

      {/* BottomSheet de comentarios */}
      <VerseBottomSheet
        verse={selectedVerse}
        visible={sheetVisible}
        onClose={handleCloseSheet}
        translationId={translationId}
      />
    </View>
  );
}

function ChapterHeader({
  book,
  chapter,
  total,
  books,
  translations,
  translationId,
  prevTarget,
  nextTarget,
  onGoto,
  onTranslationSelect,
  onChapterNavigate,
}: {
  book: Book;
  chapter: number;
  total: number;
  books: Book[];
  translations: Translation[];
  translationId: number;
  prevTarget: ChapterTarget | null;
  nextTarget: ChapterTarget | null;
  onGoto: (book: Book, chapter: number, verseId?: string) => void;
  onTranslationSelect: (id: number) => void;
  onChapterNavigate: (target: ChapterTarget) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.chapterHeader}>
      <View style={styles.controlsRow}>
        <ChapterArrowButton
          direction="prev"
          target={prevTarget}
          onNavigate={onChapterNavigate}
        />
        <View style={styles.selectors}>
          <BookSelectorDropdown
            books={books}
            currentBookId={book.id}
            currentChapter={chapter}
            translationId={translationId}
            onNavigateTo={onGoto}
          />
          <TranslationSwitcher
            translations={translations}
            currentTranslationId={translationId}
            onSelect={onTranslationSelect}
          />
        </View>
        <ChapterArrowButton
          direction="next"
          target={nextTarget}
          onNavigate={onChapterNavigate}
        />
      </View>
      <Text style={styles.chapterMeta}>
        Capítulo {chapter} de {book.totalChapters} · {total} versículos
      </Text>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    retryButton: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
      backgroundColor: colors.accent,
    },
    retryText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.onAccent,
    },
    listContent: {
      paddingTop: Spacing.base,
      paddingBottom: Spacing['4xl'],
    },

    // Chapter Header
    chapterHeader: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.base,
      paddingTop: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      marginBottom: Spacing.base,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    selectors: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    chapterMeta: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      textAlign: 'center',
      marginTop: Spacing.sm,
    },
  });

