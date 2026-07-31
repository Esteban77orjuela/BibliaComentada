// ============================================================
// BibliaPlus Pro — FavoritesStore
// Gestión de versículos favoritos con AsyncStorage
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Verse } from '../types';

const STORAGE_KEY = '@bibliaplus_favorites';

// ─────────────────────────────────────────────────────────────
// Core CRUD
// ─────────────────────────────────────────────────────────────

export async function getFavorites(): Promise<Favorite[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    return JSON.parse(json) as Favorite[];
  } catch {
    return [];
  }
}

export async function isFavorite(verseId: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.some(f => f.verseId === verseId);
}

export async function addFavorite(verse: Verse): Promise<void> {
  const favorites = await getFavorites();
  if (favorites.some(f => f.verseId === verse.id)) return; // ya existe

  const newFav: Favorite = {
    id: `fav-${verse.id}-${Date.now()}`,
    verseId: verse.id,
    bookId: verse.bookId,
    bookName: verse.bookName,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
    savedAt: Date.now(),
  };

  const updated = [newFav, ...favorites];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function removeFavorite(verseId: string): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.filter(f => f.verseId !== verseId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function toggleFavorite(verse: Verse): Promise<boolean> {
  const already = await isFavorite(verse.id);
  if (already) {
    await removeFavorite(verse.id);
    return false;
  } else {
    await addFavorite(verse);
    return true;
  }
}

export async function clearFavorites(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
