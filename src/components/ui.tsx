import React from 'react';
import {
  Pressable, PressableProps, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Rect } from 'react-native-svg';
import { C, F, Weight } from '../core/theme';
import Icon from './Icon';

export function T({ w = 'r', size = 16, color = C.text, style, ...rest }: TextProps & { w?: Weight; size?: number; color?: string }) {
  return <Text {...rest} style={[{ fontFamily: F[w], fontSize: size, color }, style]} />;
}

export const tapLight = () => { Haptics.selectionAsync().catch(() => {}); };
export const tapMedium = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}); };
export const tapSuccess = () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); };

/** iOS-like pressable: dims on press, optional haptic. */
export function Tap({ style, haptic, onPress, children, ...rest }: PressableProps & { style?: StyleProp<ViewStyle>; haptic?: 'light' | 'medium' }) {
  return (
    <Pressable
      accessibilityRole="button"
      {...rest}
      onPress={(e) => {
        if (haptic === 'light') tapLight();
        if (haptic === 'medium') tapMedium();
        onPress?.(e);
      }}
      style={({ pressed }) => [style, pressed && { opacity: 0.55 }]}
    >
      {children as React.ReactNode}
    </Pressable>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Rect width={32} height={32} rx={9} fill={C.primary} />
      <Circle cx={16} cy={16} r={5.5} fill="#FFFFFF" />
      <Circle cx={16} cy={6.8} r={2.4} fill="#FFFFFF" />
      <Circle cx={25.2} cy={16} r={2.4} fill="#FFFFFF" />
      <Circle cx={16} cy={25.2} r={2.4} fill="#FFFFFF" />
      <Circle cx={6.8} cy={16} r={2} fill="none" stroke="#FFFFFF" strokeWidth={1.4} />
    </Svg>
  );
}

export function Avatar({ i, bg, size = 40, border }: { i: string; bg: string; size?: number; border?: boolean }) {
  return (
    <View style={{
      width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center',
      borderWidth: border ? 2 : 0, borderColor: '#FFFFFF',
    }}>
      <T w="b" size={Math.round(size * 0.34)}>{i}</T>
    </View>
  );
}

export function GameTile({ mark, bg, size = 48 }: { mark: string; bg: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.29, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <T w="x" size={Math.round(size * 0.42)} color="#FFFFFF">{mark}</T>
    </View>
  );
}

export function PrimaryButton({ title, onPress, color = C.primary, textColor = '#FFFFFF', disabled, style }: {
  title: string; onPress?: () => void; color?: string; textColor?: string; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  return (
    <Tap
      haptic="medium"
      disabled={disabled}
      onPress={onPress}
      accessibilityState={{ disabled }}
      style={[s.btn, { backgroundColor: disabled ? C.border : color }, style]}
    >
      <T w="s" size={17} color={disabled ? C.text3 : textColor}>{title}</T>
    </Tap>
  );
}

export function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Tap
      haptic="light"
      onPress={onPress}
      accessibilityState={{ selected: on }}
      style={[s.chip, on ? { backgroundColor: C.primary, borderColor: C.primary } : { backgroundColor: '#FFFFFF', borderColor: C.border }]}
    >
      <T w="s" size={14} color={on ? '#FFFFFF' : C.text}>{label}</T>
    </Tap>
  );
}

export function Segmented<K extends string>({ items, value, onChange }: { items: { id: K; label: string }[]; value: K; onChange: (k: K) => void }) {
  return (
    <View style={s.seg} accessibilityRole="tablist">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <Pressable
            key={it.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => { tapLight(); onChange(it.id); }}
            style={[s.segItem, on && s.segOn]}
          >
            <T w="s" size={14}>{it.label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/** iOS-style switch that looks identical on Android. */
export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const x = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.spring(x, { toValue: value ? 1 : 0, useNativeDriver: false, bounciness: 6, speed: 18 }).start();
  }, [value, x]);
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={() => { tapLight(); onChange(!value); }}
      hitSlop={8}
    >
      <Animated.View style={[s.sw, { backgroundColor: x.interpolate({ inputRange: [0, 1], outputRange: ['rgba(120,120,128,0.32)', C.greenDot] }) }]}>
        <Animated.View style={[s.knob, { transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, 20] }) }] }]} />
      </Animated.View>
    </Pressable>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <T w="s" size={13} color={C.text2} style={{ marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>{children}</T>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ backgroundColor: C.card, borderRadius: 16, overflow: 'hidden' }, style]}>{children}</View>;
}

export function Sep({ inset = 16 }: { inset?: number }) {
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: C.sep, marginLeft: inset }} />;
}

export function NavBack({ label, onPress, color = C.primary }: { label: string; onPress: () => void; color?: string }) {
  return (
    <Tap onPress={onPress} accessibilityLabel={label} style={{ flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingRight: 8 }}>
      <Icon name="back" color={color} size={24} strokeWidth={2.6} />
      <T size={17} color={color}>{label}</T>
    </Tap>
  );
}

export function Stars({ value, onChange, size = 32 }: { value: number; onChange: (n: number) => void; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }} accessibilityRole="adjustable" accessibilityValue={{ min: 0, max: 5, now: value }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => { tapLight(); onChange(n); }} accessibilityLabel={`${n} yıldız`} style={{ width: 44, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="star" size={size} color={n <= value ? C.orange : C.chevron} fill={n <= value ? C.orange : 'none'} strokeWidth={1.4} />
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  btn: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  chip: { height: 38, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', backgroundColor: C.fill, borderRadius: 10, padding: 2 },
  segItem: { flex: 1, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sw: { width: 51, height: 31, borderRadius: 16, padding: 2, justifyContent: 'center' },
  knob: { width: 27, height: 27, borderRadius: 14, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
});
