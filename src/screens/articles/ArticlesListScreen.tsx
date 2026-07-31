import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Article } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import * as DatabaseService from '../../services/DatabaseService';
import { EmptyState } from '../../components/layout';

export default function ArticlesListScreen({ navigation }: any) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      DatabaseService.getArticles().then(data => {
        setArticles(data);
        setLoading(false);
      });
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (articles.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Artículos</Text>
          <Text style={styles.subtitle}>Meditaciones y estudios bíblicos</Text>
        </View>
        <EmptyState
          emoji="📝"
          title="Sin artículos disponibles"
          subtitle="Los artículos se agregarán próximamente."
        />
      </View>
    );
  }

  const categories = [...new Set(articles.map(a => a.category))];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Artículos</Text>
        <Text style={styles.subtitle}>Meditaciones y estudios bíblicos</Text>
      </View>
      <FlatList
        data={articles}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ArticleDetail', { article: item })}
          >
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleSummary} numberOfLines={3}>
              {item.summary}
            </Text>
            <Text style={styles.articleDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  list: { padding: Spacing.base, paddingBottom: Spacing['3xl'] },
  card: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.base,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
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
  articleTitle: {
    fontFamily: Typography.serif.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  articleSummary: {
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  articleDate: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
});
