// ============================================================
// BibliaPlus Pro — ChaptersScreen  (Redesign 2026)
// Grid de capítulos 4 columnas con celdas premium
// ============================================================

import React, { useEffect, useState, useMemo } from 'react';
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
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';

type Route = RouteProp<BibleStackParamList, 'Chapters'>;
type Nav = NativeStackNavigationProp<BibleStackParamList, 'Chapters'>;

const { width } = Dimensions.get('window');
const NUM_COLS = 4;
const CELL_GAP = Spacing.sm;
const CELL_SIZE = (width - Spacing.base * 2 - CELL_GAP * (NUM_COLS - 1)) / NUM_COLS;

export default function ChaptersScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bookHeader}>
        <Text style={styles.bookHeaderLabel}>SELECCIONAR CAPÍTULO</Text>
        <Text style={styles.bookHeaderName}>{book.name}</Text>
        <Text style={styles.bookHeaderMeta}>
          {book.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'} · {totalChapters} capítulos
        </Text>
      </View>

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

    // Book header
    bookHeader: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      paddingBottom: Spacing.xl,
    },
    bookHeaderLabel: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: Spacing.xs,
    },
    bookHeaderName: {
      fontFamily: Typography.display.bold,
      fontSize: FontSizes['2xl'],
      color: colors.textPrimary,
      lineHeight: 36,
    },
    bookHeaderMeta: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.sm,
      color: colors.textMuted,
      marginTop: Spacing.xs,
    },

    // Grid
    grid: {
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing['3xl'],
    },
    row: {
      gap: CELL_GAP,
      marginBottom: CELL_GAP,
    },
    chapterCell: {
      width: CELL_SIZE,
      height: CELL_SIZE,
      borderRadius: Radius.lg,
      backgroundColor: colors.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.sm,
    },
    chapterNumber: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.md,
      color: colors.textPrimary,
    },
  });
