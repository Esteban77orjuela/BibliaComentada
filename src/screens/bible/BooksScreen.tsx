// ============================================================
// BibliaPlus Pro — BooksScreen  (Redesign 2026)
// Lista de libros filtrada por testamento (AT o NT)
// ============================================================

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Book, BibleStackParamList, Testament } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';

type Route = RouteProp<BibleStackParamList, 'Books'>;
type Nav = NativeStackNavigationProp<BibleStackParamList, 'Books'>;

export default function BooksScreen() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const testament = route.params?.testament ?? 'AT';

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DatabaseService.getBooks().then(allBooks => {
      const filtered = allBooks.filter(b => b.testament === testament);
      setBooks(filtered);
      setLoading(false);
    });
  }, [testament]);

  const handleBookPress = useCallback(
    (book: Book) => {
      navigation.navigate('Chapters', { book });
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <FlatList
        data={books}
        keyExtractor={item => String(item.id)}
        renderItem={({ item, index }) => (
          <BookRow
            book={item}
            isFirst={index === 0}
            isLast={index === books.length - 1}
            onPress={handleBookPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader count={books.length} testament={testament} />}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function ListHeader({ count, testament }: { count: number; testament: Testament }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderCount}>{count} libros</Text>
    </View>
  );
}

function BookRow({
  book,
  isFirst,
  isLast,
  onPress,
}: {
  book: Book;
  isFirst: boolean;
  isLast: boolean;
  onPress: (book: Book) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.groupWrapper}>
      <TouchableOpacity
        onPress={() => onPress(book)}
        style={[
          styles.bookRow,
          isFirst && styles.bookRowFirst,
          isLast && styles.bookRowLast,
        ]}
        activeOpacity={0.6}
      >
        <View style={styles.bookInfo}>
          <Text style={styles.bookName}>{book.name}</Text>
          <Text style={styles.bookMeta}>{book.totalChapters} capítulos</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
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
    listContent: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing['3xl'],
    },
    listHeader: {
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.md,
    },
    listHeaderCount: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
    },

    // Group card wrapping all rows
    groupWrapper: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: Radius.lg,
      overflow: 'hidden',
      ...Shadows.sm,
      marginBottom: 1,
    },
    bookRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.base + 2,
      backgroundColor: colors.surfaceElevated,
    },
    bookRowFirst: {
      borderTopLeftRadius: Radius.lg,
      borderTopRightRadius: Radius.lg,
    },
    bookRowLast: {
      borderBottomLeftRadius: Radius.lg,
      borderBottomRightRadius: Radius.lg,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: Spacing.base,
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
    arrow: {
      fontSize: 22,
      color: colors.textMuted,
      lineHeight: 24,
    },
  });
