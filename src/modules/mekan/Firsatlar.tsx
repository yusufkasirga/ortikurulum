import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { NavBack, T, Tap } from '../../components/ui';
import { CAT_META, FEATURED, distanceKm, fmtKm } from './venues';
import type { ScreenProps } from '../../core/navigation';

export default function Firsatlar({ navigation }: ScreenProps<'Firsatlar'>) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 14 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Geri" onPress={() => navigation.goBack()} /></View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Fırsatlar</T>
        <T w="s" size={12} color={C.text2}>Reklam</T>
      </View>
      <T size={15} color={C.text2}>Talas’taki mekanlardan Orti kullanıcılarına özel kampanyalar.</T>
      {FEATURED.map((v) => {
        const meta = CAT_META[v.cat];
        return (
          <Tap key={v.id} onPress={() => navigation.navigate('Mekan', { id: v.id })} style={styles.card}>
            <View style={[styles.head, { backgroundColor: meta.color }]}>
              <View style={styles.deco}><Icon name={meta.icon} size={110} color={meta.on === '#FFFFFF' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.1)'} strokeWidth={1.6} /></View>
              <View style={styles.tag}><T w="b" size={11} color={meta.ink}>{meta.label.toUpperCase()}</T></View>
              <T w="x" size={22} color={meta.on} style={{ letterSpacing: -0.4 }}>{v.featured?.offer}</T>
            </View>
            <View style={{ padding: 14, gap: 6 }}>
              <T w="b" size={16}>{v.name}</T>
              <T size={14} color={C.text3} style={{ lineHeight: 19 }}>{v.featured?.detail}</T>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
                {v.google ? <T w="s" size={13}>★ {v.google.rating.toFixed(1).replace('.', ',')}</T> : null}
                <T size={13} color={C.text2}>{fmtKm(distanceKm(v.lat, v.lng))} · {v.area.split(' · ')[0]}</T>
              </View>
            </View>
          </Tap>
        );
      })}
      <T size={12} color={C.text2} style={{ textAlign: 'center' }}>Kampanyalar örnek; mekanlarla anlaşma sonrası yayına girer.</T>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden' },
  head: { padding: 16, gap: 8, minHeight: 120, justifyContent: 'flex-end', overflow: 'hidden' },
  deco: { position: 'absolute', right: -20, top: -16, transform: [{ rotate: '-14deg' }] },
  tag: { alignSelf: 'flex-start', backgroundColor: '#FFF', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
});
