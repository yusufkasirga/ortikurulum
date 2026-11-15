import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Card, GameTile, NavBack, SectionLabel, Sep, T, Tap } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

export default function Masalarim({ navigation }: ScreenProps<'Masalarim'>) {
  const insets = useSafeAreaInsets();
  const root = navigation;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: 60, gap: 18 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Profil" onPress={() => navigation.goBack()} /></View>
      <T w="x" size={34} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Masalarım</T>

      <View style={{ gap: 8 }}>
        <SectionLabel>Yaklaşan</SectionLabel>
        <Tap onPress={() => root.navigate('Sohbet')} style={styles.upcoming}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <GameTile mark="O" bg="#0C642F" size={52} />
            <View style={{ flex: 1, gap: 2 }}>
              <T w="b" size={18}>101 Okey</T>
              <T size={14} color={C.text2}>Arena Premium Okey · Bugün 21:30</T>
            </View>
            <View style={styles.ok}><T w="s" size={12} color={C.green}>Onaylandı</T></View>
          </View>
          <View style={styles.cta}>
            <Icon name="chat" color={C.primary} size={18} />
            <T w="s" size={15} color={C.primary} style={{ flex: 1 }}>Masa sohbetine git</T>
            <Icon name="chevRight" color={C.primary} size={14} strokeWidth={3} />
          </View>
        </Tap>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Puan bekleyen</SectionLabel>
        <Card>
          <Tap onPress={() => root.navigate('Degerlendir')} style={styles.row}>
            <GameTile mark="K" bg="#7A4100" size={40} />
            <View style={{ flex: 1 }}>
              <T w="s" size={16}>Catan</T>
              <T size={13} color={C.text2}>Latibule Coffee · Dün</T>
            </View>
            <T w="s" size={15} color={C.primary}>Puanla</T>
          </Tap>
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Kurduğum masalar</SectionLabel>
        <Card>
          <View style={styles.row}>
            <GameTile mark="V" bg="#C8243C" size={40} />
            <View style={{ flex: 1 }}>
              <T w="s" size={16}>Valorant · Rekabetçi</T>
              <T size={13} color={C.text2}>Cuma 22:00 · 3/5</T>
            </View>
            <View style={styles.req}><T w="b" size={12} color="#FFFFFF">2 istek</T></View>
          </View>
          <Sep inset={68} />
          <View style={styles.row}>
            <GameTile mark="H" bg="#086363" size={40} />
            <View style={{ flex: 1 }}>
              <T w="s" size={16}>Halı saha · 7v7</T>
              <T size={13} color={C.text2}>Pazar 19:00 · 11/14</T>
            </View>
            <Icon name="chevRight" color={C.chevron} size={14} strokeWidth={3} />
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  upcoming: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, gap: 14 },
  ok: { backgroundColor: C.greenBg, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.tint, borderRadius: 12, paddingHorizontal: 12, height: 44 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  req: { backgroundColor: C.primary, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
});
