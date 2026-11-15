import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import Icon from '../components/Icon';
import { Avatar, Card, PrimaryButton, SectionLabel, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../components/ui';
import type { ScreenProps } from '../navigation';

const REASONS = [
  { id: 'noshow', label: 'Gelmedi / son anda iptal etti', sub: 'Masayı eksik bıraktı' },
  { id: 'rude', label: 'Kaba veya saygısız davrandı', sub: 'Hakaret, küfür, aşağılama' },
  { id: 'cheat', label: 'Hile yaptı', sub: 'Kurallara uymadı, hile programı' },
  { id: 'harass', label: 'Taciz veya tehdit', sub: 'Öncelikli incelenir' },
  { id: 'fake', label: 'Sahte profil', sub: 'Fotoğraf ya da bilgiler gerçek değil' },
  { id: 'other', label: 'Diğer', sub: 'Başka bir sorun' },
];

export default function Sikayet({ navigation, route }: ScreenProps<'Sikayet'>) {
  const insets = useSafeAreaInsets();
  const name = route.params?.name ?? 'Serkan Y.';
  const first = name.split(' ')[0];
  const [reason, setReason] = React.useState('noshow');
  const [block, setBlock] = React.useState(false);
  const [detail, setDetail] = React.useState('');
  const [done, setDone] = React.useState(false);
  const top = insets.top > 30 ? 12 : insets.top + 8;

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }} accessibilityLiveRegion="polite">
          <View style={styles.okCircle}><Icon name="check" color={C.green} size={44} strokeWidth={2.6} /></View>
          <T w="x" size={26} style={{ letterSpacing: -0.5 }}>Şikayetin alındı</T>
          <T size={16} color={C.text2} style={{ textAlign: 'center', lineHeight: 23 }}>
            {block ? `${first} engellendi. ` : ''}Ekibimiz durumu inceleyecek ve sonucu sana bildireceğiz. Topluluğu birlikte koruyoruz.
          </T>
        </View>
        <PrimaryButton title="Tamam" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.nav, { paddingTop: top }]}>
        <Tap onPress={() => navigation.goBack()} style={{ minWidth: 80, minHeight: 44, justifyContent: 'center' }}><T size={17} color={C.primary}>Vazgeç</T></Tap>
        <T w="s" size={17} accessibilityRole="header">Şikayet</T>
        <View style={{ minWidth: 80 }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 130, gap: 18 }} keyboardShouldPersistTaps="handled">
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
          <Avatar i={name.split(' ').map((x) => x[0]).join('').slice(0, 2)} bg="#D3F0DA" size={44} />
          <View>
            <T w="s" size={17}>{name}</T>
            <T size={13} color={C.text2}>101 Okey · Moda Kahvesi · Bugün</T>
          </View>
        </Card>

        <View style={{ gap: 8 }} accessibilityRole="radiogroup">
          <SectionLabel>Ne oldu?</SectionLabel>
          <Card>
            {REASONS.map((r, idx) => (
              <View key={r.id}>
                {idx > 0 ? <Sep /> : null}
                <Tap accessibilityRole="radio" accessibilityState={{ checked: reason === r.id }} onPress={() => { tapLight(); setReason(r.id); }} style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <T size={16}>{r.label}</T>
                    <T size={13} color={C.text2}>{r.sub}</T>
                  </View>
                  {reason === r.id ? <Icon name="check" color={C.primary} size={20} strokeWidth={3} /> : null}
                </Tap>
              </View>
            ))}
          </Card>
          {reason === 'noshow' ? (
            <T size={13} color={C.green} style={{ marginHorizontal: 16, lineHeight: 18 }}>Check-in kaydı bunu doğruluyor, ek kanıt gerekmez.</T>
          ) : null}
        </View>

        <Card>
          <View style={{ padding: 16, gap: 6 }}>
            <T w="s" size={13} color={C.text2}>Ayrıntı (isteğe bağlı)</T>
            <TextInput
              value={detail}
              onChangeText={setDetail}
              multiline
              placeholder="Kısaca ne yaşandığını yaz…"
              placeholderTextColor={C.gray}
              accessibilityLabel="Ayrıntı"
              style={{ fontFamily: F.r, fontSize: 16, color: C.text, minHeight: 44, textAlignVertical: 'top', padding: 0 }}
            />
          </View>
          <Sep />
          <Tap style={[styles.row, { gap: 10 }]}>
            <Icon name="image" color={C.primary} size={20} />
            <T size={16} color={C.primary}>Ekran görüntüsü ekle</T>
          </Tap>
        </Card>

        <Card style={[styles.row, { paddingVertical: 12 }]}>
          <View style={{ flex: 1 }}>
            <T size={16}>Bu kişiyi engelle</T>
            <T size={13} color={C.text2}>Birbirinizin masalarını görmezsiniz</T>
          </View>
          <Toggle value={block} onChange={setBlock} label="Bu kişiyi engelle" />
        </Card>
        <T size={13} color={C.text2} style={{ marginHorizontal: 16, lineHeight: 18 }}>
          Şikayeti kimin yaptığı karşı tarafa gösterilmez. Acil bir tehlike varsa önce 112'yi ara.
        </T>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <PrimaryButton title="Şikayeti gönder" color={C.red} onPress={() => { tapSuccess(); setDone(true); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 50 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: 'rgba(242,242,247,0.97)' },
  okCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center' },
});
