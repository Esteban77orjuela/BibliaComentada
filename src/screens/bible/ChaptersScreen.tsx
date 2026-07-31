// ============================================================
// BibliaPlus Pro — ChaptersScreen
// Grid numérico de capítulos del libro seleccionado
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BibleStackParamList } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import * as DatabaseService from '../../services/DatabaseService';

type Route = RouteProp<BibleStackParamList, 'Chapters'>;
type Nav = NativeStackNavigationProp<BibleStackParamList, 'Chapters'>;

const { width } = Dimensions.get('window');
const NUM_COLS = 5;
const CELL_SIZE = (width - Spacing.base * 2 - Spacing.sm * (NUM_COLS - 1)) / NUM_COLS;

export default function ChaptersScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { book } = route.params;

  const [totalChapters, setTotalChapters] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DatabaseService.getTotalChapters(book.id).then(n => {
      setTotalChapters(n);
      setLoading(false);
    });
  }, [book.id]);

  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header del libro */}
      <View style={styles.bookHeader}>
        <View style={styles.bookAbbrev}>
          <Text style={styles.bookAbbrevText}>{book.abbreviation}</Text>
        </View>
        <View>
          <Text style={styles.bookName}>{book.name}</Text>
          <Text style={styles.bookMeta}>
            {book.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'} ·{' '}
            {totalChapters} capítulos
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Selecciona un capítulo</Text>

      <FlatList
        data={chapters}
        keyExtractor={item => String(item)}
        numColumns={NUM_COLS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item: chapter }) => (
          <TouchableOpacity
            style={styles.chapterCell}
            onPress={() => navigation.navigate('Reader', { book, chapter })}
            activeOpacity={0.7}
          >
            <Text style={styles.chapterNumber}>{chapter}</Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
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

  // Book header
  bookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  bookAbbrev: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookAbbrevText: {
    fontFamily: Typography.sans.bold,
    fontSize: FontSizes.sm,
    color: Colors.accent,
  },
  bookName: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  bookMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },

  sectionLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },

  // Grid
  grid: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },
  row: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chapterCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  chapterNumber: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
});
