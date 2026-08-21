// ============================================================
// BibliaPlus Pro — Bible Stack Navigator  (Redesign 2026)
// Home → Books (by testament) → Chapters → Reader → Settings
// ============================================================

import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BibleStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import { useTheme } from '../theme/ThemeProvider';
import HomeScreen from '../screens/bible/HomeScreen';
import BooksScreen from '../screens/bible/BooksScreen';
import ChaptersScreen from '../screens/bible/ChaptersScreen';
import ReaderScreen from '../screens/bible/ReaderScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<BibleStackParamList>();

export default function BibleStack() {
  const { colors } = useTheme();
  const screenOptions = useMemo(
    () => ({
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: {
        fontFamily: Typography.sans.semiBold,
        color: colors.textPrimary,
      },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right' as const,
    }),
    [colors]
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Books"
        component={BooksScreen}
        options={({ route }) => ({
          title: (route.params as any)?.testament === 'NT'
            ? 'Nuevo Testamento'
            : 'Antiguo Testamento',
        })}
      />
      <Stack.Screen
        name="Chapters"
        component={ChaptersScreen}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={({ route }) => ({
          title: `${route.params.book.name} ${route.params.chapter}`,
          headerLargeTitle: false,
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ajustes' }}
      />
    </Stack.Navigator>
  );
}
