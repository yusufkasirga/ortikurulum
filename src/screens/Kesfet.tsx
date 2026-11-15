import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../theme';
import Icon from '../components/Icon';
import { Avatar, GameTile, Logo, T, Tap } from '../components/ui';
import { LOBBIES, Lobby } from '../data';
import type { TabParams } from '../navigation';

type Cat = 'all' | 'masa' | 'online' | 'spor';
const CATS: { id: Cat; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'masa', label: 'Masa oyunları' },
  { id: 'online', label: 'Online' },
  { id: 'spor', label: 'Spor' },
];

export default function Kesfet({ navigation }: BottomTabScreenProps<TabParams, 'Kesfet'>) {
  const insets = useSafeAreaInsets();
  const [cat, setCat] = React.useState<Cat>('all');
  const root = navigation.getParent();
  const list = cat === 'all' ? LOBBIES : LOBBIES.filter((l) => l.type === cat);

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
          <T w="m" size={15} color={C.text2}>Kadıköy çevresinde 23 açık masa</T>
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

      <T w="b" size={22} style={{ letterSpacing: -0.4 }} accessibilityRole="header">Yakınındaki eksikler</T>

      <View style={{ gap: 12 }}>
        {list.map((l) => <LobbyCard key={l.id} l={l} onPress={() => root?.navigate('Lobi', { id: l.id })} />)}
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

function LobbyCard({ l, onPress }: { l: Lobby; onPress: () => void }) {
  return (
    <Tap onPress={onPress} style={styles.card} accessibilityLabel={`${l.game}, ${l.place}, ${l.need}, ${l.time}`}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <GameTile mark={l.mark} bg={l.tileBg} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <T w="s" size={17}>{l.game}</T>
            {l.partner ? <View style={styles.partner}><T w="b" size={10} color={C.tintText}>PARTNER</T></View> : null}
          </View>
          <T size={13} color={C.text2} numberOfLines={1}>{l.place}</T>
        </View>
        <T size={13} color={C.text2}>{l.dist}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {l.players.map((p, idx) => (
            <View key={p.i} style={{ marginLeft: idx === 0 ? 0 : -8 }}><Avatar i={p.i} bg={p.bg} size={32} border /></View>
          ))}
          {Array.from({ length: l.empty }).map((_, idx) => (
            <View key={idx} style={[styles.emptySeat, { marginLeft: idx === 0 ? 8 : 4 }]}><T size={16} color={C.text2}>+</T></View>
          ))}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <View style={styles.need}><T w="s" size={12} color={C.tintText}>{l.need}</T></View>
          <T w="s" size={13} color={l.urgent ? C.urgent : C.text3}>{l.time}</T>
        </View>
      </View>
      <View style={styles.hostRow}>
        <Icon name="shield" size={14} color={C.green} strokeWidth={2.4} />
        <T size={13} color={C.text3}>{l.host}</T>
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
  partner: { backgroundColor: C.tint, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  emptySeat: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: C.gray, alignItems: 'center', justifyContent: 'center' },
  need: { backgroundColor: C.tint, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.sepLight },
  empty: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, alignItems: 'center', gap: 10 },
  emptyBtn: { height: 44, paddingHorizontal: 18, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});
