import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import { Card, GameTile, NavBack, Sep, T, Tap } from '../components/ui';
import type { ScreenProps } from '../navigation';

const CHATS = [
  { id: 'okey', mark: 'O', bg: '#1F8A4C', title: '101 Okey · Arena', last: 'Elif: Ben 5 dk gecikebilirim, taşları dizin.', time: '20:58', unread: 2 },
  { id: 'val', mark: 'V', bg: '#C8243C', title: 'Valorant · Rekabetçi', last: 'Burak: Cuma 22:00 herkes uygun mu?', time: 'Dün', unread: 0 },
  { id: 'saha', mark: 'H', bg: '#C25E00', title: 'Halı saha · 7v7', last: 'Ali: Gezegen’de yarın 20:00, kaleci lazım', time: 'Pzt', unread: 0 },
];

export default function Sohbetler({ navigation }: ScreenProps<'Sohbetler'>) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: 60, gap: 18 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Keşfet" onPress={() => navigation.goBack()} /></View>
      <T w="x" size={34} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Sohbet</T>
      <Card>
        {CHATS.map((c, idx) => (
          <View key={c.id}>
            {idx > 0 ? <Sep inset={78} /> : null}
            <Tap onPress={() => navigation.navigate('Sohbet')} style={styles.row}>
              <GameTile mark={c.mark} bg={c.bg} size={50} />
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <T w="s" size={16}>{c.title}</T>
                  <T size={13} color={C.text2}>{c.time}</T>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <T size={14} color={C.text2} numberOfLines={1} style={{ flex: 1 }}>{c.last}</T>
                  {c.unread ? <View style={styles.badge}><T w="b" size={12} color="#FFFFFF">{c.unread}</T></View> : null}
                </View>
              </View>
            </Tap>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
});
