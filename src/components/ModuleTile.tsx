import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from './Icon';
import { T, Tap } from './ui';
import type { AppModule } from '../core/modules';

/** Square, colourful launcher tile for a module. */
export default function ModuleTile({ m, width, onPress, badge }: { m: AppModule; width: number; onPress: () => void; badge?: string }) {
  const light = m.ink !== '#FFFFFF';
  return (
    <Tap haptic="light" onPress={onPress} accessibilityLabel={`${m.title}. ${m.sub}`} style={[styles.tile, { width, backgroundColor: m.color }]}>
      <View style={[styles.deco, { backgroundColor: light ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.14)' }]} />
      <View style={[styles.icon, { backgroundColor: light ? '#FFFFFF' : 'rgba(255,255,255,0.2)' }]}>
        <Icon name={m.icon} size={20} color={light ? m.ink : '#FFFFFF'} strokeWidth={2.2} />
      </View>
      <View style={{ flex: 1 }} />
      <T w="b" size={14} color={m.ink} numberOfLines={2} style={{ lineHeight: 17 }}>{m.title}</T>
      <T w="m" size={11} color={m.ink} numberOfLines={1}>{m.sub}</T>
      {badge ? <View style={styles.badge}><T w="b" size={11} color="#FFFFFF">{badge}</T></View> : null}
    </Tap>
  );
}

const styles = StyleSheet.create({
  tile: { height: 118, borderRadius: 22, padding: 12, overflow: 'hidden', gap: 1 },
  deco: { position: 'absolute', width: 90, height: 90, borderRadius: 45, right: -28, top: -30 },
  icon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, right: 10, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center' },
});
