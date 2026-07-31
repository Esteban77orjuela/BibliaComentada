import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Article } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';

type Route = RouteProp<{ ArticleDetail: { article: Article } }, 'ArticleDetail'>;

export default function ArticleDetailScreen() {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
  },
  categoryText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: 10,
    color: Colors.accent,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes['2xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
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
