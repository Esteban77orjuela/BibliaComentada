// ============================================================
// BibliaPlus Pro — BooksScreen
// Lista de libros dividida en AT / NT
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Book, BibleStackParamList } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import * as DatabaseService from '../../services/DatabaseService';
import { SectionHeader, EmptyState } from '../../components/layout';

type Nav = NativeStackNavigationProp<BibleStackParamList, 'Books'>;

interface Section {
  title: string;
  count: number;
  data: Book[];
}

export default function BooksScreen() {
  const navigation = useNavigation<Nav>();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DatabaseService.getBooks().then(books => {
      const at = books.filter(b => b.testament === 'AT');
      const nt = books.filter(b => b.testament === 'NT');
      setSections([
        { title: 'Antiguo Testamento', count: at.length, data: at },
        { title: 'Nuevo Testamento', count: nt.length, data: nt },
      ]);
      setLoading(false);
    });
  }, []);

  const handleBookPress = useCallback(
    (book: Book) => {
      navigation.navigate('Chapters', { book });
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title} count={section.count} />
        )}
        renderItem={({ item: book, index, section }) => (
          <BookRow
            book={book}
            isLast={index === section.data.length - 1}
            onPress={handleBookPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Header />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>La Santa Biblia</Text>
      <Text style={styles.headerSubtitle}>
        Reina-Valera 1960 · 66 libros · Comentarios exegéticos
      </Text>
      <View style={styles.headerDivider} />
    </View>
  );
}

function BookRow({
  book,
  isLast,
  onPress,
}: {
  book: Book;
  isLast: boolean;
  onPress: (book: Book) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onPress(book)}
      style={[styles.bookRow, isLast && styles.bookRowLast]}
      activeOpacity={0.6}
    >
      {/* Abreviatura */}
      <View style={styles.abbrevContainer}>
        <Text style={styles.abbrevText}>{book.abbreviation}</Text>
      </View>

      {/* Info */}
      <View style={styles.bookInfo}>
        <Text style={styles.bookName}>{book.name}</Text>
        <Text style={styles.bookMeta}>{book.totalChapters} capítulos</Text>
      </View>

      {/* Flecha */}
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
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

  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: Spacing.base,
  },

  // List
  listContent: {
    paddingBottom: Spacing['2xl'],
  },

  // Book row
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  bookRowLast: {
    borderBottomWidth: 0,
  },
  abbrevContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  abbrevText: {
    fontFamily: Typography.sans.bold,
    fontSize: FontSizes.xs,
    color: Colors.accent,
    textAlign: 'center',
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bookMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
});
