// ============================================================
// BibliaPlus Pro — CommentCard  (Redesign 2026)
// Comentario fluido dentro del BottomSheet (sin card envuelto)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '../../types';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';
import SimpleHTML from './SimpleHTML';

interface CommentCardProps {
  comment: Comment;
}

const THEOLOGIAN_META: Record<string, { dates: string; title: string }> = {
  'Matthew Henry': {
    dates: '1662–1714',
    title: 'Comentarista puritano',
  },
  'Juan Calvino': {
    dates: '1509–1564',
    title: 'Reformador ginebrino',
  },
  'Charles Spurgeon': {
    dates: '1834–1892',
    title: 'Príncipe de los predicadores',
  },
};

export default function CommentCard({ comment }: CommentCardProps) {
  const meta = THEOLOGIAN_META[comment.theologian] ?? {
    dates: '',
    title: 'Teólogo',
  };

  return (
    <View style={styles.container}>
      {/* Línea decorativa + info del teólogo */}
      <View style={styles.theologianRow}>
        <View style={styles.accentLine} />
        <View>
          <Text style={styles.theologianMeta}>
            {meta.title}{meta.dates ? ` · ${meta.dates}` : ''}
          </Text>
        </View>
      </View>

      {/* Cuerpo del comentario */}
      <SimpleHTML html={comment.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  theologianRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  accentLine: {
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  theologianMeta: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
});
