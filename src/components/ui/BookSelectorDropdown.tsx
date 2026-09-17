// ============================================================
// BibliaPlus Pro — BookSelectorDropdown  (Redesign 2026)
// Selector jerárquico: libros → capítulos → versículos.
// El libro actual se abre expandido; tocar un capítulo revela
// sus versículos para saltar directo a cualquiera de ellos.
// ============================================================

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Modal,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Book, Testament } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';

interface BookSelectorDropdownProps {
  books: Book[];
  currentBookId: number;
  currentChapter: number;
  translationId: number;
  onNavigateTo: (book: Book, chapter: number, verseId?: string) => void;
  testamentFilter?: Testament;
}

const TESTAMENT_LABELS: Record<Testament, string> = {
  AT: 'Antiguo Testamento',
  NT: 'Nuevo Testamento',
};

interface BookSection {
  testament: Testament;
  label: string;
  data: Book[];
}

interface VerseRef {
  number: number;
  id: string;
}

export default function BookSelectorDropdown({
  books,
  currentBookId,
  currentChapter,
  translationId,
  onNavigateTo,
  testamentFilter,
}: BookSelectorDropdownProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const chipWidth = useMemo(() => Math.floor((width - Spacing.xl * 2 - 6 * Spacing.xs) / 7), [width]);

  const [visible, setVisible] = useState(false);
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const [versesByChapter, setVersesByChapter] = useState<Record<string, VerseRef[]>>({});
  const [loadingChapter, setLoadingChapter] = useState<string | null>(null);

  const sections = useMemo((): BookSection[] => {
    let filtered = books;
    if (testamentFilter) {
      filtered = filtered.filter(b => b.testament === testamentFilter);
    }
    const sections: BookSection[] = [];
    const at = filtered.filter(b => b.testament === 'AT');
    const nt = filtered.filter(b => b.testament === 'NT');
    if (at.length > 0) sections.push({ testament: 'AT', label: TESTAMENT_LABELS.AT, data: at });
    if (nt.length > 0) sections.push({ testament: 'NT', label: TESTAMENT_LABELS.NT, data: nt });
    return sections;
  }, [books, testamentFilter]);

  const handleOpen = () => {
    setExpandedBookId(currentBookId);
    setActiveChapter(null);
    setVisible(true);
  };

  const handleClose = () => setVisible(false);

  const toggleBook = (bookId: number) => {
    setExpandedBookId(prev => (prev === bookId ? null : bookId));
    setActiveChapter(null);
  };

  const toggleChapter = (book: Book, chapter: number) => {
    if (activeChapter === chapter && expandedBookId === book.id) {
      setActiveChapter(null);
      return;
    }
    setActiveChapter(chapter);
    const key = `${book.id}:${chapter}`;
    if (!versesByChapter[key]) {
      setLoadingChapter(key);
      DatabaseService.getVerses(book.id, chapter, translationId)
        .then(verses =>
          setVersesByChapter(prev => ({
            ...prev,
            [key]: verses.map(v => ({ number: v.verse, id: v.id })),
          }))
        )
        .catch(() => {})
        .finally(() => setLoadingChapter(null));
    }
  };

  const goToChapter = (book: Book, chapter: number) => {
    onNavigateTo(book, chapter);
    handleClose();
  };

  const goToVerse = (book: Book, chapter: number, verseId: string) => {
    onNavigateTo(book, chapter, verseId);
    handleClose();
  };

  const renderSectionHeader = ({ section }: { section: BookSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.label}</Text>
    </View>
  );

  const renderBook = ({ item }: { item: Book }) => {
    const expanded = expandedBookId === item.id;
    const isCurrentBook = item.id === currentBookId;
    return (
      <View key={item.id} style={styles.bookContainer}>
        <TouchableOpacity
          onPress={() => toggleBook(item.id)}
          style={[styles.bookRow, isCurrentBook && styles.bookRowCurrent]}
          activeOpacity={0.7}
        >
          <View style={styles.bookInfo}>
            <Text style={styles.bookName}>{item.name}</Text>
            <Text style={styles.bookMeta}>{item.totalChapters} capítulos</Text>
          </View>
          {isCurrentBook && <View style={styles.currentIndicator} />}
          <Text style={styles.rowChevron}>{expanded ? '▴' : '▾'}</Text>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.chaptersBlock}>
            <View style={styles.chapterGrid}>
              {Array.from({ length: item.totalChapters }, (_, i) => i + 1).map(n => {
                const isHere = isCurrentBook && currentChapter === n;
                const isActive = activeChapter === n;
                const highlight = isHere || isActive;
                return (
                  <TouchableOpacity
                    key={n}
                    onPress={() => toggleChapter(item, n)}
                    activeOpacity={0.7}
                    style={[styles.chapterChip, { width: chipWidth }, highlight && styles.chapterChipActive]}
                  >
                    <Text style={[styles.chapterChipText, highlight && styles.chapterChipTextActive]}>{n}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {activeChapter !== null && activeChapter <= item.totalChapters && (
              <View style={styles.versesBlock}>
                <View style={styles.versesHeader}>
                  <Text style={styles.versesTitle}>
                    Capítulo {activeChapter} · {versesByChapter[`${item.id}:${activeChapter}`]?.length ?? '…'} versículos
                  </Text>
                  <TouchableOpacity onPress={() => goToChapter(item, activeChapter)} hitSlop={8}>
                    <Text style={styles.versesLink}>Abrir capítulo ›</Text>
                  </TouchableOpacity>
                </View>
                {loadingChapter === `${item.id}:${activeChapter}` ? (
                  <ActivityIndicator color={colors.accent} style={styles.versesLoading} />
                ) : (
                  <View style={styles.versesWrap}>
                    {(versesByChapter[`${item.id}:${activeChapter}`] ?? []).map(v => (
                      <TouchableOpacity
                        key={v.number}
                        onPress={() => goToVerse(item, activeChapter, v.id)}
                        activeOpacity={0.7}
                        style={[styles.verseChip, { width: chipWidth }]}
                      >
                        <Text style={styles.verseChipText}>{v.number}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity onPress={handleOpen} style={styles.trigger} activeOpacity={0.8}>
        <Text style={styles.triggerText} numberOfLines={1}>
          {books.find(b => b.id === currentBookId)?.name ?? 'Seleccionar libro'}
          {` ${currentChapter}`}
        </Text>
        <Text style={styles.triggerChevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
        <SafeAreaView style={styles.modalOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ir a ubicación</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={8}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <SectionList
              sections={sections}
              keyExtractor={item => item.id.toString()}
              renderItem={renderBook}
              renderSectionHeader={renderSectionHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Radius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    triggerText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
      flexShrink: 1,
    },
    triggerChevron: {
      marginLeft: Spacing.xs,
      fontSize: FontSizes.sm,
      color: colors.textMuted,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
    },
    modalContent: {
      flex: 1,
      backgroundColor: colors.surfaceElevated,
      marginTop: 60,
      borderTopLeftRadius: Radius['2xl'],
      borderTopRightRadius: Radius['2xl'],
      ...Shadows.dark,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.md,
      color: colors.textPrimary,
    },
    closeButton: {
      fontSize: 20,
      color: colors.textMuted,
      padding: Spacing.xs,
    },
    listContent: {
      paddingBottom: Spacing['3xl'],
    },
    sectionHeader: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      backgroundColor: colors.surface,
    },
    sectionTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    bookContainer: {
      backgroundColor: colors.surfaceElevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    bookRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
    },
    bookRowCurrent: {
      backgroundColor: colors.accentLight,
    },
    bookInfo: {
      flex: 1,
    },
    bookName: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
    },
    bookMeta: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      marginTop: 2,
    },
    currentIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.accent,
      marginRight: Spacing.sm,
    },
    rowChevron: {
      fontSize: FontSizes.sm,
      color: colors.textMuted,
    },
    chaptersBlock: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.md,
    },
    chapterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    chapterChip: {
      height: 38,
      borderRadius: Radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chapterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    chapterChipText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
    },
    chapterChipTextActive: {
      color: colors.onAccent,
    },
    versesBlock: {
      marginTop: Spacing.md,
      paddingTop: Spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    versesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    versesTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
    },
    versesLink: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.xs,
      color: colors.accent,
    },
    versesLoading: {
      paddingVertical: Spacing.md,
    },
    versesWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    verseChip: {
      height: 38,
      borderRadius: Radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    verseChipText: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.sm,
      color: colors.textPrimary,
    },
  });