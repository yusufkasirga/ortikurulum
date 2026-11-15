import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, NavBack, PrimaryButton, T, tapSuccess } from '../../components/ui';
import { LEAGUE } from './teams';
import type { ScreenProps } from '../../core/navigation';

const BG = ['#FFD8B5', '#E8DAFF', '#FFE3E8', '#CFE3FF', '#E2DBFF', '#D3F0DA'];

export default function Lig({ navigation }: ScreenProps<'Lig'>) {
  const insets = useSafeAreaInsets();
  const [joined, setJoined] = React.useState(false);
  const top3 = LEAGUE.rows.slice(0, 3);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={[styles.hero, { paddingTop: insets.top + 4 }]}>
          <View style={styles.deco1} /><View style={styles.deco2} />
          <View style={{ marginLeft: -8 }}><NavBack label="Geri" color="#FFFFFF" onPress={() => navigation.goBack()} /></View>
          <T w="b" size={13} color="#FFFFFF">{LEAGUE.season}</T>
          <T w="x" size={30} color="#FFF" style={{ letterSpacing: -0.8 }} accessibilityRole="header">{LEAGUE.name}</T>
          <View style={styles.prize}><Icon name="star" size={16} color="#241200" fill="#241200" /><T w="b" size={13} color="#241200" style={{ flex: 1 }}>{LEAGUE.prize}</T></View>

          <View style={styles.podium}>
            {[top3[1], top3[0], top3[2]].map((r, i) => {
              const h = i === 1 ? 92 : i === 0 ? 70 : 56;
              return (
                <View key={r.name} style={{ alignItems: 'center', gap: 6, flex: 1 }}>
                  <Avatar i={r.name.split(' ').map((x) => x[0]).join('')} bg={BG[r.rank - 1]} size={i === 1 ? 58 : 48} border />
                  <T w="b" size={13} color="#FFF" numberOfLines={1}>{r.name}</T>
                  <View style={[styles.step, { height: h, backgroundColor: i === 1 ? C.sun : 'rgba(0,0,0,0.25)' }]}>
                    <T w="x" size={22} color={i === 1 ? '#241200' : '#FFF'}>{r.rank}</T>
                    <T w="s" size={11} color={i === 1 ? '#241200' : '#FFF'}>{r.points} puan</T>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 12 }}>
          <View style={styles.next}>
            <Icon name="calendar" size={20} color={C.primary} />
            <View style={{ flex: 1 }}>
              <T w="b" size={15}>Sıradaki tur: {LEAGUE.nextRound}</T>
              <T size={13} color={C.text2}>{LEAGUE.venues.join(' · ')}</T>
            </View>
          </View>

          <View style={styles.table}>
            {LEAGUE.rows.map((r) => (
              <View key={r.name} style={[styles.row, r.me && { backgroundColor: C.tint }]}>
                <T w="x" size={15} style={{ width: 22 }}>{r.rank}</T>
                <Avatar i={r.me ? 'DA' : r.name.split(' ').map((x) => x[0]).join('')} bg={BG[(r.rank - 1) % BG.length]} size={36} />
                <View style={{ flex: 1 }}>
                  <T w="b" size={15}>{r.name}</T>
                  <T size={12} color={C.text2}>{r.bolum} · {r.wins}G / {r.played} oyun</T>
                </View>
                <T w="b" size={12} color={r.trend === 'up' ? C.green : r.trend === 'down' ? C.red : C.text2}>{r.trend === 'up' ? '▲' : r.trend === 'down' ? '▼' : '–'}</T>
                <T w="x" size={17} style={{ width: 34, textAlign: 'right' }}>{r.points}</T>
              </View>
            ))}
          </View>
          <T size={12} color={C.text2} style={{ textAlign: 'center' }}>Galibiyet 3 puan, katılım 1 puan. Maçlar partner mekanlarda QR check-in ile sayılır.</T>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton title={joined ? 'Perşembe turuna kaydın alındı' : 'Bu haftaki tura katıl'} color={joined ? C.green : C.primary} onPress={() => { tapSuccess(); setJoined(true); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: '#0C642F', paddingHorizontal: 20, paddingBottom: 0, gap: 6, overflow: 'hidden' },
  deco1: { position: 'absolute', width: 220, height: 220, borderRadius: 110, right: -80, top: -60, backgroundColor: 'rgba(255,255,255,0.12)' },
  deco2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, left: -40, top: 140, backgroundColor: 'rgba(255,255,255,0.08)' },
  prize: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.sun, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, marginTop: 6 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 18 },
  step: { alignSelf: 'stretch', borderTopLeftRadius: 14, borderTopRightRadius: 14, alignItems: 'center', justifyContent: 'center' },
  next: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 16, padding: 14 },
  table: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(244,243,250,0.97)' },
});
