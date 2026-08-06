import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { openDatabaseAsync, importDatabaseFromAssetAsync } from 'expo-sqlite';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Merriweather_400Regular,
  Merriweather_700Bold,
  Merriweather_400Regular_Italic,
} from '@expo-google-fonts/merriweather';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';

import TabNavigator from './src/navigation/TabNavigator';
import * as DatabaseService from './src/services/DatabaseService';
import { Colors, Typography } from './src/constants/theme';

const MIGRATIONS = `PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS comment_authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  lifespan TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  verse_id TEXT NOT NULL,
  theologian TEXT NOT NULL,
  text TEXT NOT NULL,
  FOREIGN KEY (verse_id) REFERENCES verses(id)
);
CREATE INDEX IF NOT EXISTS idx_comments_verse ON comments(verse_id);
CREATE TABLE IF NOT EXISTS dictionary_entries (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS _metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);`;

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Merriweather_400Regular,
    Merriweather_700Bold,
    Merriweather_400Regular_Italic,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold_Italic,
  });

  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    let mounted = true;
    let fallbackTimer: ReturnType<typeof setInterval>;

    async function init() {
      try {
        let db = await openDatabaseAsync('bible.db');
        await db.execAsync(MIGRATIONS);

        const verRow = await db.getFirstAsync<{ value: string }>(
          "SELECT value FROM _metadata WHERE key = 'db_version'"
        );
        const needsReimport = !verRow || verRow.value !== '4';

        if (needsReimport) {
          await db.closeAsync();
          await importDatabaseFromAssetAsync('bible.db', {
            assetId: require('./assets/bible.db'),
            forceOverwrite: true,
          });
          db = await openDatabaseAsync('bible.db');
          await db.execAsync(MIGRATIONS);
        }

        if (!mounted) return;
        DatabaseService.setDb(db);
        if (!mounted) return;
        setState('ready');
      } catch (e: any) {
        if (!mounted) return;
        console.warn('Database init error:', e);
        setErrorMessage(e?.message ?? String(e));
        setState('error');
      }
    }

    init().catch((e) => {
      if (!mounted) return;
      console.warn('Unexpected init error:', e);
      setErrorMessage(e?.message ?? String(e));
      setState('error');
    });

    fallbackTimer = setInterval(() => {
      if (DatabaseService.isReady() && mounted) {
        clearInterval(fallbackTimer);
        setState('ready');
      }
    }, 200);

    const timeoutId = setTimeout(() => {
      if (mounted && state === 'loading') {
        setLoadingTimeout(true);
      }
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(fallbackTimer);
      clearTimeout(timeoutId);
    };
  }, []);

  const resetApp = useCallback(() => {
    setState('loading');
    setLoadingTimeout(false);
    setErrorMessage('');
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.splash}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Cargando la Biblia…</Text>
        {loadingTimeout && (
          <TouchableOpacity style={styles.retryButton} onPress={resetApp}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  splash: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: Typography.sans.regular,
    fontSize: 14,
    color: Colors.accent,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: Colors.accent,
    borderRadius: 8,
  },
  retryText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
