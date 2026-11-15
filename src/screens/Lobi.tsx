import React from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import Icon, { IconName } from '../components/Icon';
import { Avatar, Card, NavBack, PrimaryButton, SectionLabel, Sep, T, Tap, tapSuccess } from '../components/ui';
import { ME, TABLE_PLAYERS } from '../data';
import { CAT_META, VENUES, distanceKm, fmtKm, venueById } from '../venues';
import { useSession } from '../store';
import { SmokeFact } from './Harita';
import type { ScreenProps } from '../navigation';

type Stage = 'idle' | 'requested' | 'approved';

export default function Lobi({ navigation, route }: ScreenProps<'Lobi'>) {
  const insets = useSafeAreaInsets();
  const { verification } = useSession();
  const venue = venueById(route.params?.venueId) ?? VENUES[0];
  const table = venue.tables.find((t) => t.id === route.params?.tableId) ?? venue.tables[0] ?? {
    id: 'new', game: 'Yeni masa', need: 1, total: 4, time: 'Bugün 21:30', host: 'Sen', hostTrust: 96,
  };
  const meta = CAT_META[venue.cat];
  const [stage, setStage] = React.useState<Stage>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const seated = table.total - table.need;
  const shown = Math.min(seated, 3);
  const base = TABLE_PLAYERS.slice(0, shown).map((p, i) => (i === 0 ? { ...p, name: table.host, meta: `Kurucu · Güven ${table.hostTrust}` } : p));
  const ok = stage === 'approved';
  const players = ok ? [...base, { id: 'me', i: ME.i, bg: ME.bg, name: 'Sen', meta: 'Az önce katıldın', rating: '4,8', trust: 96 }] : base;
  const filled = seated + (ok ? 1 : 0);
  const done = filled >= table.total;
  const womenLocked = !!table.womenOnly && !(verification.status === 'verified' && verification.gender === 'kadin');

  const request = () => {
    setStage('requested');
    timer.current = setTimeout(() => { tapSuccess(); setStage('approved'); }, 2000);
  };
  const cancel = () => { if (timer.current) clearTimeout(timer.current); setStage('idle'); };
  const directions = () => {
    const url = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${venue.lat},${venue.lng}&q=${encodeURIComponent(venue.name)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.name)}&query_place_id=${venue.google?.placeId ?? ''}`;
    Linking.openURL(url).catch(() => {});
  };

  const rows: { icon: IconName; title: string; sub: string }[] = [
    { icon: 'clock', title: table.time, sub: 'Tahmini 2 saat' },
    { icon: 'bars', title: table.level ?? 'Her seviye', sub: 'Kurucu onayıyla katılım · Güven 85+' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={styles.nav}>
        <NavBack label="Geri" onPress={() => navigation.goBack()} />
        <View style={{ flexDirection: 'row' }}>
          <Tap accessibilityLabel="Kaydet" style={styles.navBtn}><Icon name="bookmark" color={C.primary} size={21} /></Tap>
          <Tap accessibilityLabel="Paylaş" style={styles.navBtn}><Icon name="share" color={C.primary} size={22} /></Tap>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 170, gap: 18 }}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            <View style={[styles.badge, { backgroundColor: done ? C.greenBg : C.tint }]}>
              <T w="s" size={13} color={done ? C.green : C.tintText}>{done ? 'Masa tamamlandı' : `${table.total - filled} kişi aranıyor`}</T>
            </View>
            {table.womenOnly ? <View style={[styles.badge, { backgroundColor: '#FDE7F1' }]}><T w="s" size={13} color="#8A1C5C">Kadın masası · doğrulanmış</T></View> : null}
          </View>
          <T w="x" size={30} style={{ letterSpacing: -0.7 }} accessibilityRole="header">{table.game}</T>
        </View>

        <Tap onPress={() => navigation.navigate('Mekan', { id: venue.id })} style={styles.venueCard} accessibilityLabel={`${venue.name} mekan detayı`}>
          <View style={[styles.catTile, { backgroundColor: meta.color }]}><Icon name={meta.icon} color="#FFF" size={22} strokeWidth={2} /></View>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <T w="s" size={16} numberOfLines={1} style={{ flexShrink: 1 }}>{venue.name}</T>
              {venue.partner ? <View style={styles.partner}><T w="b" size={10} color={C.tintText}>PARTNER</T></View> : null}
            </View>
            <T size={13} color={C.text2}>{venue.area} · kampüse {fmtKm(distanceKm(venue.lat, venue.lng))}</T>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
              {venue.google ? (
                <View style={styles.fact}><Icon name="star" size={12} color={C.orange} fill={C.orange} strokeWidth={1} /><T w="s" size={12}>{venue.google.rating.toFixed(1).replace('.', ',')}</T></View>
              ) : null}
              <SmokeFact v={venue} />
            </View>
          </View>
          <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
        </Tap>

        <Card>
          {rows.map((r, idx) => (
            <View key={r.icon}>
              {idx > 0 ? <Sep inset={48} /> : null}
              <View style={styles.row}>
                <Icon name={r.icon} color={C.primary} size={20} />
                <View style={{ flex: 1 }}>
                  <T size={16}>{r.title}</T>
                  <T size={13} color={C.text2}>{r.sub}</T>
                </View>
              </View>
            </View>
          ))}
          <Sep inset={48} />
          <Tap onPress={directions} style={styles.row}>
            <Icon name="directions" color={C.primary} size={20} />
            <T size={16} style={{ flex: 1 }}>Yol tarifi</T>
            <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
          </Tap>
        </Card>

        <View style={{ gap: 8 }}>
          <SectionLabel>Masadakiler · {filled}/{table.total}</SectionLabel>
          <Card>
            {players.map((p, idx) => (
              <View key={p.id}>
                {idx > 0 ? <Sep inset={68} /> : null}
                <View style={[styles.row, { paddingVertical: 10 }]}>
                  <Avatar i={p.i} bg={p.bg} size={40} />
                  <View style={{ flex: 1 }}>
                    <T w="s" size={16}>{p.name}</T>
                    <T size={13} color={C.text2}>{p.meta}</T>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="star" size={13} color={C.orange} fill={C.orange} strokeWidth={1} />
                    <T w="s" size={14}>{p.rating}</T>
                  </View>
                </View>
              </View>
            ))}
            {seated > shown ? <><Sep inset={68} /><View style={[styles.row, { paddingVertical: 10 }]}><T size={14} color={C.text2}>+ {seated - shown} oyuncu daha</T></View></> : null}
            {!done ? (
              <>
                <Sep inset={68} />
                <View style={[styles.row, { paddingVertical: 10 }]}>
                  <View style={styles.seat}><T size={18} color={C.text2}>+</T></View>
                  <T size={16} color={C.text2}>Boş yer — senin yerin olabilir</T>
                </View>
              </>
            ) : null}
          </Card>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {stage === 'idle' && womenLocked ? (
          <>
            <PrimaryButton title="Kadın masası · Önce kimliğini doğrula" onPress={() => navigation.navigate('Dogrulama')} />
            <T size={13} color={C.text2} style={{ textAlign: 'center' }}>Bu masayı yalnızca doğrulanmış kadın oyuncular görür</T>
          </>
        ) : null}
        {stage === 'idle' && !womenLocked ? (
          <>
            <PrimaryButton title="Katılma isteği gönder" onPress={request} />
            <T size={13} color={C.text2} style={{ textAlign: 'center' }}>{table.host} genelde birkaç dakika içinde yanıtlıyor</T>
          </>
        ) : null}
        {stage === 'requested' ? (
          <>
            <View style={styles.pending} accessibilityLiveRegion="polite">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.orange }} />
              <T w="s" size={16} color={C.text3}>İstek gönderildi · onay bekleniyor</T>
            </View>
            <Tap onPress={cancel} style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <T w="s" size={15} color={C.red}>İsteği geri çek</T>
            </Tap>
          </>
        ) : null}
        {stage === 'approved' ? (
          <>
            <PrimaryButton title="Masadasın · Sohbete geç" color={C.green} onPress={() => navigation.navigate('Sohbet')} />
            <T size={13} color={C.text2} style={{ textAlign: 'center' }}>Başlamadan 30 dk önce hatırlatacağız</T>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4 },
  navBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  venueCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14 },
  catTile: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  fact: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  partner: { backgroundColor: C.tint, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  seat: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: C.gray, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, gap: 8, backgroundColor: 'rgba(242,242,247,0.97)' },
  pending: { height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
