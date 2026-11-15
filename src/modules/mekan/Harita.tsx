import React from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import VenueMap from '../../components/VenueMap';
import { T, Tap, tapLight } from '../../components/ui';
import { CAT_META, OpenTable, SMOKING_LABEL, Venue, VenueCat, VENUES, distanceKm, fmtKm } from './venues';
import type { TabParams } from '../../core/navigation';

type Filter = 'all' | VenueCat;
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'okey', label: 'Okey' },
  { id: 'playstation', label: 'PlayStation' },
  { id: 'bilardo', label: 'Bilardo' },
  { id: 'halisaha', label: 'Halı saha' },
  { id: 'kafe', label: 'Kafe · kutu oyunu' },
  { id: 'bowling', label: 'Bowling' },
];

const TAB_BAR = 84;

export default function Harita({ navigation, route }: BottomTabScreenProps<TabParams, 'Harita'>) {
  const insets = useSafeAreaInsets();
  const root = navigation.getParent();
  const [filter, setFilter] = React.useState<Filter>('all');
  const [onlyOpen, setOnlyOpen] = React.useState(false);
  const [noSmoke, setNoSmoke] = React.useState(false);
  const [selected, setSelected] = React.useState<string | undefined>();
  const [seenFilter, setSeenFilter] = React.useState(route.params?.filter);
  if (route.params?.filter !== seenFilter) { setSeenFilter(route.params?.filter); if (route.params?.filter) { setFilter(route.params.filter); setSelected(undefined); } }

  const venues = VENUES.filter((v) =>
    (filter === 'all' || v.cat === filter || (filter === 'bilardo' && v.games.some((x) => x.value === 'Bilardo'))) &&
    (!onlyOpen || v.tables.length > 0) &&
    (!noSmoke || v.smoking.value !== 'kapali-serbest'),
  );
  const sel = VENUES.find((v) => v.id === selected);
  const looking = venues.flatMap((v) => v.tables.map((t) => ({ v, t })));
  const bottom = TAB_BAR + insets.bottom * 0.4;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <VenueMap venues={venues} selectedId={selected} onSelect={setSelected} bottomInset={sel ? 300 : 190} />

      {/* Top: place + filters */}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <View style={styles.searchRow}>
          <View style={styles.search}>
            <Icon name="search" size={18} color={C.text2} />
            <T size={16} color={C.text2} style={{ flex: 1 }} numberOfLines={1}>Talas · ERÜ çevresi</T>
            <View style={styles.live}><View style={styles.liveDot} /><T w="s" size={12} color={C.green}>{looking.length} masa</T></View>
          </View>
          <Tap accessibilityLabel="Liste görünümü" onPress={() => navigation.navigate('Kesfet')} style={styles.squareBtn}>
            <Icon name="list" size={20} color={C.text} />
          </Tap>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
          <FilterChip label="Masa arayanlar" icon="person" on={onlyOpen} onPress={() => setOnlyOpen((x) => !x)} green />
          <FilterChip label="Dumansız" icon="noSmoke" on={noSmoke} onPress={() => setNoSmoke((x) => !x)} />
          {FILTERS.map((f) => (
            <FilterChip key={f.id} label={f.label} on={filter === f.id} color={f.id === 'all' ? undefined : CAT_META[f.id].color} onPress={() => { setFilter(f.id); setSelected(undefined); }} />
          ))}
        </ScrollView>
      </View>

      {/* Bottom: selected venue card, or who-is-looking carousel */}
      <View style={[styles.bottomWrap, { bottom }]} pointerEvents="box-none">
        {sel ? (
          <VenueCard
            v={sel}
            onClose={() => setSelected(undefined)}
            onOpen={() => root?.navigate('Mekan', { id: sel.id })}
            onJoin={(t) => root?.navigate('Lobi', { venueId: sel.id, tableId: t.id })}
            onCreate={() => root?.navigate('Olustur', { venueId: sel.id })}
          />
        ) : (
          <>
            <T w="b" size={15} style={styles.carouselTitle}>Şu an masa arayanlar</T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}>
              {looking.length === 0 ? (
                <View style={[styles.lookCard, { width: 260 }]}><T size={14} color={C.text2}>Bu filtrede açık masa yok. İlk masayı sen aç.</T></View>
              ) : looking.map(({ v, t }) => (
                <Tap key={t.id} onPress={() => { tapLight(); setSelected(v.id); }} style={styles.lookCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View style={[styles.miniPin, { backgroundColor: CAT_META[v.cat].color }]}><Icon name={CAT_META[v.cat].icon} color={CAT_META[v.cat].on} size={16} strokeWidth={2} /></View>
                    <View style={{ flex: 1 }}>
                      <T w="s" size={15} numberOfLines={1}>{t.game}</T>
                      <T size={12} color={C.text2} numberOfLines={1}>{v.name}</T>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <View style={styles.needPill}><T w="s" size={12} color={C.tintText}>{t.need} kişi</T></View>
                    <T w="s" size={12} color={C.text3}>{t.time}</T>
                    {t.womenOnly ? <View style={styles.womenPill}><T w="s" size={11} color="#8A1C5C">Kadın masası</T></View> : null}
                  </View>
                </Tap>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

function FilterChip({ label, on, onPress, icon, green, color }: { label: string; on: boolean; onPress: () => void; icon?: 'person' | 'noSmoke'; green?: boolean; color?: string }) {
  const bg = on ? (green ? C.green : color ?? C.text) : '#FFFFFF';
  const fg = on ? '#FFFFFF' : C.text;
  return (
    <Tap haptic="light" onPress={onPress} accessibilityState={{ selected: on }} style={[styles.chip, { backgroundColor: bg }]}>
      {icon ? <Icon name={icon} size={15} color={fg} /> : null}
      {color && !on ? <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: color }} /> : null}
      <T w="s" size={14} color={fg}>{label}</T>
    </Tap>
  );
}

function VenueCard({ v, onClose, onOpen, onJoin, onCreate }: {
  v: Venue; onClose: () => void; onOpen: () => void; onJoin: (t: OpenTable) => void; onCreate: () => void;
}) {
  const meta = CAT_META[v.cat];
  const directions = () => {
    const url = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${v.lat},${v.lng}&q=${encodeURIComponent(v.name)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}&query_place_id=${v.google?.placeId ?? ''}`;
    Linking.openURL(url).catch(() => {});
  };
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={[styles.catTile, { backgroundColor: meta.color }]}><Icon name={meta.icon} color={meta.on} size={24} strokeWidth={2} /></View>
        <Tap onPress={onOpen} style={{ flex: 1 }} accessibilityLabel={`${v.name} detayları`}>
          <T w="b" size={18} numberOfLines={1}>{v.name}</T>
          <T size={13} color={C.text2}>{meta.label} · {fmtKm(distanceKm(v.lat, v.lng))} · {v.hours}</T>
        </Tap>
        <Tap accessibilityLabel="Kapat" onPress={onClose} style={styles.closeBtn}><Icon name="close" size={16} color={C.text2} strokeWidth={2.6} /></Tap>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {v.google ? (
          <View style={styles.fact}><Icon name="star" size={13} color={C.orange} fill={C.orange} strokeWidth={1} /><T w="s" size={13}>{v.google.rating.toFixed(1).replace('.', ',')}</T><T size={12} color={C.text2}>Google · {v.google.count}</T></View>
        ) : null}
        <SmokeFact v={v} />
        {v.hookah?.value ? <View style={styles.fact}><Icon name="hookah" size={14} color={C.text3} /><T size={13}>Nargile var</T></View> : null}
        {v.games.slice(0, 3).map((x) => <View key={x.value} style={styles.fact}><T size={13}>{x.value}</T></View>)}
      </View>

      {v.featured ? (
        <View style={styles.offerRow}>
          <View style={styles.adTag}><T w="b" size={10} color={C.sunText}>REKLAM</T></View>
          <T w="b" size={14} color="#241200" style={{ flex: 1 }} numberOfLines={2}>{v.featured.offer}</T>
        </View>
      ) : null}

      {v.tables.length ? (
        <View style={{ gap: 6 }}>
          {v.tables.slice(0, 2).map((t) => (
            <View key={t.id} style={styles.tableRow}>
              <View style={{ flex: 1 }}>
                <T w="s" size={15}>{t.game} · {t.need} kişi aranıyor</T>
                <T size={12} color={C.text2}>{t.time} · {t.host} · Güven {t.hostTrust}{t.womenOnly ? ' · Kadın masası' : ''}</T>
              </View>
              <Tap haptic="medium" onPress={() => onJoin(t)} style={styles.joinBtn}><T w="s" size={14} color="#FFF">Katıl</T></Tap>
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.tableRow, { backgroundColor: C.bg }]}>
          <T size={14} color={C.text2} style={{ flex: 1 }}>Burada şu an açık masa yok.</T>
          <Tap haptic="medium" onPress={onCreate} style={[styles.joinBtn, { backgroundColor: C.text }]}><T w="s" size={14} color="#FFF">Masa aç</T></Tap>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Tap onPress={onOpen} style={styles.secondary}><Icon name="menu" size={17} color={C.primary} /><T w="s" size={15} color={C.primary}>Detay, fiyat, menü</T></Tap>
        <Tap onPress={directions} style={styles.dirBtn} accessibilityLabel="Yol tarifi"><Icon name="directions" size={18} color={C.primary} /></Tap>
      </View>
    </View>
  );
}

export function SmokeFact({ v }: { v: Venue }) {
  const s = v.smoking.value;
  const icon = s === 'dumansiz' ? 'noSmoke' : 'smoke';
  const label = s === 'kapali-serbest' ? 'İçeride sigara var' : s === 'acik-alan' ? 'Açık alan' : s === 'dumansiz' ? 'Dumansız' : 'Sigara: bilinmiyor';
  return (
    <View style={styles.fact} accessibilityLabel={SMOKING_LABEL[s]}>
      <Icon name={icon} size={14} color={s === 'bilinmiyor' ? C.gray : C.text3} />
      <T size={13} color={s === 'bilinmiyor' ? C.text2 : C.text}>{label}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 0, right: 0, top: 0, gap: 10 },
  searchRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16 },
  search: {
    flex: 1, height: 48, borderRadius: 14, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.greenBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: C.greenDot },
  squareBtn: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  chip: {
    height: 36, paddingHorizontal: 14, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  bottomWrap: { position: 'absolute', left: 0, right: 0, gap: 8, paddingBottom: 10 },
  carouselTitle: { marginLeft: 20, textShadowColor: 'rgba(255,255,255,0.9)', textShadowRadius: 6 },
  lookCard: {
    width: 230, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 12, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  miniPin: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  needPill: { backgroundColor: C.tint, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  womenPill: { backgroundColor: '#FDE7F1', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  card: {
    marginHorizontal: 12, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  catTile: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.bg, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 6 },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.tint, borderRadius: 14, padding: 10 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.sun, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 },
  adTag: { backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  joinBtn: { height: 36, paddingHorizontal: 16, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center' },
  dirBtn: { width: 52, height: 44, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  secondary: { flex: 1, height: 44, borderRadius: 12, backgroundColor: C.tint, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
