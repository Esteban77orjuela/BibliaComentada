// ============================================================
// BibliaPlus Pro — ReaderScreen  (Redesign 2026)
// Vista de capítulo — toca versículo → abre BottomSheet
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
import VerseBottomSheet from '../../components/ui/VerseBottomSheet';
import { EmptyState } from '../../components/layout';

type Route = RouteProp<BibleStackParamList, 'Reader'>;

export default function ReaderScreen() {
  const route = useRoute<Route>();
  const { book, chapter, highlightVerseId } = route.params;
  const flatListRef = useRef<FlatList>(null);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  // BottomSheet state
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // ── Load verses ──
  useEffect(() => {
    setLoading(true);
    DatabaseService.getVerses(book.id, chapter).then(v => {
      setVerses(v);
      setLoading(false);
    });
  }, [book.id, chapter]);

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
          <ChapterHeader book={book.name} chapter={chapter} total={verses.length} />
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
      <Text style={styles.chapterMeta}>{total} versículos · Toca para ver comentarios</Text>
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
    paddingTop: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },

  // Chapter Header
  chapterHeader: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.base,
  },
  chapterTitle: {
    fontFamily: Typography.display.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  chapterMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
});
