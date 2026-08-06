import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Article } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';

type Route = RouteProp<{ ArticleDetail: { article: Article } }, 'ArticleDetail'>;

export default function ArticleDetailScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const route = useRoute<Route>();
  const { article } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{article.category}</Text>
      </View>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.date}>{article.date}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{article.content}</Text>
    </ScrollView>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
    categoryBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.accentLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: Radius.full,
      marginBottom: Spacing.sm,
    },
    categoryText: {
      fontFamily: Typography.sans.semiBold,
      fontSize: 10,
      color: colors.accent,
      textTransform: 'uppercase',
    },
    title: {
      fontFamily: Typography.serif.bold,
      fontSize: FontSizes['2xl'],
      color: colors.textPrimary,
      marginBottom: Spacing.xs,
    },
    date: {
      fontFamily: Typography.sans.regular,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
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
