import React from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, Logo, T, Tap } from '../../components/ui';
import ModuleTile from '../../components/ModuleTile';
import { MODULES } from '../../core/modules';
import { useSession } from '../../core/store';
import { useOpenModule } from '../../core/useOpenModule';
import { NEXT_TABLE } from '../oyun/teams';
import { freeWindows, todayIndex } from '../kampus/data';
import { CAT_META, FEATURED, OpenTable, Venue, VENUES, VenueCat, distanceKm, fmtKm } from '../mekan/venues';
import { campusById } from '../kampus/campuses';
import type { TabParams } from '../../core/navigation';

type Cat = 'all' | 'masa' | 'ps' | 'spor';
const CATS: { id: Cat; label: string; cats: VenueCat[]; color: string; tint: string; ink: string }[] = [
  { id: 'all', label: 'Hepsi', cats: [], color: '#1C1C1E', tint: '#FFFFFF', ink: '#1C1C1E' },
  { id: 'masa', label: 'Okey · masa', cats: ['okey', 'kafe', 'bilardo'], color: CAT_META.okey.color, tint: CAT_META.okey.tint, ink: CAT_META.okey.ink },
  { id: 'ps', label: 'PlayStation', cats: ['playstation'], color: CAT_META.playstation.color, tint: CAT_META.playstation.tint, ink: CAT_META.playstation.ink },
  { id: 'spor', label: 'Halı saha · bowling', cats: ['halisaha', 'bowling'], color: CAT_META.halisaha.color, tint: CAT_META.halisaha.tint, ink: CAT_META.halisaha.ink },
];
const ALL = VENUES.flatMap((v) => v.tables.map((t) => ({ v, t })));
const FREE = freeWindows(todayIndex())[0];

export default function Kesfet({ navigation }: BottomTabScreenProps<TabParams, 'Kesfet'>) {
  const insets = useSafeAreaInsets();
  const [cat, setCat] = React.useState<Cat>('all');
  const { modules, campusId } = useSession();
  const openModule = useOpenModule();
  const { width } = useWindowDimensions();
  const tileW = Math.floor((width - 40 - 20) / 3);
  const shownModules = MODULES.filter((m) => modules[m.id] && m.id !== 'eslesme');
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
          <Tap accessibilityLabel="Sohbetler, 2 okunmamış" onPress={() => root?.navigate('Sohbetler')} style={styles.roundBtn}>
            <Icon name="chat" size={20} />
            <View style={styles.dot} />
          </Tap>
          <Tap accessibilityLabel="Profilim" onPress={() => navigation.navigate('Profil')}>
            <Avatar i="DA" bg={C.tint2} size={40} />
          </Tap>
        </View>
      </View>

      <View style={{ gap: 6 }}>
        <T w="s" size={15} color={C.text2}>Selam Deniz</T>
        <T w="x" size={32} style={{ letterSpacing: -1, lineHeight: 36 }} accessibilityRole="header">Bu akşam{'\n'}ne oynuyoruz?</T>
        <Tap style={styles.livePill}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.greenDot }} />
          <T w="s" size={13} color={C.green}>Talas · {campusById(campusId).short} çevresinde {ALL.length} açık masa</T>
        </Tap>
      </View>

      <Countdown onOpen={() => root?.navigate('Sohbet')} onQr={() => root?.navigate('QrCheckin', { venueId: NEXT_TABLE.venueId })} />

      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T w="b" size={22} style={{ letterSpacing: -0.4 }} accessibilityRole="header">Modüller</T>
          <Tap onPress={() => root?.navigate('Moduller')} style={{ minHeight: 32, justifyContent: 'center' }}><T w="s" size={15} color={C.primary}>Düzenle</T></Tap>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {shownModules.map((m) => (
            <ModuleTile key={m.id} m={m} width={tileW} onPress={() => openModule(m)} badge={m.id === 'sohbet' ? '2' : m.id === 'etkinlik' ? 'Yeni' : undefined} />
          ))}
        </View>
      </View>

      <Tap haptic="medium" onPress={() => root?.navigate('HizliEsles')} style={styles.hero}>
        <View style={[styles.deco, { width: 120, height: 150, right: -24, top: -36, transform: [{ rotate: '18deg' }] }]} />
        <View style={[styles.deco, { width: 80, height: 104, right: 70, bottom: -50, transform: [{ rotate: '-14deg' }] }]} />
        <View style={styles.heroIcon}><Icon name="bolt" color={C.sunText} size={26} /></View>
        <View style={{ flex: 1, gap: 2 }}>
          <T w="x" size={20} color="#241200" style={{ letterSpacing: -0.4 }}>Hızlı Eşleş</T>
          <T w="m" size={14} color="#4A3100" style={{ lineHeight: 19 }}>Oyununu seç, 30 saniyede{'\n'}seni masaya oturtalım.</T>
        </View>
        <View style={styles.heroGo}><Icon name="chevRight" color="#FFFFFF" size={16} strokeWidth={3} /></View>
      </Tap>

      {FREE && modules.program ? (
        <Tap onPress={() => navigation.navigate('Kampus')} style={styles.freeCard}>
          <View style={styles.freeIcon}><Icon name="calendar" size={22} color="#05605F" /></View>
          <View style={{ flex: 1 }}>
            <T w="b" size={16} color="#05605F">Bugün {FREE.start}:00–{FREE.end}:00 arası boşsun</T>
            <T size={13} color="#0B6E6D">Ders programına göre {ALL.length} masa uygun · bak</T>
          </View>
          <Icon name="chevRight" color="#05605F" size={14} strokeWidth={3} />
        </Tap>
      ) : null}

      {modules.firsatlar ? <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T w="b" size={22} style={{ letterSpacing: -0.4 }} accessibilityRole="header">Öne çıkan mekanlar</T>
          <T w="s" size={12} color={C.text2}>Reklam</T>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }} snapToInterval={292} decelerationRate="fast">
          {FEATURED.map((v) => <FeaturedCard key={v.id} v={v} onPress={() => root?.navigate('Mekan', { id: v.id })} />)}
        </ScrollView>
      </View> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {CATS.map((c) => {
          const on = c.id === cat;
          return (
            <Tap key={c.id} haptic="light" onPress={() => setCat(c.id)} accessibilityState={{ selected: on }}
              style={[styles.cat, { backgroundColor: on ? c.color : c.tint }]}>
              <T w="b" size={14} color={on ? '#FFFFFF' : c.ink}>{c.label}</T>
            </Tap>
          );
        })}
      </ScrollView>


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

/** Upcoming-table countdown (in-app twin of the iOS Live Activity). */
function Countdown({ onOpen, onQr }: { onOpen: () => void; onQr: () => void }) {
  const [left, setLeft] = React.useState(NEXT_TABLE.minutesFromNow * 60);
  React.useEffect(() => { const i = setInterval(() => setLeft((x) => Math.max(0, x - 1)), 1000); return () => clearInterval(i); }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <Tap onPress={onOpen} style={styles.live} accessibilityLabel={`Yaklaşan masa: ${NEXT_TABLE.game}, ${NEXT_TABLE.venue}, ${mm} dakika kaldı`}>
      <View style={styles.liveTile}><Icon name="tiles" size={20} color="#FFF" strokeWidth={2} /></View>
      <View style={{ flex: 1 }}>
        <T w="s" size={12} color="rgba(255,255,255,0.65)">SIRADAKİ MASAN · {NEXT_TABLE.seats}</T>
        <T w="b" size={15} color="#FFF" numberOfLines={1}>{NEXT_TABLE.game} · {NEXT_TABLE.venue}</T>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        <T w="x" size={22} color={C.sun} style={{ fontVariant: ['tabular-nums'] }}>{mm}:{ss}</T>
        <Tap onPress={onQr} style={styles.liveQr}><T w="b" size={11} color="#241200">QR check-in</T></Tap>
      </View>
    </Tap>
  );
}

function FeaturedCard({ v, onPress }: { v: Venue; onPress: () => void }) {
  const meta = CAT_META[v.cat];
  const open = v.tables.reduce((n, t) => n + t.need, 0);
  return (
    <Tap onPress={onPress} style={[styles.feat, { backgroundColor: meta.color }]} accessibilityLabel={`Reklam. ${v.name}. ${v.featured?.offer}`}>
      <View style={[styles.featDeco, { transform: [{ rotate: '-16deg' }] }]}><Icon name={meta.icon} color={meta.on === '#FFFFFF' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'} size={130} strokeWidth={1.6} /></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={styles.featTag}><T w="b" size={11} color={meta.ink}>{meta.label.toUpperCase()}</T></View>
        {open ? <View style={styles.featOpen}><View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: C.lime }} /><T w="b" size={12} color={meta.on}>{open} kişi aranıyor</T></View> : null}
      </View>
      <View style={{ flex: 1 }} />
      <T w="x" size={21} color={meta.on} numberOfLines={1} style={{ letterSpacing: -0.4 }}>{v.name}</T>
      <View style={styles.offer}><T w="b" size={14} color="#241200" numberOfLines={2}>{v.featured?.offer}</T></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {v.google ? <T w="s" size={13} color={meta.on}>★ {v.google.rating.toFixed(1).replace('.', ',')}</T> : null}
        <T w="s" size={13} color={meta.on}>{fmtKm(distanceKm(v.lat, v.lng))}</T>
        <T w="s" size={13} color={meta.on} numberOfLines={1} style={{ flex: 1 }}>{v.area.split(' · ')[0]}</T>
      </View>
    </Tap>
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
        <View style={[styles.tile, { backgroundColor: meta.color }]}><Icon name={meta.icon} color={meta.on} size={24} strokeWidth={2} /></View>
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
          <View style={[styles.need, { backgroundColor: meta.tint }]}><T w="b" size={12} color={meta.ink}>{t.need} kişi aranıyor</T></View>
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
    flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 24, backgroundColor: C.sun, overflow: 'hidden',
    shadowColor: '#C78A00', shadowOpacity: 0.3, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  deco: { position: 'absolute', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.35)' },
  heroIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  heroGo: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#241200', alignItems: 'center', justifyContent: 'center' },
  live: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#14121F', borderRadius: 22, padding: 14 },
  liveTile: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#0C642F', alignItems: 'center', justifyContent: 'center' },
  liveQr: { backgroundColor: C.sun, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  freeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#DBF5F4', borderRadius: 18, padding: 14 },
  freeIcon: { width: 44, height: 44, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: C.greenBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginTop: 4 },
  feat: { width: 280, height: 196, borderRadius: 26, padding: 16, gap: 8, overflow: 'hidden' },
  featDeco: { position: 'absolute', right: -26, top: -18 },
  featTag: { backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  featOpen: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.22)', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  offer: { alignSelf: 'flex-start', backgroundColor: C.sun, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, maxWidth: '100%' },
  cat: { height: 38, paddingHorizontal: 16, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
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
