import React from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View, AccessibilityInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { C } from '../theme';
import Icon from '../components/Icon';
import { Avatar, Chip, GameTile, Logo, NavBack, PrimaryButton, SectionLabel, Segmented, T, Tap, tapSuccess } from '../components/ui';
import type { ScreenProps } from '../navigation';

const GAMES: [string, string][] = [
  ['okey', 'Okey'], ['tavla', 'Tavla'], ['bilardo', 'Bilardo'], ['batak', 'Batak'],
  ['valorant', 'Valorant'], ['saha', 'Halı saha'], ['satranc', 'Satranç'], ['fc', 'EA FC'],
];
type When = 'now' | 'tonight' | 'tomorrow';
type Dist = '1' | '3' | '5' | 'any';
type Stage = 'setup' | 'search' | 'found';
const TOTAL = 30;
const CIRC = 2 * Math.PI * 26;

export default function HizliEsles({ navigation }: ScreenProps<'HizliEsles'>) {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = React.useState<Stage>('setup');
  const [sel, setSel] = React.useState<Record<string, boolean>>({ okey: true, tavla: true });
  const [when, setWhen] = React.useState<When>('now');
  const [dist, setDist] = React.useState<Dist>('3');
  const [secs, setSecs] = React.useState(TOTAL);

  const chosen = GAMES.filter(([id]) => sel[id]).map(([, l]) => l);

  React.useEffect(() => {
    if (stage !== 'search') return;
    const t = setTimeout(() => { tapSuccess(); setSecs(TOTAL); setStage('found'); }, 2400);
    return () => clearTimeout(t);
  }, [stage]);

  React.useEffect(() => {
    if (stage !== 'found') return;
    const i = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(i);
  }, [stage]);

  React.useEffect(() => {
    if (stage === 'found' && secs <= 0) setStage('search');
  }, [secs, stage]);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 4 }}>
        <NavBack label="Keşfet" onPress={() => navigation.goBack()} />
      </View>

      {stage === 'setup' ? (
        <>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 22 }}>
            <View style={{ gap: 6 }}>
              <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Hızlı Eşleş</T>
              <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Seçimlerine uyan, güven skoru yüksek masaları senin için bulalım.</T>
            </View>
            <View style={{ gap: 10 }}>
              <SectionLabel>Ne oynamak istersin? · {chosen.length} seçili</SectionLabel>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {GAMES.map(([id, label]) => (
                  <Chip key={id} label={label} on={!!sel[id]} onPress={() => setSel((s) => ({ ...s, [id]: !s[id] }))} />
                ))}
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <SectionLabel>Ne zaman?</SectionLabel>
              <Segmented<When> value={when} onChange={setWhen} items={[{ id: 'now', label: 'Şimdi' }, { id: 'tonight', label: 'Bu akşam' }, { id: 'tomorrow', label: 'Yarın' }]} />
            </View>
            <View style={{ gap: 10 }}>
              <SectionLabel>En fazla ne kadar uzakta?</SectionLabel>
              <Segmented<Dist> value={dist} onChange={setDist} items={[{ id: '1', label: '1 km' }, { id: '3', label: '3 km' }, { id: '5', label: '5 km' }, { id: 'any', label: 'Online' }]} />
            </View>
            <View style={styles.note}>
              <Icon name="shield" size={20} color={C.green} />
              <T size={14} color={C.text3} style={{ flex: 1, lineHeight: 20 }}>Sadece güven skoru 85 ve üstü kurucuların masaları önerilir.</T>
            </View>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
            <PrimaryButton title="Eşleşme ara" disabled={chosen.length === 0} onPress={() => setStage('search')} />
          </View>
        </>
      ) : null}

      {stage === 'search' ? (
        <Searching summary={`${chosen.slice(0, 3).join(', ') || 'Oyun'} · ${dist === 'any' ? 'online' : dist + ' km içinde'}`} onCancel={() => setStage('setup')} />
      ) : null}

      {stage === 'found' ? (
        <>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 180, gap: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ gap: 4 }}>
                <T w="s" size={13} color={C.green}>Eşleşme bulundu</T>
                <T w="x" size={30} style={{ letterSpacing: -0.7 }} accessibilityRole="header">Masan hazır</T>
              </View>
              <View accessibilityRole="timer" accessibilityLabel={`Onaylamak için ${secs} saniye`} style={{ width: 64, height: 64 }}>
                <Svg width={64} height={64} viewBox="0 0 64 64" style={{ transform: [{ rotate: '-90deg' }] }}>
                  <Circle cx={32} cy={32} r={26} fill="none" stroke="#E5E5EA" strokeWidth={5} />
                  <Circle cx={32} cy={32} r={26} fill="none" stroke={C.primary} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={`${CIRC}`} strokeDashoffset={CIRC * (1 - secs / TOTAL)} />
                </Svg>
                <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
                  <T w="x" size={17}>{secs}</T>
                </View>
              </View>
            </View>
            <View style={styles.matchCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <GameTile mark="O" bg="#1F8A4C" size={56} />
                <View style={{ gap: 2 }}>
                  <T w="b" size={20}>101 Okey</T>
                  <T size={14} color={C.text2}>Arena Premium Okey · Mevlana · Partner</T>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[['Başlıyor', '21:30'], ['Masa', '3/4'], ['Seviye', 'Orta']].map(([k, v]) => (
                  <View key={k} style={styles.stat}><T size={12} color={C.text2}>{k}</T><T w="b" size={15}>{v}</T></View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  {[['MK', '#FFD8B5'], ['EA', '#CFE3FF'], ['SY', '#D3F0DA']].map(([i, bg], idx) => (
                    <View key={i} style={{ marginLeft: idx ? -8 : 0 }}><Avatar i={i} bg={bg} size={34} border /></View>
                  ))}
                </View>
                <T size={14} color={C.text3} style={{ flex: 1 }}>Ortalama puan 4,8 · Hepsi doğrulanmış</T>
              </View>
              <View style={styles.why}>
                <T size={14} color={C.tintText} style={{ lineHeight: 20 }}>Neden bu masa? Okey seçtin, kampüse 1,5 km ve kurucunun güven skoru 98.</T>
              </View>
            </View>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: insets.bottom + 10, gap: 6 }]}>
            <PrimaryButton title="Masaya otur" onPress={() => navigation.replace('Lobi', { venueId: 'arena', tableId: 't1' })} />
            <Tap onPress={() => setStage('search')} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <T w="s" size={16} color={C.primary}>Başka masa göster</T>
            </Tap>
          </View>
        </>
      ) : null}
    </View>
  );
}

function Searching({ summary, onCancel }: { summary: string; onCancel: () => void }) {
  const a = React.useRef(new Animated.Value(0)).current;
  const b = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    let stopped = false;
    let loops: Animated.CompositeAnimation[] = [];
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (reduce || stopped) return;
      const mk = (v: Animated.Value, delay: number) =>
        Animated.loop(Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]));
      loops = [mk(a, 0), mk(b, 700)];
      loops.forEach((l) => l.start());
    });
    return () => { stopped = true; loops.forEach((l) => l.stop()); };
  }, [a, b]);
  const ring = (v: Animated.Value) => ({
    position: 'absolute' as const, width: 220, height: 220, borderRadius: 110, backgroundColor: C.primary,
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.6] }) }],
  });
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, paddingHorizontal: 32, paddingBottom: 100 }}>
      <View style={{ width: 220, height: 220, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={ring(a)} />
        <Animated.View style={ring(b)} />
        <View style={{ zIndex: 1 }}><Logo size={96} /></View>
      </View>
      <View style={{ alignItems: 'center', gap: 6 }} accessibilityLiveRegion="polite">
        <T w="x" size={24} style={{ letterSpacing: -0.5 }}>Masalar taranıyor…</T>
        <T size={15} color={C.text2} style={{ textAlign: 'center' }}>{summary}</T>
      </View>
      <Tap onPress={onCancel} style={{ height: 44, paddingHorizontal: 22, borderRadius: 999, backgroundColor: '#FFFFFF', justifyContent: 'center' }}>
        <T w="s" size={15}>Vazgeç</T>
      </Tap>
    </View>
  );
}

const styles = StyleSheet.create({
  note: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: 'rgba(242,242,247,0.96)' },
  matchCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, gap: 16 },
  stat: { flex: 1, backgroundColor: C.bg, borderRadius: 12, padding: 10, gap: 2 },
  why: { backgroundColor: C.tint, borderRadius: 12, padding: 12 },
});
