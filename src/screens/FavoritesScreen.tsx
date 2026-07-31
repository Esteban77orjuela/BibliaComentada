// ============================================================
// BibliaPlus Pro — FavoritesScreen
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
import { Colors, Typography, FontSizes, Spacing, Radius } from '../constants/theme';
import * as FavoritesStore from '../store/FavoritesStore';
import { EmptyState } from '../components/layout';

type Nav = NativeStackNavigationProp<any>;

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  // Refresca la lista cada vez que la pantalla gana foco
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
          abbreviation: fav.bookName.substring(0, 3), // mock
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
      '¿Estás seguro de que quieres eliminar este versículo de tus favoritos?',
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
        <Text style={styles.title}>Mis Favoritos</Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState
          emoji="🔖"
          title="Sin favoritos"
          subtitle="Toca el ícono de marca páginas al leer un versículo para guardarlo aquí."
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <FavoriteRow
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

function FavoriteRow({
  favorite,
  onPress,
  onRemove,
}: {
  favorite: Favorite;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.reference}>
          {favorite.bookName} {favorite.chapter}:{favorite.verse}
        </Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={onRemove} hitSlop={10}>
          <Text style={styles.deleteIcon}>🗑️</Text>
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
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },

  // Card
  card: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.base,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
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
  deleteBtn: {
    padding: Spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
