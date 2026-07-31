import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ArticlesStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import ArticlesListScreen from '../screens/articles/ArticlesListScreen';
import ArticleDetailScreen from '../screens/articles/ArticleDetailScreen';

const Stack = createNativeStackNavigator<ArticlesStackParamList>();

export default function ArticlesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerTitleStyle: { fontFamily: Typography.sans.semiBold, color: Colors.textPrimary },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ArticlesList" component={ArticlesListScreen} options={{ title: 'Artículos' }} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: 'Artículo' }} />
    </Stack.Navigator>
  );
}
