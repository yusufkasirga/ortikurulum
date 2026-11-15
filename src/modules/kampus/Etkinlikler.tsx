import React from 'react';
import { ScrollView, View } from 'react-native';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { T, Tap, tapSuccess } from '../../components/ui';
import { styles } from './styles';
import { EVENTS } from './data';
import { track } from '../../core/analytics';

export default function Etkinlikler() {
  const [going, setGoing] = React.useState<Record<string, boolean>>({});
  const [buddy, setBuddy] = React.useState<Record<string, boolean>>({});
  const [kind, setKind] = React.useState<string>('Hepsi');
  const kinds = ['Hepsi', 'Turnuva', 'Konser', 'Spor', 'Atölye', 'Kariyer', 'Sosyal'];
  const list = EVENTS.filter((e) => kind === 'Hepsi' || e.kind === kind);
  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {kinds.map((k) => (
          <Tap key={k} haptic="light" onPress={() => setKind(k)} accessibilityState={{ selected: kind === k }} style={[styles.chip, kind === k && { backgroundColor: C.text }]}>
            <T w="b" size={14} color={kind === k ? '#FFF' : C.text}>{k}</T>
          </Tap>
        ))}
      </ScrollView>
      {list.map((e) => {
        const g = !!going[e.id];
        const b = !!buddy[e.id];
        return (
          <View key={e.id} style={styles.event}>
            <View style={[styles.eventHead, { backgroundColor: e.color }]}>
              <View style={styles.eventDeco} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.eventKind}><T w="b" size={11} color={e.color}>{e.kind.toUpperCase()}</T></View>
                <T w="b" size={13} color="#FFF">{e.free ? 'Ücretsiz' : 'Masa ücreti var'}</T>
              </View>
              <T w="x" size={20} color="#FFF" style={{ letterSpacing: -0.4 }}>{e.title}</T>
              <T w="s" size={13} color="#FFFFFF">{e.club}</T>
            </View>
            <View style={{ padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="calendar" size={16} color={C.text3} /><T w="s" size={14}>{e.when}</T>
                <T size={14} color={C.text2}>·</T>
                <Icon name="pin" size={16} color={C.text3} /><T size={14} color={C.text3} numberOfLines={1} style={{ flex: 1 }}>{e.place}</T>
              </View>
              <T size={13} color={C.text2}>{e.going + (g ? 1 : 0)} kişi gidiyor · {e.lookingBuddy + (b ? 1 : 0)} kişi birlikte gidecek arkadaş arıyor</T>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Tap haptic="medium" onPress={() => setGoing((x) => ({ ...x, [e.id]: !g }))} accessibilityState={{ selected: g }} style={[styles.evBtn, { backgroundColor: g ? C.green : C.tint }]}>
                  <T w="s" size={14} color={g ? '#FFF' : C.primary}>{g ? 'Gidiyorsun' : 'Gidiyorum'}</T>
                </Tap>
                <Tap haptic="medium" onPress={() => { tapSuccess(); if (!b) track('etkinlik_birlikte', { etkinlik: e.id }); setBuddy((x) => ({ ...x, [e.id]: !b })); setGoing((x) => ({ ...x, [e.id]: true })); }} accessibilityState={{ selected: b }} style={[styles.evBtn, { flex: 1.3, backgroundColor: b ? C.text : C.sun }]}>
                  <T w="b" size={14} color={b ? '#FFF' : '#241200'}>{b ? 'Eşleşme aranıyor…' : 'Birlikte gidelim'}</T>
                </Tap>
              </View>
            </View>
          </View>
        );
      })}
      <T size={12} color={C.text2} style={{ textAlign: 'center' }}>Etkinlikler örnek; kulüpler kendi panelinden ekleyecek.</T>
    </View>
  );
}
