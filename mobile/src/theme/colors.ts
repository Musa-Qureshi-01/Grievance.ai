/**
 * Design tokens synced with web client theme.css
 * Provides a consistent color palette across platforms.
 */
export const colors = {
  // ─── Brand ─────────────────────────────────
  primary: '#2563EB',       // blue-600
  primaryDark: '#1D4ED8',   // blue-700
  primaryLight: '#3B82F6',  // blue-500
  primaryFaint: '#EFF6FF',  // blue-50
  primaryMuted: '#1E3A5F',  // blue-900/20 approx

  // ─── Neutral (Slate) ──────────────────────
  white: '#FFFFFF',
  black: '#000000',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',

  // ─── Semantic ─────────────────────────────
  success: '#16A34A',
  successFaint: '#F0FDF4',
  warning: '#F59E0B',
  warningFaint: '#FFFBEB',
  error: '#DC2626',
  errorFaint: '#FEF2F2',
  info: '#0EA5E9',

  // ─── Dark mode backgrounds (matching web) ──
  darkBg: '#0B1020',
  darkCard: '#111827',
  darkBorder: '#1E293B',
  darkSurface: '#0F172A',

  // ─── Light mode backgrounds ────────────────
  lightBg: '#F8FAFC',
  lightCard: '#FFFFFF',
  lightBorder: 'rgba(0, 0, 0, 0.1)',

  // ─── Misc ─────────────────────────────────
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
