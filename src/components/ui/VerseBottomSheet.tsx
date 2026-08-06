// ============================================================
// BibliaPlus Pro — VerseBottomSheet  (Redesign 2026)
// Modal que sube desde abajo con comentarios del versículo
// Teólogos en scroll horizontal · comentario fluido
// ============================================================

import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import { Verse, Comment } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';
import * as FavoritesStore from '../../store/FavoritesStore';
import SimpleHTML from './SimpleHTML';

interface VerseBottomSheetProps {
  verse: Verse | null;
  visible: boolean;
  onClose: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;

const THEOLOGIAN_CHIPS: Record<string, string> = {
  'Matthew Henry': 'M. Henry',
  'Juan Calvino': 'Calvino',
  'Charles Spurgeon': 'Spurgeon',
};

export default function VerseBottomSheet({
  verse,
  visible,
  onClose,
}: VerseBottomSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [theologians, setTheologians] = useState<string[]>([]);
  const [selectedTheologian, setSelectedTheologian] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ── Animación de entrada/salida ──
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          damping: 22,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SHEET_HEIGHT,
          duration: 280,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // ── Cargar datos cuando se muestra un versículo ──
  useEffect(() => {
    if (!verse || !visible) return;

    setTheologians([]);
    setComments({});
    setSelectedTheologian(null);
    setLoading(true);

    FavoritesStore.isFavorite(verse.id).then(setIsFavorite);

    DatabaseService.getTheologians(verse.id).then(async (theolList) => {
      setTheologians(theolList);
      if (theolList.length > 0) {
        setSelectedTheologian(theolList[0]);
        const all = await DatabaseService.getComments(verse.id);
        const map: Record<string, Comment> = {};
        all.forEach(c => { map[c.theologian] = c; });
        setComments(map);
      }
      setLoading(false);
    });
  }, [verse?.id, visible]);

  const handleSelectTheologian = useCallback(
    async (theologian: string) => {
      setSelectedTheologian(theologian);
      if (!comments[theologian] && verse) {
        const all = await DatabaseService.getComments(verse.id);
        const map: Record<string, Comment> = { ...comments };
        all.forEach(c => { map[c.theologian] = c; });
        setComments(map);
      }
    },
    [verse?.id, comments]
  );

  const handleFavorite = useCallback(async () => {
    if (!verse) return;
    const nowFav = await FavoritesStore.toggleFavorite(verse);
    setIsFavorite(nowFav);
  }, [verse]);

  const currentComment = selectedTheologian ? comments[selectedTheologian] : null;

  if (!verse && !visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay oscuro */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet animado */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
        ]}
      >
        {/* Drag indicator */}
        <View style={styles.dragHandle} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.sheetContent}
        >
          {verse && (
            <>
              {/* Referencia + bookmark */}
              <View style={styles.refRow}>
                <Text style={styles.verseRef}>
                  {verse.bookName.toUpperCase()} {verse.chapter}:{verse.verse}
                </Text>
                <TouchableOpacity
                  style={styles.bookmarkBtn}
                  onPress={handleFavorite}
                  activeOpacity={0.7}
                >
                  <BookmarkIcon filled={isFavorite} color={colors.accent} background={colors.background} muted={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Texto del versículo */}
              <Text style={styles.verseText}>{verse.text}</Text>

              {/* Divisor */}
              <View style={styles.divider} />

              {/* Chips de teólogos */}
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={styles.loadingText}>Cargando comentarios…</Text>
                </View>
              ) : theologians.length > 0 ? (
                <>
                  <View style={styles.commentsHeader}>
                    <Text style={styles.commentsTitle}>Comentarios</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{theologians.length}</Text>
                    </View>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsRow}
                  >
                    {theologians.map(t => {
                      const isSelected = t === selectedTheologian;
                      const label = THEOLOGIAN_CHIPS[t] ?? t;
                      return (
                        <TouchableOpacity
                          key={t}
                          onPress={() => handleSelectTheologian(t)}
                          style={[
                            styles.chip,
                            isSelected && styles.chipSelected,
                          ]}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              isSelected && styles.chipTextSelected,
                            ]}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>

                  {/* Comentario */}
                  {currentComment && (
                    <View style={styles.commentSection}>
                      <SimpleHTML html={currentComment.text} />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.noComments}>
                  <Text style={styles.noCommentsText}>
                    No hay comentarios exegéticos para este versículo.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

function BookmarkIcon({
  filled,
  color,
  background,
  muted,
}: {
  filled: boolean;
  color: string;
  background: string;
  muted: string;
}) {
  return (
    <View
      style={{
        width: 22,
        height: 26,
        borderWidth: 2,
        borderColor: filled ? color : muted,
        borderRadius: 3,
        backgroundColor: filled ? color : 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}
    >
      {/* V-notch bottom */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: 11,
          borderRightWidth: 11,
          borderTopWidth: 8,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: background,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    ...Shadows.dark,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sheetContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },

  // Referencia
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  verseRef: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: colors.accent,
    letterSpacing: 0.5,
  },
  bookmarkBtn: {
    padding: Spacing.xs,
  },

  // Texto del versículo
  verseText: {
    fontFamily: Typography.display.bold,
    fontSize: FontSizes.xl,
    color: colors.textPrimary,
    lineHeight: 34,
    marginBottom: Spacing.xl,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: Spacing.lg,
  },

  // Loading
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  loadingText: {
    fontFamily: Typography.sans.regular,
    fontSize: FontSizes.sm,
    color: colors.textMuted,
  },

  // Chips de teólogos
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  commentsTitle: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  countBadge: {
    minWidth: 26,
    height: 22,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accentMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontFamily: Typography.sans.bold,
    fontSize: FontSizes.sm,
    color: colors.accentDark,
  },
  chipsRow: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
    paddingRight: Spacing.base,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.darkCard,
    borderColor: colors.darkCard,
  },
  chipText: {
    fontFamily: Typography.sans.semiBold,
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.textInverse,
  },

  // Comentario
  commentSection: {
    marginTop: Spacing.md,
  },

  // Sin comentarios
  noComments: {
    paddingVertical: Spacing.base,
  },
  noCommentsText: {
    fontFamily: Typography.serif.italic,
    fontSize: FontSizes.base,
    color: colors.textMuted,
    lineHeight: 24,
  },
});
