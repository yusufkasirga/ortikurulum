import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../../core/theme';
import { Card, NavBack, SectionLabel, Sep, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import { EVENTS } from '../kampus/data';
import type { ScreenProps } from '../../core/navigation';

/** Club admin panel (role: club_admin). Live: public.events + event_rsvps. */
const KINDS = ['Turnuva', 'Konser', 'Spor', 'Atölye', 'Kariyer', 'Sosyal'];

export default function KulupPaneli({ navigation }: ScreenProps<'KulupPaneli'>) {
  const insets = useSafeAreaInsets();
  const mine = EVENTS.filter((e) => e.club === 'Bilgisayar Topluluğu' || e.club === 'Oyun Kulübü');
  const [title, setTitle] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [when, setWhen] = React.useState('');
  const [kind, setKind] = React.useState('Atölye');
  const [sent, setSent] = React.useState(false);
  const ok = title.trim().length > 3 && place.trim().length > 2 && when.trim().length > 2;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 16 }} keyboardShouldPersistTaps="handled">
      <View style={{ marginLeft: -8 }}><NavBack label="Ayarlar" onPress={() => navigation.goBack()} /></View>
      <View>
        <T w="s" size={13} color={C.text2}>Kulüp paneli</T>
        <T w="x" size={28} style={{ letterSpacing: -0.6 }} accessibilityRole="header">Bilgisayar Topluluğu</T>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Etkinliklerin</SectionLabel>
        <Card>
          {mine.map((e, i) => (
            <View key={e.id}>
              {i > 0 ? <Sep /> : null}
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: e.color }]} />
                <View style={{ flex: 1 }}>
                  <T w="s" size={15}>{e.title}</T>
                  <T size={13} color={C.text2}>{e.when} · {e.going} gidiyor · {e.lookingBuddy} eş arıyor</T>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Yeni etkinlik</SectionLabel>
        <Card style={{ padding: 14, gap: 10 }}>
          <Field label="Başlık" value={title} onChange={setTitle} placeholder="Örn. Python atölyesi" />
          <Field label="Yer" value={place} onChange={setPlace} placeholder="Örn. Mühendislik B-204" />
          <Field label="Zaman" value={when} onChange={setWhen} placeholder="Örn. 4 Aralık 18:00" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {KINDS.map((k) => (
              <Tap key={k} onPress={() => { tapLight(); setKind(k); }} accessibilityState={{ selected: kind === k }} style={[styles.chip, kind === k && { backgroundColor: C.text }]}>
                <T w="b" size={13} color={kind === k ? '#FFFFFF' : C.text}>{k}</T>
              </Tap>
            ))}
          </View>
        </Card>
      </View>
      <Tap haptic="medium" disabled={!ok || sent} onPress={() => { tapSuccess(); setSent(true); }}
        style={[styles.save, { backgroundColor: sent ? C.green : ok ? C.primary : C.border }]}>
        <T w="b" size={17} color={sent || ok ? '#FFFFFF' : C.text3}>{sent ? 'Gönderildi · moderasyon sonrası yayında' : 'Etkinliği yayınla'}</T>
      </Tap>
    </ScrollView>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (t: string) => void; placeholder: string }) {
  return (
    <View style={{ gap: 4 }}>
      <T w="s" size={13} color={C.text2}>{label}</T>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={C.text2} accessibilityLabel={label}
        style={{ fontFamily: F.r, fontSize: 16, color: C.text, backgroundColor: C.bg, borderRadius: 10, paddingHorizontal: 12, height: 44 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, backgroundColor: C.bg, justifyContent: 'center' },
  save: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
