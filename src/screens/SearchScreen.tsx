// ============================================================
// BibliaPlus Pro — SearchScreen  (Redesign 2026)
// ============================================================

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BibleStackParamList, SearchResult } from '../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../constants/theme';
import { useTheme } from '../theme/ThemeProvider';
import * as DatabaseService from '../services/DatabaseService';
import { EmptyState } from '../components/layout';

type Nav = NativeStackNavigationProp<any>;

export default function SearchScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setLoading(true);
    setHasSearched(true);
    const res = await DatabaseService.searchContent(text);
    setResults(res);
    setLoading(false);
  }, []);

  const handleResultPress = useCallback(async (result: SearchResult) => {
    const books = await DatabaseService.getBooks();
    const book = books.find(b => b.id === result.verse.bookId);
    if (!book) return;
    navigation.navigate('BibleTab', {
      screen: 'Reader',
      params: { book, chapter: result.verse.chapter, highlightVerseId: result.verse.id },
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Búsqueda</Text>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchIcon}>
            <SearchIconSmall color={colors.textMuted} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar versículos y comentarios..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Buscando en las Escrituras…</Text>
        </View>
      ) : hasSearched && results.length === 0 ? (
        <EmptyState
          emoji="📭"
          title="No hay resultados"
          subtitle={`No se encontraron versículos para "${query}".`}
        />
      ) : !hasSearched ? (
        <EmptyState
          emoji="🔍"
          title="¿Qué deseas estudiar?"
          subtitle="Busca palabras clave, temas o frases en toda la Biblia."
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.verse.id}-${item.matchType}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ResultRow result={item} onPress={() => handleResultPress(item)} />
          )}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}
    </KeyboardAvoidingView>
  );
}

function SearchIconSmall({ color }: { color: string }) {
  return (
    <View>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: -3,
          right: -3,
          width: 6,
          height: 2,
          backgroundColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

function ResultRow({ result, onPress }: { result: SearchResult; onPress: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isComment = result.matchType === 'comment';
  return (
    <TouchableOpacity style={styles.resultCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.resultHeader}>
        <View style={[styles.badge, isComment && styles.badgeComment]}>
          <Text style={[styles.badgeText, isComment && styles.badgeTextComment]}>
            {isComment ? 'Comentario' : 'Versículo'}
          </Text>
        </View>
        <Text style={styles.reference}>
          {result.verse.bookName} {result.verse.chapter}:{result.verse.verse}
        </Text>
      </View>
      <Text style={styles.excerpt}>{result.excerpt}</Text>
      {isComment && result.theologian && (
        <Text style={styles.theologian}>— {result.theologian}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.base,
    },
    title: {
      fontFamily: Typography.display.bold,
      fontSize: FontSizes['2xl'],
      color: colors.textPrimary,
      marginBottom: Spacing.base,
    },
    searchBarWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderRadius: Radius.xl,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
      ...Shadows.sm,
    },
    searchIcon: {
      flexShrink: 0,
    },
    searchInput: {
      flex: 1,
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
      padding: 0,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontFamily: Typography.sans.regular,
      marginTop: Spacing.md,
      color: colors.textMuted,
      fontSize: FontSizes.sm,
    },
    list: {
      padding: Spacing.base,
      paddingBottom: Spacing['3xl'],
    },
    resultCard: {
      backgroundColor: colors.surfaceElevated,
      padding: Spacing.base,
      borderRadius: Radius.lg,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    resultHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    badge: {
      backgroundColor: colors.accentLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: Radius.full,
    },
    badgeComment: {
      backgroundColor: '#dbeafe',
    },
    badgeText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: 10,
      color: colors.accentDark,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    badgeTextComment: {
      color: '#1e40af',
    },
    reference: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.sm,
      color: colors.textPrimary,
    },
    excerpt: {
      fontFamily: Typography.serif.italic,
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginTop: Spacing.xs,
    },
    theologian: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      marginTop: Spacing.xs,
      textAlign: 'right',
    },
  });
