// ============================================================
// BibliaPlus Pro — VerseRow
// Fila de versículo expandible con Reanimated
// Al tocar: expande suavemente, muestra tabs de teólogos y comentarios
// ============================================================

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { Verse, Comment } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius } from '../../constants/theme';
import TheologianTabs from './TheologianTabs';
import CommentCard from './CommentCard';
import * as DatabaseService from '../../services/DatabaseService';
import * as FavoritesStore from '../../store/FavoritesStore';

interface VerseRowProps {
  verse: Verse;
  isExpanded: boolean;
  isHighlighted?: boolean;
  onToggle: (verseId: string) => void;
}

export default function VerseRow({
  verse,
  isExpanded,
  isHighlighted,
  onToggle,
}: VerseRowProps) {
  // ── State ──
  const [theologians, setTheologians] = useState<string[]>([]);
  const [selectedTheologian, setSelectedTheologian] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // ── Animación ──
  const expandProgress = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(expandProgress, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start();

    if (isExpanded && theologians.length === 0) {
      loadComments();
    }
  }, [isExpanded]);

  useEffect(() => {
    FavoritesStore.isFavorite(verse.id).then(setIsFavorite);
  }, [verse.id]);

  const animatedStyle = {
    opacity: expandProgress,
    transform: [
      {
        translateY: expandProgress.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
  };

  // ── Data fetching ──
  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const theolList = await DatabaseService.getTheologians(verse.id);
      setTheologians(theolList);
      if (theolList.length > 0) {
        setSelectedTheologian(theolList[0]);
        await fetchComment(theolList[0]);
      }
    } finally {
      setLoadingComments(false);
    }
  }, [verse.id]);

  const fetchComment = useCallback(
    async (theologian: string) => {
      if (comments[theologian]) return;
      const all = await DatabaseService.getComments(verse.id);
      const c = all.find(x => x.theologian === theologian);
      if (c) setComments(prev => ({ ...prev, [theologian]: c }));
    },
    [verse.id, comments]
  );

  const handleSelectTheologian = useCallback(
    async (theologian: string) => {
      setSelectedTheologian(theologian);
      await fetchComment(theologian);
    },
    [fetchComment]
  );

  const handleToggleFavorite = useCallback(async () => {
    const nowFav = await FavoritesStore.toggleFavorite(verse);
    setIsFavorite(nowFav);
  }, [verse]);

  // ── Render ──
  const currentComment = selectedTheologian ? comments[selectedTheologian] : null;

  return (
    <View
      style={[
        styles.container,
        isExpanded && styles.containerExpanded,
        isHighlighted && styles.containerHighlighted,
      ]}
    >
      {/* Cabecera del versículo — siempre visible */}
      <TouchableOpacity
        onPress={() => onToggle(verse.id)}
        activeOpacity={0.7}
        style={styles.verseHeader}
      >
        {/* Número */}
        <View style={[styles.verseNumber, isExpanded && styles.verseNumberActive]}>
          <Text style={[styles.verseNumberText, isExpanded && styles.verseNumberTextActive]}>
            {verse.verse}
          </Text>
        </View>

        {/* Texto */}
        <Text
          style={[styles.verseText, isExpanded && styles.verseTextExpanded]}
          numberOfLines={isExpanded ? undefined : 3}
        >
          {verse.text}
        </Text>

        {/* Indicador de expansión */}
        <Text style={[styles.chevron, isExpanded && styles.chevronRotated]}>›</Text>
      </TouchableOpacity>

      {/* Sección expandida */}
      {isExpanded && (
        <Animated.View style={[styles.expandedSection, animatedStyle]}>
          {/* Barra de acciones */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.favIcon}>{isFavorite ? '🔖' : '🏷️'}</Text>
              <Text style={[styles.favLabel, isFavorite && styles.favLabelActive]}>
                {isFavorite ? 'Guardado' : 'Guardar'}
              </Text>
            </TouchableOpacity>

            <View style={styles.referenceChip}>
              <Text style={styles.referenceText}>
                {verse.bookName} {verse.chapter}:{verse.verse}
              </Text>
            </View>
          </View>

          {/* Tabs de teólogos */}
          {loadingComments ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>Cargando comentarios…</Text>
            </View>
          ) : theologians.length > 0 ? (
            <>
              <TheologianTabs
                theologians={theologians}
                selected={selectedTheologian}
                onSelect={handleSelectTheologian}
              />
              {currentComment && <CommentCard comment={currentComment} />}
            </>
          ) : (
            <View style={styles.noComments}>
              <Text style={styles.noCommentsText}>
                No hay comentarios exegéticos para este versículo en los datos actuales.
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.base,
    marginVertical: 3,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerExpanded: {
    borderColor: Colors.accentMid,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  containerHighlighted: {
    backgroundColor: Colors.highlightBg,
    borderColor: Colors.accent,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.base,
    gap: Spacing.md,
  },
  verseNumber: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  verseNumberActive: {
    backgroundColor: Colors.accent,
  },
  verseNumberText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  verseNumberTextActive: {
    color: Colors.textInverse,
  },
  verseText: {
    flex: 1,
    fontFamily: Typography.serif.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  verseTextExpanded: {
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 22,
    color: Colors.textMuted,
    lineHeight: 28,
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '90deg' }],
    color: Colors.accent,
  },

  // Expanded section
  expandedSection: {
    paddingBottom: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  favoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favIcon: {
    fontSize: 14,
  },
  favLabel: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  favLabelActive: {
    color: Colors.accent,
    fontFamily: Typography.sans.semiBold,
  },
  referenceChip: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  referenceText: {
    fontFamily: Typography.sans.medium,
    fontSize: FontSizes.xs,
    color: Colors.accent,
  },

  // Loading / no comments
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.base,
  },
  loadingText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  noComments: {
    padding: Spacing.base,
  },
  noCommentsText: {
    fontFamily: Typography.serif.italic,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    lineHeight: 20,
  },
});
