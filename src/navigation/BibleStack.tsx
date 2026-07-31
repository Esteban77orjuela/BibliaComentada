// ============================================================
// BibliaPlus Pro — Bible Stack Navigator
// Books → Chapters → Reader
// ============================================================

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BibleStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import BooksScreen from '../screens/bible/BooksScreen';
import ChaptersScreen from '../screens/bible/ChaptersScreen';
import ReaderScreen from '../screens/bible/ReaderScreen';

const Stack = createNativeStackNavigator<BibleStackParamList>();

export default function BibleStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: {
          fontFamily: Typography.sans.semiBold,
          color: Colors.textPrimary,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Books"
        component={BooksScreen}
        options={{ title: 'La Biblia' }}
      />
      <Stack.Screen
        name="Chapters"
        component={ChaptersScreen}
        options={({ route }) => ({ title: route.params.book.name })}
      />
      <Stack.Screen
        name="Reader"
        component={ReaderScreen}
        options={({ route }) => ({
          title: `${route.params.book.abbreviation} ${route.params.chapter}`,
          headerLargeTitle: false,
        })}
      />
    </Stack.Navigator>
  );
}
