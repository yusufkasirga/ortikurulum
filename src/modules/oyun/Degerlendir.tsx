import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, Chip, PrimaryButton, Stars, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

const PEOPLE = [
  { id: 'mk', i: 'MK', bg: '#FFD8B5', name: 'Mehmet K.', hint: 'Masanın kurucusu', noShow: false },
  { id: 'ea', i: 'EA', bg: '#CFE3FF', name: 'Elif A.', hint: 'Karşı köşe', noShow: false },
  { id: 'sy', i: 'SY', bg: '#D3F0DA', name: 'Serkan Y.', hint: 'Henüz puanlamadın', noShow: true },
];
const TAGS = ['Centilmen', 'Dakik', 'Eğlenceli', 'İyi oyuncu'];
const WORDS = ['Kötü', 'Zayıf', 'İdare eder', 'İyi', 'Harika'];

export default function Degerlendir({ navigation }: ScreenProps<'Degerlendir'>) {
  const insets = useSafeAreaInsets();
  const [r, setR] = React.useState<Record<string, number>>({ mk: 5, ea: 4 });
  const [tags, setTags] = React.useState<Record<string, Record<string, boolean>>>({ mk: { Centilmen: true, Dakik: true }, ea: { 'Eğlenceli': true } });
  const [again, setAgain] = React.useState<Record<string, boolean>>({ mk: true });
  const [sent, setSent] = React.useState(false);

  const done = PEOPLE.filter((p) => r[p.id]).length;
  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });

  if (sent) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top, paddingBottom: insets.bottom + 20, paddingHorizontal: 20 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }} accessibilityLiveRegion="polite">
          <View style={styles.okCircle}><Icon name="check" color={C.green} size={44} strokeWidth={2.6} /></View>
          <T w="x" size={26} style={{ letterSpacing: -0.5 }}>Teşekkürler!</T>
          <T size={16} color={C.text2} style={{ textAlign: 'center', lineHeight: 23 }}>
            Puanların kaydedildi. {Object.values(again).filter(Boolean).length} kişi “Perşembe Okey Ekibi”ne eklendi; bir sonraki masada önce onlara haber vereceğiz.
          </T>
        </View>
        <PrimaryButton title="Keşfet'e dön" onPress={goHome} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16 }}>
        <Tap onPress={goHome} style={{ minHeight: 44, justifyContent: 'center' }}><T size={17} color={C.primary}>Sonra</T></Tap>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 16 }}>
        <View style={{ gap: 6 }}>
          <T w="s" size={13} color={C.green}>Oyun tamamlandı · 2 sa 10 dk</T>
          <T w="x" size={30} style={{ letterSpacing: -0.7 }} accessibilityRole="header">Masa nasıldı?</T>
        </View>
        <View style={styles.info}>
          <Icon name="lock" color={C.primary} size={18} />
          <T size={14} color={C.text3} style={{ flex: 1, lineHeight: 20 }}>Puanlar gizli. İki taraf da puanlayınca ya da 48 saat sonra görünür.</T>
        </View>

        {PEOPLE.map((p) => {
          const val = r[p.id] ?? 0;
          const sel = tags[p.id] ?? {};
          const fav = !!again[p.id];
          return (
            <View key={p.id} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar i={p.i} bg={p.bg} size={44} />
                <View style={{ flex: 1 }}>
                  <T w="s" size={17}>{p.name}</T>
                  <T size={13} color={C.text2}>{val ? WORDS[val - 1] : p.hint}</T>
                </View>
                <Tap
                  accessibilityLabel={`${p.name} ile tekrar oynarım`}
                  accessibilityState={{ selected: fav }}
                  onPress={() => { tapLight(); setAgain((a) => ({ ...a, [p.id]: !fav })); }}
                  style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="heart" size={23} color={fav ? C.heart : C.gray} fill={fav ? C.heart : 'none'} strokeWidth={2} />
                </Tap>
              </View>
              {p.noShow ? (
                <View style={styles.warn}>
                  <T size={14} color={C.warnText} style={{ flex: 1, lineHeight: 19 }}>{p.name.split(' ')[0]} check-in yapmadı. Masaya gelmedi mi?</T>
                  <Tap onPress={() => navigation.navigate('Sikayet', { name: p.name })} style={{ minHeight: 36, justifyContent: 'center' }}>
                    <T w="s" size={14} color={C.warnText}>Bildir</T>
                  </Tap>
                </View>
              ) : null}
              <Stars value={val} onChange={(n) => setR((x) => ({ ...x, [p.id]: n }))} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {TAGS.map((t) => (
                  <Chip key={t} label={t} on={!!sel[t]} onPress={() => setTags((x) => ({ ...x, [p.id]: { ...sel, [t]: !sel[t] } }))} />
                ))}
              </View>
            </View>
          );
        })}
        <Tap onPress={() => navigation.navigate('Sikayet', {})} style={{ alignSelf: 'center', minHeight: 44, justifyContent: 'center' }}>
          <T w="s" size={15} color={C.red}>Bir sorun mu yaşandı? Şikayet et</T>
        </Tap>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton
          title={done === PEOPLE.length ? 'Puanları gönder' : `Puanları gönder (${done}/${PEOPLE.length})`}
          disabled={done === 0}
          onPress={() => { tapSuccess(); setSent(true); }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, gap: 12 },
  warn: { backgroundColor: C.warnBg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: 'rgba(242,242,247,0.97)' },
  okCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center' },
});
