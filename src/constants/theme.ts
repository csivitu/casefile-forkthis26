/**
 * CASEFILE theme constants — colors, fonts, and spacing.
 */

import '@/global.css';

import { Platform } from 'react-native';

// ─── Original Expo colors (kept for compatibility) ──────────────────────────
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── CASEFILE palette (vintage / parchment) ──────────────────────────────────
export const C = {
  parchment: '#E8DCC4',   // page background
  paper: '#F3E9D2',       // card / section background
  walnut: '#4A3024',      // primary dark (headers, buttons, headings)
  leather: '#76543C',     // secondary accent (back buttons, links)
  antique: '#A67C52',     // monospace labels, IDs, timestamps
  ink: '#2B211B',         // body text
  faded: '#6B5A4A',       // secondary text / captions
  divider: '#C5B394',     // separators and borders
  olive: '#5F7048',       // status active / success
  brick: '#8A4538',       // delete / destructive
} as const;

// ─── Fonts ───────────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',          // → Georgia on iOS
    rounded: 'ui-rounded',
    mono: 'ui-monospace',       // → Menlo / Courier on iOS
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// ─── Spacing scale ───────────────────────────────────────────────────────────
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
