// ============================================================
// BibliaPlus Pro — ReaderScreen
// Vista principal de lectura de capítulo con versículos expandibles
// ============================================================

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { BibleStackParamList, Verse } from '../../types';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';
import * as DatabaseService from '../../services/DatabaseService';
import VerseRow from '../../components/ui/VerseRow';
import { EmptyState } from '../../components/layout';

type Route = RouteProp<BibleStackParamList, 'Reader'>;

export default function ReaderScreen() {
  const route = useRoute<Route>();
  const { book, chapter, highlightVerseId } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVerseId, setExpandedVerseId] = useState<string | null>(
    highlightVerseId ?? null
  );

  // ── Load verses ──
  useEffect(() => {
    setLoading(true);
    setExpandedVerseId(highlightVerseId ?? null);
    DatabaseService.getVerses(book.id, chapter).then(v => {
      setVerses(v);
      setLoading(false);
    });
  }, [book.id, chapter, highlightVerseId]);

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

  const handleToggle = useCallback((verseId: string) => {
    setExpandedVerseId(prev => (prev === verseId ? null : verseId));
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Verse>) => (
      <VerseRow
        verse={item}
        isExpanded={expandedVerseId === item.id}
        isHighlighted={item.id === highlightVerseId && expandedVerseId !== item.id}
        onToggle={handleToggle}
      />
    ),
    [expandedVerseId, highlightVerseId, handleToggle]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (verses.length === 0) {
    return (
      <EmptyState
        emoji="📜"
        title="Sin versículos disponibles"
        subtitle="Los datos de este capítulo aún no están en el mock. Estarán disponibles con el archivo .db real."
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
        ListHeaderComponent={<ChapterHeader book={book.name} chapter={chapter} total={verses.length} />}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={info => {
          // Fallback: scroll to offset estimate
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }}
      />
    </View>
  );
}

function ChapterHeader({
  book,
  chapter,
  total,
}: {
  book: string;
  chapter: number;
  total: number;
}) {
  return (
    <View style={styles.chapterHeader}>
      <Text style={styles.chapterTitle}>
        {book} {chapter}
      </Text>
      <Text style={styles.chapterMeta}>{total} versículos</Text>
      <Text style={styles.chapterHint}>
        Toca un versículo para ver comentarios exegéticos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing['3xl'],
  },

  // Chapter Header
  chapterHeader: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    marginBottom: Spacing.sm,
  },
  chapterTitle: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
  },
  chapterMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  chapterHint: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.accent,
    marginTop: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});
