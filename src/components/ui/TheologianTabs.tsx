// ============================================================
// BibliaPlus Pro — TheologianTabs
// Tabs horizontales scrollables para seleccionar teólogos
// ============================================================

import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';

interface TheologianTabsProps {
  theologians: string[];
  selected: string | null;
  onSelect: (theologian: string) => void;
}

const THEOLOGIAN_INITIALS: Record<string, string> = {
  'Matthew Henry': 'MH',
  'Juan Calvino': 'JC',
  'Charles Spurgeon': 'CS',
};

const THEOLOGIAN_COLORS: Record<string, { bg: string; text: string }> = {
  'Matthew Henry': { bg: '#d1fae5', text: '#065f46' },   // emerald tint
  'Juan Calvino':  { bg: '#dbeafe', text: '#1e40af' },   // blue tint
  'Charles Spurgeon': { bg: '#fce7f3', text: '#9d174d' }, // pink tint
};

export default function TheologianTabs({
  theologians,
  selected,
  onSelect,
}: TheologianTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {theologians.map(theologian => {
        const isSelected = theologian === selected;
        const colors = THEOLOGIAN_COLORS[theologian] ?? { bg: Colors.accentLight, text: Colors.accent };
        const initials = THEOLOGIAN_INITIALS[theologian] ?? theologian.slice(0, 2).toUpperCase();

        return (
          <TouchableOpacity
            key={theologian}
            onPress={() => onSelect(theologian)}
            style={[
              styles.tab,
              isSelected && { backgroundColor: colors.bg, borderColor: colors.text + '44' },
              !isSelected && styles.tabInactive,
            ]}
            activeOpacity={0.75}
          >
            <View style={[styles.avatar, isSelected && { backgroundColor: colors.text }]}>
              <Text style={[styles.avatarText, isSelected && styles.avatarTextSelected]}>
                {initials}
              </Text>
            </View>
            <Text
              style={[
                styles.tabLabel,
                isSelected && { color: colors.text, fontFamily: Typography.sans.semiBold },
              ]}
              numberOfLines={1}
            >
              {theologian}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    paddingBottom: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  tabInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 9,
    fontFamily: Typography.sans.bold,
    color: Colors.textSecondary,
  },
  avatarTextSelected: {
    color: Colors.surfaceElevated,
  },
  tabLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    maxWidth: 120,
  },
});
