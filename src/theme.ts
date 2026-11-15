export const C = {
  bg: '#F4F3FA',
  card: '#FFFFFF',
  text: '#1C1C1E',
  text2: '#6E6E73',
  text3: '#3A3A3C',
  sep: 'rgba(60,60,67,0.29)',
  sepLight: 'rgba(60,60,67,0.18)',
  fill: 'rgba(118,118,128,0.12)',
  primary: '#5B3FE6',
  primaryDark: '#4329C9',
  tint: '#EFEBFF',
  tint2: '#E2DBFF',
  tintText: '#33208F',
  green: '#146C34',
  greenBg: '#DDF5E4',
  greenDot: '#34C759',
  orange: '#FF9500',
  urgent: '#B45300',
  warnBg: '#FFF4E0',
  warnText: '#7A4100',
  red: '#D70015',
  badge: '#FF3B30',
  border: '#D1D1D6',
  gray: '#8E8E93',
  chevron: '#C7C7CC',
  heart: '#FF2D55',
  bubble: '#ECEBF3',
  // playful accents
  sun: '#FFC83D',
  sunText: '#7A5200',
  coral: '#FF6B5B',
  lime: '#B8F35A',
  sky: '#3EC7FF',
  pink: '#FF5FA2',
};

export const F = {
  r: 'Inter_400Regular',
  m: 'Inter_500Medium',
  s: 'Inter_600SemiBold',
  b: 'Inter_700Bold',
  x: 'Inter_800ExtraBold',
} as const;

export type Weight = keyof typeof F;

export const R = { sm: 10, md: 16, lg: 20, xl: 22, pill: 999 };
