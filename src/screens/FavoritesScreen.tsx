// ============================================================
// BibliaPlus Pro — FavoritesScreen  (Redesign 2026)
// ============================================================

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Favorite } from '../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../constants/theme';
import * as FavoritesStore from '../store/FavoritesStore';
import { EmptyState } from '../components/layout';

type Nav = NativeStackNavigationProp<any>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useFocusEffect(
    useCallback(() => {
      FavoritesStore.getFavorites().then(setFavorites);
    }, [])
  );

  const handlePress = (fav: Favorite) => {
    navigation.navigate('BibleTab', {
      screen: 'Reader',
      params: {
        book: {
          id: fav.bookId,
          name: fav.bookName,
          abbreviation: fav.bookName.substring(0, 3),
          testament: fav.bookId <= 39 ? 'AT' : 'NT',
        },
        chapter: fav.chapter,
        highlightVerseId: fav.verseId,
      },
    });
  };

  const handleRemove = (verseId: string) => {
    Alert.alert(
      'Eliminar favorito',
      '¿Estás seguro de que quieres eliminar este versículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await FavoritesStore.removeFavorite(verseId);
            const updated = await FavoritesStore.getFavorites();
            setFavorites(updated);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Guardados</Text>
        {favorites.length > 0 && (
          <Text style={styles.count}>{favorites.length} versículos</Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Sin guardados"
          subtitle="Toca cualquier versículo y guárdalo para leerlo aquí."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavoriteCard
              favorite={item}
              onPress={() => handlePress(item)}
              onRemove={() => handleRemove(item.verseId)}
            />
          )}
        />
      )}
    </View>
  );
}

function FavoriteCard({
  favorite,
  onPress,
  onRemove,
}: {
  favorite: Favorite;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardHeader}>
        <Text style={styles.reference}>
          {favorite.bookName} {favorite.chapter}:{favorite.verse}
        </Text>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove} hitSlop={12}>
          <View style={styles.removeIcon}>
            <View style={{ width: 12, height: 2, backgroundColor: Colors.textMuted, borderRadius: 1, transform: [{ rotate: '45deg' }], position: 'absolute' }} />
            <View style={{ width: 12, height: 2, backgroundColor: Colors.textMuted, borderRadius: 1, transform: [{ rotate: '-45deg' }], position: 'absolute' }} />
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.text} numberOfLines={3}>
        {favorite.text}
      </Text>
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
    paddingBottom: Spacing.base,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.md,
  },
  title: {
    fontFamily: Typography.display.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
  },
  count: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reference: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.accent,
  },
  text: {
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  removeBtn: {
    padding: Spacing.xs,
  },
  removeIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
