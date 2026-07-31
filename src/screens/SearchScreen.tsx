// ============================================================
// BibliaPlus Pro — SearchScreen
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BibleStackParamList, SearchResult } from '../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../constants/theme';
import * as DatabaseService from '../services/DatabaseService';
import SearchBar from '../components/ui/SearchBar';
import { EmptyState } from '../components/layout';

// Note: Navigating to 'Reader' which is in BibleStack from TabNavigator requires
// careful typing or a global nav ref. For simplicity in this demo, we'll assume
// we can navigate to BibleStack -> Reader.
type Nav = NativeStackNavigationProp<any>;

export default function SearchScreen() {
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
      params: {
        book,
        chapter: result.verse.chapter,
        highlightVerseId: result.verse.id,
      },
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Búsqueda Profunda</Text>
        <SearchBar onSearch={handleSearch} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Buscando en las Escrituras…</Text>
        </View>
      ) : hasSearched && results.length === 0 ? (
        <EmptyState
          emoji="📭"
          title="No hay resultados"
          subtitle={`No se encontraron versículos ni comentarios para "${query}".`}
        />
      ) : !hasSearched ? (
        <EmptyState
          emoji="🔍"
          title="¿Qué deseas estudiar hoy?"
          subtitle="Busca palabras clave, temas o frases en toda la Biblia y en los comentarios exegéticos."
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
        />
      )}
    </KeyboardAvoidingView>
  );
}

function ResultRow({ result, onPress }: { result: SearchResult; onPress: () => void }) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: Typography.sans.regular,
    marginTop: Spacing.md,
    color: Colors.textMuted,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },

  // Result Card
  resultCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.base,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  badge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  badgeComment: {
    backgroundColor: '#dbeafe', // blue-100
  },
  badgeText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.accentDark,
    textTransform: 'uppercase',
  },
  badgeTextComment: {
    color: '#1e40af', // blue-800
  },
  reference: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  excerpt: {
    fontFamily: Typography.serif.italic,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  theologian: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
