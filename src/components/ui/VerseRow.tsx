// ============================================================
// BibliaPlus Pro — VerseRow  (Redesign 2026)
// Fila de versículo limpia — toca para abrir BottomSheet
// ============================================================

import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Verse } from '../../types';
import { Colors, Typography, FontSizes, Spacing } from '../../constants/theme';

interface VerseRowProps {
  verse: Verse;
  isHighlighted?: boolean;
  onPress: (verse: Verse) => void;
}

const VerseRow = memo(function VerseRow({
  verse,
  isHighlighted,
  onPress,
}: VerseRowProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(verse)}
      style={[styles.container, isHighlighted && styles.containerHighlighted]}
      activeOpacity={0.65}
    >
      {/* Número de versículo */}
      <Text style={styles.verseNumber}>{verse.verse}</Text>

      {/* Texto */}
      <Text style={styles.verseText}>{verse.text}</Text>
    </TouchableOpacity>
  );
});

export default VerseRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    gap: Spacing.md,
  },
  containerHighlighted: {
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    marginHorizontal: Spacing.base,
  },
  verseNumber: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
    minWidth: 20,
    textAlign: 'right',
    flexShrink: 0,
  },
  verseText: {
    flex: 1,
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
});
