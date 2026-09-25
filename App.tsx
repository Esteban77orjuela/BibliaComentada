import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  openDatabaseAsync,
  importDatabaseFromAssetAsync,
  deleteDatabaseAsync,
} from 'expo-sqlite';
import * as SystemUI from 'expo-system-ui';
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
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

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
CREATE TABLE IF NOT EXISTS translations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  copyright TEXT,
  is_default INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS verses (
  id TEXT NOT NULL,
  book_id INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation_id INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (translation_id, id)
);
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

function AppContent() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

  // Fondo raíz del sistema: evita destello blanco en transiciones (Android)
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

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
        const needsReimport = !verRow || verRow.value !== '2076';

        if (needsReimport) {
          await db.execAsync('PRAGMA wal_checkpoint(TRUNCATE);').catch(() => {});
          await db.closeAsync();

          // Borra la BD vieja por completo (junto a sus archivos -wal/-shm) para que el
          // reimport siempre parta de un archivo limpio, sin depender de forceOverwrite.
          try {
            await deleteDatabaseAsync('bible.db');
          } catch {} // Si no se puede eliminar, el import con forceOverwrite la reemplaza igual

          await importDatabaseFromAssetAsync('bible.db', {
            assetId: require('./assets/bible.db'),
            forceOverwrite: true,
          });

          db = await openDatabaseAsync('bible.db');
          await db.execAsync(MIGRATIONS);

          const ver2 = await db.getFirstAsync<{ value: string }>(
            "SELECT value FROM _metadata WHERE key = 'db_version'"
          );
          const cols = await db.getAllAsync<{ name: string }>(
            "SELECT name FROM pragma_table_info('verses')"
          );
          const hasTranslationId = cols.some((c) => c.name === 'translation_id');
          if (!ver2 || ver2.value !== '2076' || !hasTranslationId) {
            throw new Error('La base de datos incluida no pudo actualizarse (versión esperada: 2076).');
          }
        }

        // Reparación idempotente: si la tabla verses quedó con el esquema viejo (sin
        // translation_id), la columna se agrega. Los versos antiguos eran RV1960.
        const verseCols = await db.getAllAsync<{ name: string }>(
          "SELECT name FROM pragma_table_info('verses')"
        );
        if (!verseCols.some((c) => c.name === 'translation_id')) {
          await db.execAsync(
            'ALTER TABLE verses ADD COLUMN translation_id INTEGER NOT NULL DEFAULT 1;'
          );
          console.log(
            '[DBINFO] columna translation_id agregada a verses (esquema viejo reparado)'
          );
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
        <ActivityIndicator size="large" color={colors.accent} />
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
        <ActivityIndicator size="large" color={colors.accent} />
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
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    splash: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontFamily: Typography.sans.regular,
      fontSize: 14,
      color: colors.textMuted,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorText: {
      fontFamily: Typography.sans.regular,
      fontSize: 14,
      color: colors.accent,
      textAlign: 'center',
      paddingHorizontal: 24,
    },
    retryButton: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 10,
      backgroundColor: colors.accent,
      borderRadius: 8,
    },
    retryText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: 14,
      color: '#FFFFFF',
    },
  });
