import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import Icon from '../components/Icon';
import { Card, GameTile, SectionLabel, Segmented, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../components/ui';
import { GAMES_ONLINE, GAMES_TABLE } from '../data';
import type { ScreenProps } from '../navigation';

type Mode = 'masa' | 'online';
type Join = 'approve' | 'instant';

export default function Olustur({ navigation }: ScreenProps<'Olustur'>) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardW = Math.floor((width - 40 - 20) / 3);
  const [mode, setMode] = React.useState<Mode>('masa');
  const [game, setGame] = React.useState('okey');
  const [need, setNeed] = React.useState(1);
  const [join, setJoin] = React.useState<Join>('approve');
  const [trusted, setTrusted] = React.useState(true);
  const [note, setNote] = React.useState('');

  const list = mode === 'masa' ? GAMES_TABLE : GAMES_ONLINE;
  const cur = list.find((g) => g.id === game) ?? list[0];
  const max = Math.max(1, cur.size - 1);
  const n = Math.min(need, max);

  const changeMode = (m: Mode) => { setMode(m); setGame(m === 'masa' ? 'okey' : 'val'); setNeed(1); };
  const publish = () => { tapSuccess(); navigation.goBack(); navigation.navigate('Lobi', { id: 'okey' }); };

  // Modal on iOS has its own top inset; Android needs the status bar inset.
  const top = insets.top > 30 ? 12 : insets.top + 8;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.nav, { paddingTop: top }]}>
        <Tap onPress={() => navigation.goBack()} style={styles.navSide}><T size={17} color={C.primary}>İptal</T></Tap>
        <T w="s" size={17} accessibilityRole="header">Masa aç</T>
        <Tap haptic="medium" onPress={publish} style={[styles.navSide, { alignItems: 'flex-end' }]}><T w="b" size={17} color={C.primary}>Yayınla</T></Tap>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: insets.bottom + 40, gap: 20 }} keyboardShouldPersistTaps="handled">
        <Segmented<Mode> value={mode} onChange={changeMode} items={[{ id: 'masa', label: 'Yüz yüze' }, { id: 'online', label: 'Online' }]} />

        <View style={styles.grid}>
          {list.map((g) => {
            const on = g.id === cur.id;
            return (
              <Tap key={g.id} onPress={() => { tapLight(); setGame(g.id); setNeed(1); }} accessibilityState={{ selected: on }}
                style={[styles.gameCard, { width: cardW, borderColor: on ? C.primary : 'transparent' }]}>
                <GameTile mark={g.mark} bg={g.bg} size={36} />
                <T w="s" size={14}>{g.label}</T>
              </Tap>
            );
          })}
        </View>

        <Card>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <T size={16}>Kaç kişi eksik?</T>
              <T size={13} color={C.text2}>{cur.label} {cur.size} kişilik · {cur.size - n} kişi hazır</T>
            </View>
            <View style={styles.stepper}>
              <Tap accessibilityLabel="Azalt" onPress={() => { tapLight(); setNeed(Math.max(1, n - 1)); }} style={styles.stepBtn}><T size={22}>−</T></Tap>
              <T w="s" size={17} style={{ minWidth: 22, textAlign: 'center' }} accessibilityLiveRegion="polite">{n}</T>
              <Tap accessibilityLabel="Artır" onPress={() => { tapLight(); setNeed(Math.min(max, n + 1)); }} style={styles.stepBtn}><T size={22}>+</T></Tap>
            </View>
          </View>
          <Sep />
          <Tap style={styles.row}>
            <T size={16} style={{ flex: 1 }}>{mode === 'masa' ? 'Mekan' : 'Platform'}</T>
            <T size={16} color={C.text2}>{mode === 'masa' ? 'Moda Kahvesi' : 'PC · Sesli'}</T>
            <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
          </Tap>
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

        <View style={{ gap: 8 }}>
          <SectionLabel>Kimler katılabilir?</SectionLabel>
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
        </View>

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
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 13, minHeight: 50 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.fill, borderRadius: 9, height: 34 },
  stepBtn: { width: 46, height: 34, alignItems: 'center', justifyContent: 'center' },
  pill: { backgroundColor: C.fill, borderRadius: 7, paddingHorizontal: 10, paddingVertical: 5 },
});
