import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArticlesStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import { useTheme } from '../theme/ThemeProvider';
import ArticlesListScreen from '../screens/articles/ArticlesListScreen';
import ArticleDetailScreen from '../screens/articles/ArticleDetailScreen';

const Stack = createNativeStackNavigator<ArticlesStackParamList>();

export default function ArticlesStack() {
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
      <Stack.Screen name="ArticlesList" component={ArticlesListScreen} options={{ title: 'Artículos' }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: 'Artículo' }} />
    </Stack.Navigator>
  );
}
