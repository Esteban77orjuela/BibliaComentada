import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DictionaryStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import { useTheme } from '../theme/ThemeProvider';
import DictionaryListScreen from '../screens/dictionaries/DictionaryListScreen';
import DictionaryDetailScreen from '../screens/dictionaries/DictionaryDetailScreen';

const Stack = createNativeStackNavigator<DictionaryStackParamList>();

export default function DictionaryStack() {
  const { colors } = useTheme();
  const screenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.textPrimary,
      headerTitleStyle: { fontFamily: Typography.sans.semiBold, color: colors.textPrimary },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: colors.background },
      animation: 'slide_from_right' as const,
    }),
    [colors]
  );

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="DictionaryList" component={DictionaryListScreen} options={{ title: 'Diccionario' }} />
      <Stack.Screen name="DictionaryDetail" component={DictionaryDetailScreen} options={{ title: 'Diccionario' }} />
    </Stack.Navigator>
  );
}
