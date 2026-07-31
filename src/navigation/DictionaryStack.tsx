import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DictionaryStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';
import DictionaryListScreen from '../screens/dictionaries/DictionaryListScreen';
import DictionaryDetailScreen from '../screens/dictionaries/DictionaryDetailScreen';

const Stack = createNativeStackNavigator<DictionaryStackParamList>();

export default function DictionaryStack() {
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
      <Stack.Screen name="DictionaryList" component={DictionaryListScreen} options={{ title: 'Diccionario' }} />
      <Stack.Screen name="DictionaryDetail" component={DictionaryDetailScreen} options={{ title: 'Diccionario' }} />
    </Stack.Navigator>
  );
}
