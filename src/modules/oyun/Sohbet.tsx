import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type ScrollViewInstance, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, GameTile, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

type Msg =
  | { id: string; kind: 'sys'; text: string }
  | { id: string; kind: 'other'; i: string; bg: string; name: string; text: string }
  | { id: string; kind: 'mine'; text: string };

const INITIAL: Msg[] = [
  { id: '1', kind: 'sys', text: 'Deniz masaya katıldı' },
  { id: '2', kind: 'other', i: 'MK', bg: '#FFD8B5', name: 'Mehmet K.', text: 'Hoş geldin Deniz! Arena’da girişin solundaki akıllı masadayız.' },
  { id: '3', kind: 'other', i: 'EA', bg: '#CFE3FF', name: 'Elif A.', text: 'Ben 5 dk gecikebilirim, taşları dizin.' },
  { id: '4', kind: 'mine', text: 'Tamamdır, ben de yoldayım.' },
  { id: '5', kind: 'sys', text: 'Mehmet ve Elif check-in yaptı' },
];

const QUICK = ['Yoldayım', '5 dk gecikirim', 'Geldim, neredesiniz?'];

export default function Sohbet({ navigation }: ScreenProps<'Sohbet'>) {
  const insets = useSafeAreaInsets();
  const [msgs, setMsgs] = React.useState<Msg[]>(INITIAL);
  const [checked, setChecked] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const scroll = React.useRef<ScrollViewInstance>(null);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    tapLight();
    setMsgs((m) => [...m, { id: String(Date.now()), kind: 'mine', text: t }]);
    setDraft('');
  };
  const checkIn = () => {
    tapSuccess();
    setChecked(true);
    setMsgs((m) => [...m, { id: 'ci', kind: 'sys', text: 'Deniz check-in yaptı' }]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FFFFFF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Tap accessibilityLabel="Geri" onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Icon name="back" color={C.primary} size={24} strokeWidth={2.6} />
        </Tap>
        <GameTile mark="O" bg="#0C642F" size={38} />
        <View style={{ flex: 1 }}>
          <T w="s" size={16}>101 Okey · Arena</T>
          <T size={13} color={C.text2}>4 kişi · Bugün 21:30</T>
        </View>
        <Tap accessibilityLabel="Masa bilgisi" onPress={() => navigation.navigate('Lobi', { venueId: 'arena', tableId: 't1' })} style={styles.iconBtn}>
          <Icon name="info" color={C.primary} size={22} />
        </Tap>
      </View>

      <View style={{ paddingHorizontal: 14, paddingTop: 10 }}>
        {!checked ? (
          <View style={[styles.banner, { backgroundColor: C.tint }]}>
            <Icon name="pin" color={C.primary} size={22} />
            <View style={{ flex: 1 }}>
              <T w="s" size={15} color={C.tintText}>Masaya vardığında</T>
              <T size={13} color={C.primaryDark}>masadaki QR’ı okut: check-in + ilk çaylar ikram</T>
            </View>
            <Tap haptic="medium" onPress={() => { checkIn(); navigation.navigate('QrCheckin', { venueId: 'arena' }); }} style={styles.bannerBtn}><T w="s" size={14} color="#FFFFFF">QR okut</T></Tap>
          </View>
        ) : (
          <View style={[styles.banner, { backgroundColor: C.greenBg }]} accessibilityLiveRegion="polite">
            <Icon name="checkCircle" color={C.green} size={22} strokeWidth={2.6} />
            <View style={{ flex: 1 }}>
              <T w="s" size={15} color={C.green}>Check-in yapıldı · 21:24</T>
              <T size={13} color={C.green}>6 dk erken geldin. İyi oyunlar!</T>
            </View>
            <Tap onPress={() => navigation.navigate('Degerlendir')} style={{ minHeight: 40, justifyContent: 'center' }}>
              <T w="s" size={14} color={C.green}>Oyun bitti</T>
            </Tap>
          </View>
        )}
      </View>

      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 14, gap: 10 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        keyboardDismissMode="interactive"
      >
        <T w="s" size={12} color={C.text2} style={{ alignSelf: 'center' }}>Bugün 20:52</T>
        {msgs.map((m) => {
          if (m.kind === 'sys') {
            return <View key={m.id} style={styles.sys}><T size={13} color={C.text2}>{m.text}</T></View>;
          }
          if (m.kind === 'mine') {
            return <View key={m.id} style={styles.mine}><T size={16} color="#FFFFFF" style={{ lineHeight: 21 }}>{m.text}</T></View>;
          }
          return (
            <View key={m.id} style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '82%' }}>
              <Avatar i={m.i} bg={m.bg} size={28} />
              <View style={{ gap: 2, flexShrink: 1 }}>
                <T size={12} color={C.text2} style={{ marginLeft: 12 }}>{m.name}</T>
                <View style={styles.other}><T size={16} style={{ lineHeight: 21 }}>{m.text}</T></View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: insets.bottom + 8 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 8 }} keyboardShouldPersistTaps="handled">
          {QUICK.map((q) => (
            <Tap key={q} onPress={() => send(q)} style={styles.quick}><T w="s" size={14}>{q}</T></Tap>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10 }}>
          <Tap accessibilityLabel="Ekle" style={styles.plus}><Icon name="plus" color={C.text3} size={18} strokeWidth={2.6} /></Tap>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Mesaj"
            placeholderTextColor={C.gray}
            accessibilityLabel="Mesaj"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => send(draft)}
          />
          <Tap accessibilityLabel="Gönder" onPress={() => send(draft)} style={[styles.sendBtn, { backgroundColor: draft.trim() ? C.primary : C.border }]}>
            <Icon name="send" color="#FFFFFF" size={18} strokeWidth={2.6} />
          </Tap>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingBottom: 10, backgroundColor: 'rgba(249,249,249,0.98)', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.sep },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  banner: { borderRadius: 16, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  bannerBtn: { height: 36, paddingHorizontal: 14, borderRadius: 10, backgroundColor: C.primary, justifyContent: 'center' },
  sys: { alignSelf: 'center', backgroundColor: C.bg, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  mine: { alignSelf: 'flex-end', maxWidth: '78%', backgroundColor: C.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  other: { backgroundColor: C.bubble, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18 },
  composer: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.sep, backgroundColor: 'rgba(249,249,249,0.98)', paddingTop: 10, gap: 10 },
  quick: { height: 34, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: C.border, backgroundColor: '#FFFFFF', justifyContent: 'center' },
  plus: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bubble, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, fontFamily: F.r, fontSize: 16, color: C.text, backgroundColor: '#FFFFFF' },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
