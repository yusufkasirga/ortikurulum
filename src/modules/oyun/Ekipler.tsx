import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, NavBack, T, Tap, tapSuccess } from '../../components/ui';
import { TEAMS } from './teams';
import type { ScreenProps } from '../../core/navigation';

export default function Ekipler({ navigation }: ScreenProps<'Ekipler'>) {
  const insets = useSafeAreaInsets();
  const [pinged, setPinged] = React.useState<Record<string, boolean>>({});
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 16 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Geri" onPress={() => navigation.goBack()} /></View>
      <View style={{ gap: 6 }}>
        <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Ekiplerim</T>
        <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Oyun sonunda “tekrar oynarım” dediğin kişiler ekibine dönüşür. Yeni masa açınca önce ekibine haber gider.</T>
      </View>

      {TEAMS.map((t) => (
        <View key={t.id} style={styles.card}>
          <View style={[styles.head, { backgroundColor: t.color }]}>
            <View style={styles.deco} />
            <T w="x" size={20} color="#FFF" style={{ letterSpacing: -0.4 }}>{t.name}</T>
            <T w="s" size={13} color="#FFFFFF">{t.game} · {t.usual}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              {t.members.map((m, i) => (
                <View key={m.name} style={{ marginLeft: i ? -10 : 0 }}><Avatar i={m.i} bg={m.bg} size={38} border /></View>
              ))}
              <T w="s" size={13} color="#FFF" style={{ marginLeft: 10 }}>{t.members.length} kişi · {t.played} oyun birlikte</T>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
            <Tap haptic="medium" onPress={() => { tapSuccess(); setPinged((x) => ({ ...x, [t.id]: true })); }} disabled={pinged[t.id]}
              style={[styles.btn, { flex: 1.4, backgroundColor: pinged[t.id] ? C.greenBg : C.sun }]}>
              <T w="b" size={14} color={pinged[t.id] ? C.green : '#241200'}>{pinged[t.id] ? 'Ekibe haber verildi' : 'Bu akşam var mısınız?'}</T>
            </Tap>
            <Tap onPress={() => navigation.navigate('Olustur', { venueId: t.venueId, audience: 'karma' })} style={[styles.btn, { flex: 1, backgroundColor: C.tint }]}>
              <T w="b" size={14} color={C.primary}>Masa aç</T>
            </Tap>
          </View>
        </View>
      ))}

      <View style={styles.tip}>
        <Icon name="heart" size={20} color={C.heart} fill={C.heart} />
        <T size={13} color={C.text3} style={{ flex: 1, lineHeight: 18 }}>Yeni ekip kurmak için oyun sonu puanlamada oyuncuların yanındaki kalbe dokun.</T>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden' },
  head: { padding: 16, gap: 4, overflow: 'hidden' },
  deco: { position: 'absolute', width: 150, height: 150, borderRadius: 75, right: -40, top: -60, backgroundColor: 'rgba(255,255,255,0.15)' },
  btn: { height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF', borderRadius: 16, padding: 14 },
});
