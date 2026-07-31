// ============================================================
// BibliaPlus Pro — Layout components
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';

// ─────────────────────────────────────────────────────────────
// SectionHeader — AT / NT divider
// ─────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string;
  count?: number;
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLine} />
      <View style={styles.sectionLabelWrapper}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && (
          <Text style={styles.sectionCount}>{count} libros</Text>
        )}
      </View>
      <View style={styles.sectionLine} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────
// EmptyState — Pantalla vacía reutilizable
// ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ emoji, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  // SectionHeader
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionLabelWrapper: {
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sectionCount: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },

  // EmptyState
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
