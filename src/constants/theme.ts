// ============================================================
// BibliaPlus Pro — Design System / Theme
// ============================================================

export const Colors = {
  // Backgrounds
  background: '#fafaf9',   // stone-50
  surface: '#f5f5f4',      // stone-100
  surfaceElevated: '#ffffff',
  border: '#e7e5e4',       // stone-200
  borderStrong: '#d6d3d1', // stone-300

  // Text
  textPrimary: '#1c1917',   // stone-900
  textSecondary: '#57534e', // stone-600
  textMuted: '#a8a29e',     // stone-400
  textInverse: '#ffffff',

  // Accent — Amber (calls to action, versículos activos)
  accent: '#b45309',        // amber-700
  accentDark: '#92400e',    // amber-800
  accentLight: '#fef3c7',   // amber-100
  accentMid: '#fde68a',     // amber-200

  // Tabs & States
  tabActive: '#b45309',
  tabInactive: '#a8a29e',

  // Overlays
  overlay: 'rgba(28, 25, 23, 0.4)',
  highlightBg: '#fffbeb',   // warm yellow tint for selected verse
} as const;

export const Typography = {
  // Serif — para lectura de Biblia y comentarios
  serif: {
    regular: 'Merriweather_400Regular' as const,
    bold: 'Merriweather_700Bold' as const,
    italic: 'Merriweather_400Regular_Italic' as const,
  },
  // Sans — para UI, navegación
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
  '2xl': 26,
  '3xl': 32,
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
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#1c1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#1c1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;
