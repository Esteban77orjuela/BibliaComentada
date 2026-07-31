import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { DictionaryEntry } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';

type Route = RouteProp<{ DictionaryDetail: { entry: DictionaryEntry } }, 'DictionaryDetail'>;

export default function DictionaryDetailScreen() {
  const route = useRoute<Route>();
  const { entry } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{entry.title}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{entry.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.base,
  },
  body: {
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
});
