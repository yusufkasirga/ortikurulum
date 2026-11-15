import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../../core/theme';
import Icon from '../../components/Icon';
import { Card, GameTile, SectionLabel, Segmented, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../../components/ui';
import { CAT_META, VENUES, Venue, VenueCat, venueById } from '../mekan/venues';
import { useSession } from '../../core/store';
import type { ScreenProps } from '../../core/navigation';
import { track } from '../../core/analytics';

type Mode = 'masa' | 'online';
type Join = 'approve' | 'instant';
type Audience = 'karma' | 'kadin' | 'erkek';
type Game = { id: string; label: string; mark: string; bg: string; size: number; cats: VenueCat[] };

const TABLE_GAMES: Game[] = [
  { id: 'okey', label: 'Okey', mark: 'O', bg: '#0C642F', size: 4, cats: ['okey'] },
  { id: 'tavla', label: 'Tavla', mark: 'T', bg: '#8A5A2B', size: 2, cats: ['okey', 'kafe'] },
  { id: 'bilardo', label: 'Bilardo', mark: 'B', bg: '#1C1C1E', size: 2, cats: ['bilardo'] },
  { id: 'ps', label: 'PlayStation', mark: 'P', bg: '#3A2FB8', size: 2, cats: ['playstation', 'okey'] },
  { id: 'kutu', label: 'Kutu oyunu', mark: 'K', bg: '#7A4100', size: 4, cats: ['kafe'] },
  { id: 'saha', label: 'Halı saha', mark: 'H', bg: '#0B7A6E', size: 14, cats: ['halisaha'] },
];
const ONLINE_GAMES: Game[] = [
  { id: 'val', label: 'Valorant', mark: 'V', bg: '#C8243C', size: 5, cats: [] },
  { id: 'cs', label: 'CS2', mark: 'C', bg: '#8E4100', size: 5, cats: [] },
  { id: 'lol', label: 'LoL', mark: 'L', bg: '#0B5C8C', size: 5, cats: [] },
  { id: 'fc', label: 'EA FC', mark: 'F', bg: '#146C34', size: 2, cats: [] },
  { id: 'pubg', label: 'PUBG', mark: 'P', bg: '#8A6A00', size: 4, cats: [] },
  { id: 'diger', label: 'Diğer', mark: '+', bg: '#4F4F54', size: 4, cats: [] },
];

const venuesFor = (g: Game): Venue[] => VENUES.filter((v) => g.cats.includes(v.cat) || (g.id === 'bilardo' && v.games.some((x) => x.value === 'Bilardo')) || (g.id === 'ps' && v.games.some((x) => x.value.startsWith('PlayStation'))));

export default function Olustur({ navigation, route }: ScreenProps<'Olustur'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardW = Math.floor((width - 40 - 20) / 3);
  const { verification } = useSession();
  const preVenue = venueById(route.params?.venueId);
  const preGame = preVenue ? TABLE_GAMES.find((g) => g.cats.includes(preVenue.cat)) : undefined;

  const [mode, setMode] = React.useState<Mode>('masa');
  const [gameId, setGameId] = React.useState(preGame?.id ?? 'okey');
  const [venueId, setVenueId] = React.useState<string | undefined>(preVenue?.id);
  const [need, setNeed] = React.useState(1);
  const [join, setJoin] = React.useState<Join>('approve');
  const [audience, setAudience] = React.useState<Audience | undefined>(route.params?.audience);
  const [trusted, setTrusted] = React.useState(true);
  const [note, setNote] = React.useState('');

  const list = mode === 'masa' ? TABLE_GAMES : ONLINE_GAMES;
  const game = list.find((g) => g.id === gameId) ?? list[0];
  const options = mode === 'masa' ? venuesFor(game) : [];
  const venue = options.find((v) => v.id === venueId) ?? options[0];
  const max = Math.max(1, game.size - 1);
  const n = Math.min(need, max);

  const restricted = audience === 'kadin' || audience === 'erkek';
  const verifiedForAudience = !restricted || (verification.status === 'verified' && verification.gender === audience);
  const canPublish = !!audience && verifiedForAudience;

  const changeMode = (m: Mode) => { setMode(m); setGameId(m === 'masa' ? 'okey' : 'val'); setNeed(1); setVenueId(undefined); };
  const publish = () => {
    if (!canPublish) return;
    tapSuccess();
    track('masa_acildi', { oyun: game.id, kitle: audience ?? 'karma', mod: mode });
    navigation.goBack();
    navigation.navigate('Lobi', { venueId: venue?.id ?? 'arena', tableId: 't1' });
  };
  const top = insets.top > 30 ? 12 : insets.top + 8;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.nav, { paddingTop: top }]}>
        <Tap onPress={() => navigation.goBack()} style={styles.navSide}><T size={17} color={C.primary}>İptal</T></Tap>
        <T w="s" size={17} accessibilityRole="header">Masa aç</T>
        <Tap haptic="medium" disabled={!canPublish} onPress={publish} style={[styles.navSide, { alignItems: 'flex-end' }]} accessibilityState={{ disabled: !canPublish }}>
          <T w="b" size={17} color={canPublish ? C.primary : C.gray}>Yayınla</T>
        </Tap>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: insets.bottom + 40, gap: 20 }} keyboardShouldPersistTaps="handled">
        <Segmented<Mode> value={mode} onChange={changeMode} items={[{ id: 'masa', label: 'Yüz yüze' }, { id: 'online', label: 'Online' }]} />

        <View style={styles.grid}>
          {list.map((g) => {
            const on = g.id === game.id;
            return (
              <Tap key={g.id} onPress={() => { tapLight(); setGameId(g.id); setNeed(1); setVenueId(undefined); }} accessibilityState={{ selected: on }}
                style={[styles.gameCard, { width: cardW, borderColor: on ? C.primary : 'transparent' }]}>
                <GameTile mark={g.mark} bg={g.bg} size={36} />
                <T w="s" size={13} numberOfLines={1}>{g.label}</T>
              </Tap>
            );
          })}
        </View>

        {mode === 'masa' ? (
          <View style={{ gap: 8 }}>
            <SectionLabel>Nerede? · Talas</SectionLabel>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
              {options.map((v) => {
                const on = v.id === venue?.id;
                return (
                  <Tap key={v.id} onPress={() => { tapLight(); setVenueId(v.id); }} accessibilityState={{ selected: on }}
                    style={[styles.venueChip, { borderColor: on ? C.primary : 'transparent' }]}>
                    <View style={[styles.dot, { backgroundColor: CAT_META[v.cat].color }]}><Icon name={CAT_META[v.cat].icon} size={14} color={CAT_META[v.cat].on} strokeWidth={2} /></View>
                    <View style={{ maxWidth: 170 }}>
                      <T w="s" size={14} numberOfLines={1}>{v.name}</T>
                      <T size={12} color={C.text2} numberOfLines={1}>
                        {v.smoking.value === 'kapali-serbest' ? 'İçeride sigara var' : v.smoking.value === 'acik-alan' ? 'Açık alan' : 'Sigara: bilinmiyor'}
                        {v.google ? ` · ★ ${v.google.rating.toFixed(1).replace('.', ',')}` : ''}
                      </T>
                    </View>
                  </Tap>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          <SectionLabel>Kimler katılabilir? (zorunlu)</SectionLabel>
          <Card>
            {([
              { id: 'karma', label: 'Herkes (karma masa)', sub: 'Kadın ve erkek oyuncular' },
              { id: 'kadin', label: 'Sadece kadınlar', sub: 'Yalnızca kimliği doğrulanmış kadın oyuncular görür ve katılır' },
              { id: 'erkek', label: 'Sadece erkekler', sub: 'Yalnızca kimliği doğrulanmış erkek oyuncular' },
            ] as { id: Audience; label: string; sub: string }[]).map((a, i) => (
              <View key={a.id}>
                {i > 0 ? <Sep /> : null}
                <Tap accessibilityRole="radio" accessibilityState={{ checked: audience === a.id }} onPress={() => { tapLight(); setAudience(a.id); }} style={styles.row}>
                  {a.id === 'kadin' ? <Icon name="female" size={20} color="#B0236A" /> : <Icon name="person" size={20} color={C.text3} />}
                  <View style={{ flex: 1 }}>
                    <T size={16}>{a.label}</T>
                    <T size={13} color={C.text2}>{a.sub}</T>
                  </View>
                  {audience === a.id ? <Icon name="check" color={C.primary} size={20} strokeWidth={3} /> : null}
                </Tap>
              </View>
            ))}
          </Card>
          {restricted && !verifiedForAudience ? (
            <View style={styles.verify}>
              <Icon name="shield" size={22} color={C.primary} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w="s" size={15} color={C.tintText}>Önce kimliğini doğrula</T>
                <T size={13} color={C.primaryDark} style={{ lineHeight: 18 }}>Cinsiyete özel masa açmak için bir kez doğrulama gerekiyor. Kimlik görüntün saklanmaz.</T>
              </View>
              <Tap haptic="medium" onPress={() => navigation.navigate('Dogrulama', { then: 'olustur', venueId: venue?.id })} style={styles.verifyBtn}>
                <T w="s" size={14} color="#FFF">Doğrula</T>
              </Tap>
            </View>
          ) : null}
          {!audience ? <T size={12} color={C.text2} style={{ marginHorizontal: 4 }}>Yayınlamak için bir seçenek seç.</T> : null}
        </View>

        <Card>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <T size={16}>Kaç kişi eksik?</T>
              <T size={13} color={C.text2}>{game.label} {game.size} kişilik · {game.size - n} kişi hazır</T>
            </View>
            <View style={styles.stepper}>
              <Tap accessibilityLabel="Azalt" onPress={() => { tapLight(); setNeed(Math.max(1, n - 1)); }} style={styles.stepBtn}><T size={22}>−</T></Tap>
              <T w="s" size={17} style={{ minWidth: 22, textAlign: 'center' }} accessibilityLiveRegion="polite">{n}</T>
              <Tap accessibilityLabel="Artır" onPress={() => { tapLight(); setNeed(Math.min(max, n + 1)); }} style={styles.stepBtn}><T size={22}>+</T></Tap>
            </View>
          </View>
          <Sep />
          <View style={styles.row}>
            <T size={16} style={{ flex: 1 }}>Zaman</T>
            <View style={styles.pill}><T size={15}>Bugün</T></View>
            <View style={styles.pill}><T size={15}>21:30</T></View>
          </View>
          <Sep />
          <Tap style={styles.row}>
            <T size={16} style={{ flex: 1 }}>Seviye</T>
            <T size={16} color={C.text2}>Orta</T>
            <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
          </Tap>
        </Card>

        <Card>
          {([
            { id: 'approve', label: 'Ben onaylayayım', sub: 'İstekler sana düşer, sen seçersin' },
            { id: 'instant', label: 'Anında katılım', sub: 'Kriterlere uyan direkt oturur' },
          ] as { id: Join; label: string; sub: string }[]).map((j) => (
            <View key={j.id}>
              <Tap accessibilityRole="radio" accessibilityState={{ checked: join === j.id }} onPress={() => { tapLight(); setJoin(j.id); }} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <T size={16}>{j.label}</T>
                  <T size={13} color={C.text2}>{j.sub}</T>
                </View>
                {join === j.id ? <Icon name="check" color={C.primary} size={20} strokeWidth={3} /> : null}
              </Tap>
              <Sep />
            </View>
          ))}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <T size={16}>Sadece güvenilir oyuncular</T>
              <T size={13} color={C.text2}>Güven skoru 85 ve üstü</T>
            </View>
            <Toggle value={trusted} onChange={setTrusted} label="Sadece güvenilir oyuncular" />
          </View>
        </Card>

        <Card style={{ padding: 16, gap: 6 }}>
          <T w="s" size={13} color={C.text2}>Not</T>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Masanı anlat: kurallar, ortam, beklentin…"
            placeholderTextColor={C.gray}
            accessibilityLabel="Not"
            style={{ fontFamily: F.r, fontSize: 16, color: C.text, minHeight: 66, textAlignVertical: 'top', padding: 0 }}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  navSide: { minWidth: 80, minHeight: 44, justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gameCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 8, borderWidth: 2 },
  venueChip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 2 },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 50 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.fill, borderRadius: 9, height: 34 },
  stepBtn: { width: 46, height: 34, alignItems: 'center', justifyContent: 'center' },
  pill: { backgroundColor: C.fill, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 5 },
  verify: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.tint, borderRadius: 16, padding: 14 },
  verifyBtn: { height: 36, paddingHorizontal: 14, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center' },
});
