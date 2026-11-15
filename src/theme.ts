export const C = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  text2: '#6E6E73',
  text3: '#3A3A3C',
  sep: 'rgba(60,60,67,0.29)',
  sepLight: 'rgba(60,60,67,0.18)',
  fill: 'rgba(118,118,128,0.12)',
  primary: '#4B3FD9',
  primaryDark: '#3A2FB8',
  tint: '#F1EFFE',
  tint2: '#E4E0FC',
  tintText: '#2E2591',
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
  bubble: '#E9E9EB',
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
