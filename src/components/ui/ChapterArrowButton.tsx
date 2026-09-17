// ============================================================
// BibliaPlus Pro — ChapterArrowButton  (Redesign 2026)
// Flecha prev/next compacta para la cabecera del lector
// ============================================================

import React, { memo, useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ChapterTarget } from '../../types';
import { Colors, Radius } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';

interface ChapterArrowButtonProps {
  direction: 'prev' | 'next';
  target: ChapterTarget | null;
  onNavigate: (target: ChapterTarget) => void;
}

function Chevron({
  direction,
  color,
  size = 10,
}: {
  direction: 'prev' | 'next';
  color: string;
  size?: number;
}) {
  const chevronStyle =
    direction === 'prev'
      ? {
          width: size,
          height: size,
          borderLeftWidth: 2,
          borderBottomWidth: 2,
        }
      : {
          width: size,
          height: size,
          borderTopWidth: 2,
          borderRightWidth: 2,
        };
  return (
    <View
      style={[{ transform: [{ rotate: '45deg' }] }, chevronStyle, { borderColor: color }]}
    />
  );
}

function ChapterArrowButton({
  direction,
  target,
  onNavigate,
}: ChapterArrowButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const disabled = !target;

  const label =
    direction === 'prev' ? 'Capítulo anterior' : 'Capítulo siguiente';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}${target ? `: ${target.book.name} ${target.chapter}` : ' no disponible'}`}
      disabled={disabled}
      onPress={() => target && onNavigate(target)}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Chevron
        direction={direction}
        color={disabled ? colors.textMuted : colors.accentDark}
      />
    </Pressable>
  );
}

export default memo(ChapterArrowButton);

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: Radius.full,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      backgroundColor: colors.accentLight,
      borderColor: colors.accentDark,
    },
    buttonDisabled: {
      opacity: 0.35,
    },
  });