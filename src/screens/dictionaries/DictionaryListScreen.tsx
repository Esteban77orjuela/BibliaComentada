import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DictionaryEntry } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';
import SearchBar from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/layout';

export default function DictionaryListScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      DatabaseService.getDictionaryEntries().then(data => {
        setEntries(data);
        setLoading(false);
      });
    }, [])
  );

  const handleSearch = useCallback(async (text: string) => {
    if (!text.trim()) {
      const data = await DatabaseService.getDictionaryEntries();
      setEntries(data);
      return;
    }
    const results = await DatabaseService.searchDictionary(text);
    setEntries(results);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Diccionario Bíblico</Text>
          <SearchBar onSearch={handleSearch} />
        </View>
        <EmptyState
          emoji="📖"
          title="Sin resultados"
          subtitle="No se encontraron entradas en el diccionario."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Diccionario Bíblico</Text>
        <SearchBar onSearch={handleSearch} />
      </View>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('DictionaryDetail', { entry: item })}
          >
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryPreview} numberOfLines={3}>
              {item.content}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    header: {
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.md,
      backgroundColor: colors.surfaceElevated,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontFamily: Typography.serif.bold,
      fontSize: FontSizes.xl,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    list: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
    card: {
      backgroundColor: colors.surfaceElevated,
      padding: Spacing.base,
      borderRadius: Radius.md,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    entryTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.base,
      color: colors.accent,
      marginBottom: Spacing.xs,
    },
    entryPreview: {
      fontFamily: Typography.serif.regular,
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });
