import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { DictionaryEntry } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';

type Route = RouteProp<{ DictionaryDetail: { entry: DictionaryEntry } }, 'DictionaryDetail'>;

export default function DictionaryDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
    title: {
      fontFamily: Typography.serif.bold,
      fontSize: FontSizes['2xl'],
      color: colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: Spacing.base,
    },
    body: {
      fontFamily: Typography.serif.regular,
      fontSize: FontSizes.base,
      color: colors.textSecondary,
      lineHeight: 26,
    },
  });
