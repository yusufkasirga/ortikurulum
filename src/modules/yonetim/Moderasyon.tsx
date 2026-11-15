import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import { Avatar, NavBack, Segmented, T, Tap, tapSuccess } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

/** Moderator queue (role: moderator/admin). Demo data; live: public.reports + public.venue_corrections. */
type Item = { id: string; kind: 'sikayet' | 'telif' | 'duzeltme'; priority: 1 | 2 | 3; title: string; who: string; detail: string; when: string; evidence?: string };

const QUEUE: Item[] = [
  { id: 'r1', kind: 'sikayet', priority: 1, title: 'Taciz veya tehdit', who: 'Kaan D. → Burak T.', detail: 'Masa sonrası sohbette ısrarlı mesaj.', when: '12 dk önce', evidence: '3 mesaj ekli' },
  { id: 'r2', kind: 'sikayet', priority: 2, title: 'Gelmedi', who: 'Elif A. → Serkan Y.', detail: 'Check-in kaydı yok, 2. kez.', when: '1 sa önce', evidence: 'Check-in kaydı doğruluyor' },
  { id: 'r3', kind: 'telif', priority: 2, title: 'Telif bildirimi', who: 'Not: “Anayasa Hukuku — 1. ünite”', detail: 'Ders kitabından sayfa fotoğrafı olabilir.', when: '3 sa önce' },
  { id: 'r4', kind: 'duzeltme', priority: 3, title: 'Mekan bilgisi düzeltmesi', who: 'Arena Premium Okey', detail: 'Sigara: “Sadece açık alan” olarak güncellensin.', when: 'Dün' },
];

const ACTIONS: Record<Item['kind'], string[]> = {
  sikayet: ['Uyar', '24 saat askıya al', 'Hesabı kapat', 'Geçersiz'],
  telif: ['İçeriği kaldır', 'Yerinde kalsın'],
  duzeltme: ['Onayla', 'Reddet'],
};

export default function Moderasyon({ navigation }: ScreenProps<'Moderasyon'>) {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = React.useState<'acik' | 'kapandi'>('acik');
  const [done, setDone] = React.useState<Record<string, string>>({});
  const open = QUEUE.filter((q) => !done[q.id]).sort((a, b) => a.priority - b.priority);
  const closed = QUEUE.filter((q) => done[q.id]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 14 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Ayarlar" onPress={() => navigation.goBack()} /></View>
      <T w="x" size={30} style={{ letterSpacing: -0.7 }} accessibilityRole="header">Moderasyon</T>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Stat n={open.filter((q) => q.priority === 1).length} label="Acil" color={C.red} />
        <Stat n={open.length} label="Açık" color={C.primary} />
        <Stat n={closed.length} label="Bugün kapanan" color={C.green} />
      </View>
      <Segmented value={tab} onChange={setTab} items={[{ id: 'acik', label: `Açık (${open.length})` }, { id: 'kapandi', label: `Kapanan (${closed.length})` }]} />
      {(tab === 'acik' ? open : closed).map((q) => (
        <View key={q.id} style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={[styles.pri, { backgroundColor: q.priority === 1 ? '#FFE3E6' : q.priority === 2 ? C.warnBg : C.tint }]}>
              <T w="b" size={11} color={q.priority === 1 ? C.red : q.priority === 2 ? C.warnText : C.tintText}>{q.priority === 1 ? 'ACİL' : q.priority === 2 ? 'NORMAL' : 'DÜŞÜK'}</T>
            </View>
            <T w="b" size={16} style={{ flex: 1 }}>{q.title}</T>
            <T size={12} color={C.text2}>{q.when}</T>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Avatar i={q.who.slice(0, 2).toUpperCase()} bg="#E2DBFF" size={32} />
            <T w="s" size={14} style={{ flex: 1 }}>{q.who}</T>
          </View>
          <T size={14} color={C.text3} style={{ lineHeight: 20 }}>{q.detail}</T>
          {q.evidence ? <T w="s" size={13} color={C.green}>{q.evidence}</T> : null}
          {done[q.id] ? (
            <T w="b" size={14} color={C.green}>Karar: {done[q.id]}</T>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {ACTIONS[q.kind].map((a, i) => (
                <Tap key={a} haptic="medium" onPress={() => { tapSuccess(); setDone((x) => ({ ...x, [q.id]: a })); }}
                  style={[styles.act, i === ACTIONS[q.kind].length - 2 && q.kind === 'sikayet' ? { backgroundColor: C.red } : i === 0 ? { backgroundColor: C.primary } : { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border }]}>
                  <T w="s" size={13} color={(i === 0 || (i === ACTIONS[q.kind].length - 2 && q.kind === 'sikayet')) ? '#FFFFFF' : C.text}>{a}</T>
                </Tap>
              ))}
            </View>
          )}
        </View>
      ))}
      <T size={12} color={C.text2} style={{ textAlign: 'center' }}>Örnek kayıtlar. Kararlar şikayet edene bildirilir, şikayet edenin kimliği gösterilmez.</T>
    </ScrollView>
  );
}

function Stat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 2 }}>
      <T w="x" size={22} color={color}>{n}</T>
      <T size={12} color={C.text2}>{label}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14, gap: 10 },
  pri: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  act: { height: 36, paddingHorizontal: 12, borderRadius: 10, justifyContent: 'center' },
});
