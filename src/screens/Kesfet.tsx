import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../theme';
import Icon from '../components/Icon';
import { Avatar, Logo, T, Tap } from '../components/ui';
import { CAT_META, OpenTable, Venue, VENUES, VenueCat, distanceKm, fmtKm } from '../venues';
import type { TabParams } from '../navigation';

type Cat = 'all' | 'masa' | 'ps' | 'spor';
const CATS: { id: Cat; label: string; cats: VenueCat[] }[] = [
  { id: 'all', label: 'Tümü', cats: [] },
  { id: 'masa', label: 'Okey · masa oyunu', cats: ['okey', 'kafe', 'bilardo'] },
  { id: 'ps', label: 'PlayStation · e-spor', cats: ['playstation'] },
  { id: 'spor', label: 'Halı saha · bowling', cats: ['halisaha', 'bowling'] },
];
const ALL = VENUES.flatMap((v) => v.tables.map((t) => ({ v, t })));

export default function Kesfet({ navigation }: BottomTabScreenProps<TabParams, 'Kesfet'>) {
  const insets = useSafeAreaInsets();
  const [cat, setCat] = React.useState<Cat>('all');
  const root = navigation.getParent();
  const sel = CATS.find((c) => c.id === cat)!;
  const list = cat === 'all' ? ALL : ALL.filter(({ v }) => sel.cats.includes(v.cat));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 120, gap: 18 }}
    >
      <View style={styles.topRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Logo size={30} />
          <T w="x" size={24} style={{ letterSpacing: -0.8 }}>orti</T>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Tap accessibilityLabel="Bildirimler, 2 yeni" style={styles.roundBtn}>
            <Icon name="bell" size={20} />
            <View style={styles.dot} />
          </Tap>
          <Tap accessibilityLabel="Profilim" onPress={() => navigation.navigate('Profil')}>
            <Avatar i="DA" bg={C.tint2} size={40} />
          </Tap>
        </View>
      </View>

      <View style={{ gap: 4 }}>
        <T w="x" size={34} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Keşfet</T>
        <Tap style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', minHeight: 28 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.greenDot }} />
          <T w="m" size={15} color={C.text2}>Talas · ERÜ çevresinde {ALL.length} açık masa</T>
          <Icon name="chevDown" size={12} color={C.text2} strokeWidth={2.6} />
        </Tap>
      </View>

      <Tap haptic="medium" onPress={() => root?.navigate('HizliEsles')} style={styles.hero}>
        <View style={styles.heroIcon}><Icon name="bolt" color="#FFFFFF" size={26} /></View>
        <View style={{ flex: 1, gap: 2 }}>
          <T w="b" size={18} color="#FFFFFF">Hızlı Eşleş</T>
          <T size={14} color={C.tint2} style={{ lineHeight: 19 }}>Oyununu seç, seni uygun masaya oturtalım.</T>
        </View>
        <Icon name="chevRight" color="#FFFFFF" size={16} strokeWidth={3} />
      </Tap>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {CATS.map((c) => {
          const on = c.id === cat;
          return (
            <Tap key={c.id} haptic="light" onPress={() => setCat(c.id)} accessibilityState={{ selected: on }}
              style={[styles.cat, { backgroundColor: on ? C.text : '#FFFFFF' }]}>
              <T w="s" size={15} color={on ? '#FFFFFF' : C.text}>{c.label}</T>
            </Tap>
          );
        })}
      </ScrollView>

      <Tap onPress={() => navigation.navigate('Harita')} style={styles.mapCard}>
        <View style={styles.mapIcon}><Icon name="map" color={C.primary} size={24} /></View>
        <View style={{ flex: 1 }}>
          <T w="s" size={16}>Haritada gör</T>
          <T size={13} color={C.text2}>{VENUES.length} mekan · okey, PlayStation, bilardo, halı saha</T>
        </View>
        <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
      </Tap>

      <T w="b" size={22} style={{ letterSpacing: -0.4 }} accessibilityRole="header">Yakınındaki eksikler</T>

      <View style={{ gap: 12 }}>
        {list.map(({ v, t }) => <LobbyCard key={t.id} v={v} t={t} onPress={() => root?.navigate('Lobi', { venueId: v.id, tableId: t.id })} />)}
        {list.length === 0 ? (
          <View style={styles.empty}>
            <T w="s" size={16}>Şu an bu kategoride eksik yok</T>
            <T size={14} color={C.text2} style={{ textAlign: 'center' }}>İlk masayı sen aç, yakındakilere haber verelim.</T>
            <Tap haptic="medium" onPress={() => root?.navigate('Olustur')} style={styles.emptyBtn}>
              <T w="s" size={15} color="#FFFFFF">Masa aç</T>
            </Tap>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const AV = ['#FFD8B5', '#CFE3FF', '#D3F0DA', '#E8DAFF', '#FFE3E8', '#FFF1C2'];

function LobbyCard({ v, t, onPress }: { v: Venue; t: OpenTable; onPress: () => void }) {
  const meta = CAT_META[v.cat];
  const seated = t.total - t.need;
  const urgent = /dk sonra|Şimdi/.test(t.time);
  return (
    <Tap onPress={onPress} style={styles.card} accessibilityLabel={`${t.game}, ${v.name}, ${t.need} kişi aranıyor, ${t.time}`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[styles.tile, { backgroundColor: meta.color }]}><Icon name={meta.icon} color="#FFF" size={24} strokeWidth={2} /></View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <T w="s" size={17} numberOfLines={1} style={{ flexShrink: 1 }}>{t.game}</T>
            {t.womenOnly ? <View style={styles.women}><T w="b" size={10} color="#8A1C5C">KADIN</T></View> : null}
          </View>
          <T size={13} color={C.text2} numberOfLines={1}>{v.name}</T>
        </View>
        <T size={13} color={C.text2}>{fmtKm(distanceKm(v.lat, v.lng))}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Array.from({ length: Math.min(seated, 4) }).map((_, idx) => (
            <View key={idx} style={{ marginLeft: idx === 0 ? 0 : -8 }}><Avatar i={idx === 0 ? t.host.split(' ').map((x) => x[0]).join('') : '•'} bg={AV[idx % AV.length]} size={32} border /></View>
          ))}
          {seated > 4 ? <T size={12} color={C.text2} style={{ marginLeft: 6 }}>+{seated - 4}</T> : null}
          {Array.from({ length: Math.min(t.need, 3) }).map((_, idx) => (
            <View key={`e${idx}`} style={[styles.emptySeat, { marginLeft: idx === 0 ? 8 : 4 }]}><T size={16} color={C.text2}>+</T></View>
          ))}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <View style={styles.need}><T w="s" size={12} color={C.tintText}>{t.need} kişi aranıyor</T></View>
          <T w="s" size={13} color={urgent ? C.urgent : C.text3}>{t.time}</T>
        </View>
      </View>
      <View style={styles.hostRow}>
        <Icon name="shield" size={14} color={C.green} strokeWidth={2.4} />
        <T size={13} color={C.text3} style={{ flex: 1 }} numberOfLines={1}>Kurucu {t.host} · Güven {t.hostTrust}</T>
        {v.smoking.value === 'kapali-serbest' ? <Icon name="smoke" size={15} color={C.text2} /> : null}
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roundBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', top: 8, right: 9, width: 10, height: 10, borderRadius: 5, backgroundColor: C.badge, borderWidth: 2, borderColor: '#FFFFFF' },
  hero: {
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 22, backgroundColor: C.primary,
    shadowColor: C.primary, shadowOpacity: 0.28, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 6,
  },
  heroIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  cat: { height: 36, paddingHorizontal: 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, gap: 14 },
  tile: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  women: { backgroundColor: '#FDE7F1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  mapCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14 },
  mapIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  partner: { backgroundColor: C.tint, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  emptySeat: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: C.gray, alignItems: 'center', justifyContent: 'center' },
  need: { backgroundColor: C.tint, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.sepLight },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, alignItems: 'center', gap: 10 },
  emptyBtn: { height: 44, paddingHorizontal: 18, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});
