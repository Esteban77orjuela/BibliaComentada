// ============================================================
// BibliaPlus Pro — Design System / Theme  (Redesign 2026)
// ============================================================

export const Colors = {
  // Backgrounds — cálido pergamino
  background: '#F5F0E8',        // pergamino suave
  surface: '#EDE7D9',           // pergamino oscuro
  surfaceElevated: '#FFFFFF',   // blanco puro
  surfaceCard: '#FDFAF4',       // blanco cálido para cards
  border: '#E2DAC9',            // borde pergamino
  borderStrong: '#C9BFAB',      // borde más oscuro

  // Texto — sepia oscuro
  textPrimary: '#1A1410',       // casi negro cálido
  textSecondary: '#4A3F35',     // sepia oscuro
  textMuted: '#9A8F82',         // sepia claro
  textInverse: '#FFFFFF',

  // Accent — Dorado premium
  accent: '#C8973A',            // dorado principal
  accentDark: '#A67B28',        // dorado oscuro
  accentLight: '#FBF3E2',       // dorado muy claro
  accentMid: '#F0D898',         // dorado medio

  // Dark Card — para versículo del día
  darkCard: '#1C1610',          // casi negro cálido
  darkCardText: '#F5EDD6',      // crema sobre oscuro
  darkCardAccent: '#E8A53A',    // naranja dorado sobre oscuro

  // Tab Bar oscuro
  tabBarBg: '#1C1917',          // casi negro
  tabActive: '#FFFFFF',         // blanco activo
  tabInactive: '#6B6560',       // gris apagado

  // Overlay
  overlay: 'rgba(26, 20, 16, 0.55)',
  highlightBg: '#FBF3E2',
} as const;

export const Typography = {
  // Display serif — Playfair Display para títulos grandes
  display: {
    bold: 'PlayfairDisplay_700Bold' as const,
    italic: 'PlayfairDisplay_400Regular_Italic' as const,
    boldItalic: 'PlayfairDisplay_700Bold_Italic' as const,
  },
  // Serif — Merriweather para lectura de Biblia
  serif: {
    regular: 'Merriweather_400Regular' as const,
    bold: 'Merriweather_700Bold' as const,
    italic: 'Merriweather_400Regular_Italic' as const,
  },
  // Sans — Inter para UI
  sans: {
    regular: 'Inter_400Regular' as const,
    medium: 'Inter_500Medium' as const,
    semiBold: 'Inter_600SemiBold' as const,
    bold: 'Inter_700Bold' as const,
  },
} as const;

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  '2xl': 28,
  '3xl': 34,
  '4xl': 42,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
} as const;

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 36,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1A1410',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.30,
    shadowRadius: 24,
    elevation: 15,
  },
} as const;
