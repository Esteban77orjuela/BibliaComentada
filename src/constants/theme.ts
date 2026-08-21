// ============================================================
// BibliaPlus Pro — Design System / Theme  (Redesign 2026)
// Paletas Claro (pergamino) y Oscuro (cálido) + tokens estáticos
// ============================================================

export type Colors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceCard: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  accentMid: string;
  darkCard: string;
  darkCardText: string;
  darkCardAccent: string;
  tabBarBg: string;
  tabActive: string;
  tabInactive: string;
  overlay: string;
  highlightBg: string;
  onAccent: string;
  selectionBg: string;
  selectionText: string;
  infoBadgeBg: string;
  infoBadgeText: string;
};

export const lightColors: Colors = {
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

  // Selección / contraste sobre acento
  onAccent: '#241A0E',
  selectionBg: '#1C1610',
  selectionText: '#F5EDD6',
  infoBadgeBg: '#DBEAFE',
  infoBadgeText: '#1E40AF',
};

export const darkColors: Colors = {
  // Backgrounds — carbón cálido neutro
  background: '#131110',
  surface: '#1B1815',
  surfaceElevated: '#242019',
  surfaceCard: '#211D17',
  border: '#3A342C',
  borderStrong: '#4E463A',

  // Texto — crema
  textPrimary: '#F4EDE0',
  textSecondary: '#CCC3B2',
  textMuted: '#9A9081',
  textInverse: '#131110',

  // Accent — Dorado luminoso
  accent: '#DCAF5A',
  accentDark: '#C29544',
  accentLight: '#332818',
  accentMid: '#7A5F2B',

  // Dark Card — casi negro (para contraste sobre oscuro)
  darkCard: '#0D0B09',
  darkCardText: '#F5EDD6',
  darkCardAccent: '#E8A53A',

  // Tab Bar
  tabBarBg: '#0D0B09',
  tabActive: '#F4EDE0',
  tabInactive: '#837B6E',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.65)',
  highlightBg: '#33281A',

  // Selección / contraste sobre acento
  onAccent: '#241A0E',
  selectionBg: '#DCAF5A',
  selectionText: '#241A0E',
  infoBadgeBg: '#1E2A45',
  infoBadgeText: '#9DB8E8',
};

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
