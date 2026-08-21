// ============================================================
// BibliaPlus Pro — HomeScreen
// Pantalla principal: versículo del día + cards AT / NT
// ============================================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BibleStackParamList } from '../../types';
import { Colors, Typography, FontSizes, Spacing, Radius, Shadows } from '../../constants/theme';
import { useTheme } from '../../theme/ThemeProvider';
import * as DatabaseService from '../../services/DatabaseService';
import { Book } from '../../types';

type Nav = NativeStackNavigationProp<BibleStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

// Versículos del día (hardcoded - rotación por día del año)
const DAILY_VERSES = [
  { text: '"En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios."', ref: 'Juan 1:1' },
  { text: '"Todo lo puedo en Cristo que me fortalece."', ref: 'Filipenses 4:13' },
  { text: '"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito."', ref: 'Juan 3:16' },
  { text: '"El Señor es mi pastor; nada me faltará."', ref: 'Salmos 23:1' },
  { text: '"Confía en el Señor con todo tu corazón."', ref: 'Proverbios 3:5' },
  { text: '"Yo soy la resurrección y la vida."', ref: 'Juan 11:25' },
  { text: '"El amor es sufrido, es benigno; el amor no tiene envidia."', ref: '1 Corintios 13:4' },
];

function getDailyVerse() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
}

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<Nav>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const dailyVerse = getDailyVerse();
  const [quickBooks, setQuickBooks] = useState<Book[]>([]);

  // Resolver los libros de acceso rápido desde la BD
  useEffect(() => {
    let mounted = true;
    DatabaseService.getBooks().then(all => {
      if (!mounted) return;
      const found = QUICK_BOOKS.map(
        qb => all.find(b => b.name === qb.name)
      ).filter(Boolean) as Book[];
      setQuickBooks(found);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animación pulsante del punto naranja
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const goToBooks = (testament: 'AT' | 'NT') => {
    navigation.navigate('Books', { testament });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.welcomeLabel}>BIENVENIDO</Text>
            <Text style={styles.appTitle}>BibliaPlus</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Settings')}
          >
            <MenuIcon color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* ── Versículo del Día ── */}
        <Animated.View
          style={[
            styles.dailyCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.dailyCardHeader}>
            <Animated.View
              style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]}
            />
            <Text style={styles.dailyLabel}>VERSÍCULO DEL DÍA</Text>
          </View>

          <Text style={styles.dailyText}>{dailyVerse.text}</Text>
          <Text style={styles.dailyRef}>{dailyVerse.ref}</Text>

          {/* Decoración esquina */}
          <View style={styles.cornerDecor} pointerEvents="none">
            <BookDecorIcon />
          </View>
        </Animated.View>

        {/* ── Explorar Biblioteca ── */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Explorar Biblioteca</Text>

          <View style={styles.testamentRow}>
            {/* Antiguo Testamento */}
            <TouchableOpacity
              style={styles.testamentCard}
              onPress={() => goToBooks('AT')}
              activeOpacity={0.8}
            >
              <View style={styles.testamentIconBg}>
                <LibraryIcon color={colors.textSecondary} />
              </View>
              <Text style={styles.testamentName}>Antiguo{'\n'}Testamento</Text>
              <Text style={styles.testamentCount}>39 LIBROS</Text>
            </TouchableOpacity>

            {/* Nuevo Testamento */}
            <TouchableOpacity
              style={styles.testamentCard}
              onPress={() => goToBooks('NT')}
              activeOpacity={0.8}
            >
              <View style={styles.testamentIconBg}>
                <LibraryIcon color={colors.textSecondary} />
              </View>
              <Text style={styles.testamentName}>Nuevo{'\n'}Testamento</Text>
              <Text style={styles.testamentCount}>27 LIBROS</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ── Acceso Rápido ── */}
        <Animated.View
          style={[
            styles.section,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.quickRow}>
            {quickBooks.map((book) => (
              <TouchableOpacity
                key={book.name}
                style={styles.quickChip}
                onPress={() => navigation.navigate('Chapters', { book })}
                activeOpacity={0.75}
              >
                <Text style={styles.quickChipText}>{book.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const QUICK_BOOKS = [
  { name: 'Génesis', testament: 'AT' as const },
  { name: 'Salmos', testament: 'AT' as const },
  { name: 'Proverbios', testament: 'AT' as const },
  { name: 'Juan', testament: 'NT' as const },
  { name: 'Romanos', testament: 'NT' as const },
  { name: 'Apocalipsis', testament: 'NT' as const },
];

// ── Íconos SVG inline ──

function MenuIcon({ color }: { color: string }) {
  return (
    <View style={{ gap: 5, alignItems: 'flex-end' }}>
      <View style={{ width: 22, height: 2, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: 16, height: 2, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ width: 19, height: 2, backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

function LibraryIcon({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
      {[14, 20, 16, 18, 13].map((h, i) => (
        <View
          key={i}
          style={{
            width: 4,
            height: h,
            backgroundColor: color,
            borderRadius: 2,
            opacity: 0.7 + i * 0.06,
          }}
        />
      ))}
    </View>
  );
}

function BookDecorIcon() {
  return (
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 14,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.12)',
        transform: [{ rotate: '15deg' }],
      }}
    />
  );
}

const CARD_WIDTH = (width - Spacing.base * 2 - Spacing.md) / 2;

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: Spacing['3xl'],
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.md,
    },
    welcomeLabel: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    appTitle: {
      fontFamily: Typography.display.bold,
      fontSize: FontSizes['2xl'],
      color: colors.textPrimary,
      marginTop: 2,
    },
    menuButton: {
      padding: Spacing.sm,
    },

    // Versículo del Día
    dailyCard: {
      marginHorizontal: Spacing.base,
      backgroundColor: colors.darkCard,
      borderRadius: Radius.xl,
      padding: Spacing.xl,
      marginBottom: Spacing.xl,
      overflow: 'hidden',
      ...Shadows.dark,
    },
    dailyCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.base,
    },
    pulseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.darkCardAccent,
    },
    dailyLabel: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.xs,
      color: colors.darkCardAccent,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    dailyText: {
      fontFamily: Typography.display.bold,
      fontSize: FontSizes.lg,
      color: colors.darkCardText,
      lineHeight: 30,
      marginBottom: Spacing.base,
    },
    dailyRef: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.sm,
      color: colors.darkCardAccent,
    },
    cornerDecor: {
      position: 'absolute',
      right: -10,
      bottom: -10,
      opacity: 0.25,
    },

    // Sección
    section: {
      paddingHorizontal: Spacing.base,
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontFamily: Typography.sans.semiBold,
      fontSize: FontSizes.md,
      color: colors.textPrimary,
      marginBottom: Spacing.base,
    },

    // Cards AT / NT
    testamentRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    testamentCard: {
      width: CARD_WIDTH,
      backgroundColor: colors.surfaceElevated,
      borderRadius: Radius.xl,
      padding: Spacing.lg,
      paddingBottom: Spacing.xl,
      ...Shadows.md,
    },
    testamentIconBg: {
      width: 48,
      height: 48,
      borderRadius: Radius.md,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.base,
    },
    testamentName: {
      fontFamily: Typography.sans.bold,
      fontSize: FontSizes.base,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: Spacing.xs,
    },
    testamentCount: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.xs,
      color: colors.textMuted,
      letterSpacing: 0.8,
    },

    // Acceso Rápido
    quickRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    quickChip: {
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadows.sm,
    },
    quickChipText: {
      fontFamily: Typography.sans.medium,
      fontSize: FontSizes.sm,
      color: colors.textSecondary,
    },
  });
