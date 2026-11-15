import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { C } from '../theme';
import Icon from '../components/Icon';
import { Avatar, Card, GameTile, Segmented, Sep, T, Tap } from '../components/ui';
import { RECENT_GAMES } from '../data';
import { useSession } from '../store';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { TabParams } from '../navigation';

const PRAISE = [
  { label: 'Centilmen', count: 41 },
  { label: 'Dakik', count: 33 },
  { label: 'Eğlenceli', count: 28 },
  { label: 'İyi oyuncu', count: 19 },
];
const TRUST = 96;
const CIRC = 2 * Math.PI * 34;

export default function Profil({ navigation }: BottomTabScreenProps<TabParams, 'Profil'>) {
  const insets = useSafeAreaInsets();
  const { verification } = useSession();
  const root = navigation.getParent();
  const [tab, setTab] = React.useState<'praise' | 'games'>('praise');
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 120, gap: 18 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <T w="x" size={34} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Profil</T>
        <Tap style={{ minHeight: 44, justifyContent: 'center' }}><T size={17} color={C.primary}>Düzenle</T></Tap>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Avatar i="DA" bg={C.tint2} size={80} />
        <View style={{ gap: 4, flex: 1 }}>
          <T w="x" size={24} style={{ letterSpacing: -0.5 }}>Deniz Aydın</T>
          <T size={15} color={C.text2}>ERÜ · Talas · 2025'ten beri</T>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="star" size={15} color={C.orange} fill={C.orange} strokeWidth={1} />
            <T w="s" size={15}>4,8</T>
            <T size={15} color={C.text2}>· 126 değerlendirme</T>
          </View>
        </View>
      </View>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 20 }}>
        <View style={{ width: 84, height: 84 }} accessibilityLabel={`Güven skoru ${TRUST} / 100`} accessible>
          <Svg width={84} height={84} viewBox="0 0 84 84" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx={42} cy={42} r={34} fill="none" stroke="#E5E5EA" strokeWidth={8} />
            <Circle cx={42} cy={42} r={34} fill="none" stroke={C.greenDot} strokeWidth={8} strokeLinecap="round"
              strokeDasharray={`${CIRC}`} strokeDashoffset={CIRC * (1 - TRUST / 100)} />
          </Svg>
          <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
            <T w="x" size={24}>{TRUST}</T>
            <T size={11} color={C.text2}>/100</T>
          </View>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <T w="b" size={17}>Güven skoru · Çok yüksek</T>
          <T size={14} color={C.text2} style={{ lineHeight: 19 }}>Check-in, dakiklik ve şikayet geçmişinden hesaplanır. Son 30 günde iptal yok.</T>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        {[['87', 'Oyun'], ['%98', 'Geldi'], ['34', 'Oyun arkadaşı']].map(([v, k]) => (
          <View key={k} style={styles.stat}><T w="x" size={22}>{v}</T><T size={12} color={C.text2}>{k}</T></View>
        ))}
      </View>

      <Card>
        <View style={styles.row}>
          <T size={16} style={{ flex: 1 }}>Telefon</T>
          <T w="s" size={15} color={C.green}>Doğrulandı</T>
        </View>
        <Sep />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <T size={16}>Öğrenci e-postası</T>
            <T size={13} color={C.text2}>…@erciyes.edu.tr</T>
          </View>
          <T w="s" size={15} color={C.green}>Doğrulandı</T>
        </View>
        <Sep />
        <Tap onPress={() => root?.navigate('Dogrulama')} disabled={verification.status === 'verified'} style={styles.row}>
          <View style={{ flex: 1 }}>
            <T size={16}>Kimlik doğrulama</T>
            <T size={13} color={C.text2}>Kadın / erkek masaları için gerekli</T>
          </View>
          {verification.status === 'verified'
            ? <T w="s" size={15} color={C.green}>Doğrulandı · {verification.gender === 'kadin' ? 'Kadın' : 'Erkek'}</T>
            : <T w="s" size={15} color={C.primary}>Doğrula</T>}
        </Tap>
      </Card>

      <Card>
        <Tap onPress={() => root?.navigate('Masalarim')} style={styles.row}>
          <Icon name="table" size={20} color={C.primary} />
          <T size={16} style={{ flex: 1 }}>Masalarım</T>
          <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
        </Tap>
      </Card>

      <Segmented value={tab} onChange={setTab} items={[{ id: 'praise', label: 'En çok övülen' }, { id: 'games', label: 'Son oyunlar' }]} />

      {tab === 'praise' ? (
        <Card style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
          {PRAISE.map((p) => (
            <View key={p.label} style={{ paddingVertical: 10, gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T w="s" size={15}>{p.label}</T>
                <T size={15} color={C.text2}>{p.count}</T>
              </View>
              <View style={styles.barBg}><View style={[styles.bar, { width: `${Math.round((p.count / PRAISE[0].count) * 100)}%` }]} /></View>
            </View>
          ))}
        </Card>
      ) : (
        <Card>
          {RECENT_GAMES.map((g, idx) => (
            <View key={g.name}>
              {idx > 0 ? <Sep inset={68} /> : null}
              <View style={styles.row}>
                <GameTile mark={g.mark} bg={g.bg} size={40} />
                <View style={{ flex: 1 }}>
                  <T w="s" size={16}>{g.name}</T>
                  <T size={13} color={C.text2}>{g.meta}</T>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Icon name="star" size={13} color={C.orange} fill={C.orange} strokeWidth={1} />
                  <T w="s" size={14}>{g.score}</T>
                </View>
              </View>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stat: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 48 },
  barBg: { height: 6, borderRadius: 3, backgroundColor: '#E5E5EA', overflow: 'hidden' },
  bar: { height: 6, borderRadius: 3, backgroundColor: C.primary },
});
