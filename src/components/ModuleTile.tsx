import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from './Icon';
import { T, Tap } from './ui';
import { C } from '../core/theme';
import type { AppModule } from '../core/modules';

/**
 * Launcher icon for a module: a coloured squircle with a one-line label underneath,
 * like a home-screen app icon. Labels never truncate (they use the module's short name).
 */
export default function ModuleTile({ m, width, onPress, badge }: { m: AppModule; width: number; onPress: () => void; badge?: string }) {
  return (
    <Tap haptic="light" onPress={onPress} accessibilityLabel={`${m.title}. ${m.sub}${badge ? `. ${badge}` : ''}`} style={[styles.wrap, { width }]}>
      <View style={[styles.icon, { backgroundColor: m.color }]}>
        <Icon name={m.icon} size={26} color={m.ink} strokeWidth={2.1} />
        {badge ? <View style={styles.badge}><T w="b" size={11} color="#FFFFFF">{badge}</T></View> : null}
      </View>
      <T w="s" size={12} color={C.text} numberOfLines={1} style={{ textAlign: 'center' }}>{m.short}</T>
    </Tap>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 7 },
  icon: { width: 62, height: 62, borderRadius: 19, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -5, right: -7, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#D70015', borderWidth: 2, borderColor: C.bg, alignItems: 'center', justifyContent: 'center' },
});
