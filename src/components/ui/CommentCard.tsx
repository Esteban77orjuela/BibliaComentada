// ============================================================
// BibliaPlus Pro — CommentCard
// Tarjeta de comentario exegético de un teólogo
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import SimpleHTML from './SimpleHTML';

interface CommentCardProps {
  comment: Comment;
}

const THEOLOGIAN_META: Record<string, { dates: string; title: string; color: string }> = {
  'Matthew Henry': {
    dates: '1662–1714',
    title: 'Comentarista puritano',
    color: '#065f46',
  },
  'Juan Calvino': {
    dates: '1509–1564',
    title: 'Reformador ginebrino',
    color: '#1e40af',
  },
  'Charles Spurgeon': {
    dates: '1834–1892',
    title: 'Príncipe de los predicadores',
    color: '#9d174d',
  },
};

export default function CommentCard({ comment }: CommentCardProps) {
  const meta = THEOLOGIAN_META[comment.theologian] ?? {
    dates: '',
    title: 'Teólogo',
    color: Colors.accent,
  };

  return (
    <View style={styles.card}>
      {/* Header teólogo */}
      <View style={styles.header}>
        <View style={[styles.accentBar, { backgroundColor: meta.color }]} />
        <View style={styles.headerText}>
          <Text style={[styles.theologianName, { color: meta.color }]}>
            {comment.theologian}
          </Text>
          <Text style={styles.theologianMeta}>
            {meta.title}
            {meta.dates ? ` · ${meta.dates}` : ''}
          </Text>
        </View>
        <Text style={styles.quoteGlyph}>"</Text>
      </View>

      {/* Cuerpo del comentario */}
      <View style={styles.commentBody}>
        <SimpleHTML html={comment.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  accentBar: {
    width: 3,
    height: 36,
    borderRadius: Radius.sm,
    marginRight: Spacing.md,
  },
  headerText: {
    flex: 1,
  },
  theologianName: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.base,
  },
  theologianMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quoteGlyph: {
    fontSize: 48,
    lineHeight: 52,
    color: Colors.border,
    fontFamily: Typography.serif.bold,
    marginTop: -8,
  },
  commentBody: {
    padding: Spacing.base,
  },
});
