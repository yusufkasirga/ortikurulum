import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import Icon, { IconName } from '../components/Icon';
import { Card, PrimaryButton, SectionLabel, Segmented, Sep, T, Tap, tapLight, tapSuccess } from '../components/ui';
import { Gender, useSession } from '../store';
import type { ScreenProps } from '../navigation';

type Step = 'intro' | 'id' | 'selfie' | 'checking' | 'done';

/**
 * Identity verification for gender-restricted tables.
 * Prototype UI: capture steps are simulated. In production the capture runs inside a licensed
 * KYC provider's SDK (ID chip/NFC + liveness); Orti receives only {verified, gender, adult}.
 */
export default function Dogrulama({ navigation, route }: ScreenProps<'Dogrulama'>) {
  const insets = useSafeAreaInsets();
  const { setVerification } = useSession();
  const [step, setStep] = React.useState<Step>('intro');
  const [gender, setGender] = React.useState<Gender>('kadin');
  const [consent, setConsent] = React.useState(false);
  const [readNotice, setReadNotice] = React.useState(false);
  const top = insets.top > 30 ? 12 : insets.top + 8;

  React.useEffect(() => {
    if (step !== 'checking') return;
    const t = setTimeout(() => {
      tapSuccess();
      setVerification({ status: 'verified', gender, verifiedAt: new Date().toISOString() });
      setStep('done');
    }, 2200);
    return () => clearTimeout(t);
  }, [step, gender, setVerification]);

  const finish = () => {
    navigation.goBack();
    if (route.params?.then === 'olustur') navigation.navigate('Olustur', { venueId: route.params?.venueId, audience: 'kadin' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={[styles.nav, { paddingTop: top }]}>
        <Tap onPress={() => navigation.goBack()} style={{ minWidth: 80, minHeight: 44, justifyContent: 'center' }}><T size={17} color={C.primary}>Kapat</T></Tap>
        <T w="s" size={17} accessibilityRole="header">Kimlik doğrulama</T>
        <View style={{ minWidth: 80 }} />
      </View>

      {step === 'intro' ? (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 140, gap: 18 }}>
            <View style={styles.hero}>
              <View style={styles.heroIcon}><Icon name="shield" size={34} color={C.primary} /></View>
              <T w="x" size={24} style={{ textAlign: 'center', letterSpacing: -0.5 }}>Kadın masalarına katılmak ve açmak için</T>
              <T size={15} color={C.text2} style={{ textAlign: 'center', lineHeight: 21 }}>
                Kadın masalarında herkesin gerçekten kadın olduğunu bilmek için kimliğini bir kez doğruluyoruz. Diğer masalar için doğrulama gerekmez.
              </T>
            </View>

            <View style={{ gap: 8 }}>
              <SectionLabel>Ne saklıyoruz, ne saklamıyoruz</SectionLabel>
              <Card>
                <Row icon="check" good title="Saklanan" sub="Sadece “doğrulandı · kadın/erkek · 18 yaş üstü” bilgisi" />
                <Sep inset={52} />
                <Row icon="close" title="Saklanmayan" sub="Kimlik fotoğrafı, selfie, TC kimlik no — doğrulamadan hemen sonra silinir" />
                <Sep inset={52} />
                <Row icon="lock" title="Kim görür" sub="Kimse. Profilinde sadece “Doğrulanmış” rozeti görünür" />
              </Card>
            </View>

            <View style={{ gap: 8 }}>
              <SectionLabel>Kimlikteki cinsiyet</SectionLabel>
              <Segmented<Gender> value={gender} onChange={setGender} items={[{ id: 'kadin', label: 'Kadın' }, { id: 'erkek', label: 'Erkek' }]} />
              <T size={12} color={C.text2} style={{ marginHorizontal: 4 }}>Prototipte seçiliyor; gerçek sürümde kimlik çipinden okunur.</T>
            </View>

            <Card>
              <Check on={readNotice} onPress={() => setReadNotice((x) => !x)} text="Aydınlatma Metni'ni okudum." />
              <Sep inset={52} />
              <Check on={consent} onPress={() => setConsent((x) => !x)} text="Kimlik doğrulaması için yüz görüntümün kimlik fotoğrafımla karşılaştırılmasına açık rıza veriyorum." />
            </Card>
            <T size={12} color={C.text2} style={{ marginHorizontal: 4, lineHeight: 17 }}>
              Rıza vermek zorunda değilsin; vermezsen karma ve erkek masalarını kullanmaya devam edersin. Rızanı Ayarlar'dan istediğin zaman geri çekebilirsin.
            </T>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
            <PrimaryButton title="Başla" disabled={!consent || !readNotice} onPress={() => setStep('id')} />
          </View>
        </>
      ) : null}

      {step === 'id' || step === 'selfie' ? (
        <View style={{ flex: 1, padding: 20, gap: 20 }}>
          <T w="s" size={13} color={C.text2}>Adım {step === 'id' ? '1' : '2'} / 2</T>
          <T w="x" size={26} style={{ letterSpacing: -0.5 }}>{step === 'id' ? 'Kimliğinin ön yüzü' : 'Kısa bir selfie'}</T>
          <T size={15} color={C.text2} style={{ lineHeight: 21 }}>
            {step === 'id' ? 'T.C. kimlik kartını düz bir zemine koy, dört köşesi çerçevede görünsün. Parlama olmasın.' : 'Yüzünü çerçeveye yerleştir, istendiğinde başını yavaşça sağa çevir.'}
          </T>
          <View style={[styles.frame, step === 'selfie' && { borderRadius: 160, alignSelf: 'center', width: 260, height: 320 }]}>
            <Icon name={step === 'id' ? 'image' : 'person'} size={56} color="rgba(255,255,255,0.7)" />
            <T size={13} color="rgba(255,255,255,0.8)">Kamera önizlemesi (prototip)</T>
          </View>
          <View style={{ flex: 1 }} />
          <PrimaryButton title={step === 'id' ? 'Fotoğrafı çek' : 'Selfie çek'} onPress={() => { tapLight(); setStep(step === 'id' ? 'selfie' : 'checking'); }} />
        </View>
      ) : null}

      {step === 'checking' ? (
        <View style={styles.center} accessibilityLiveRegion="polite">
          <View style={styles.heroIcon}><Icon name="shield" size={34} color={C.primary} /></View>
          <T w="x" size={22}>Doğrulanıyor…</T>
          <T size={15} color={C.text2} style={{ textAlign: 'center' }}>Genelde 1 dakikadan kısa sürer.</T>
        </View>
      ) : null}

      {step === 'done' ? (
        <View style={[styles.center, { paddingBottom: insets.bottom + 20 }]} accessibilityLiveRegion="polite">
          <View style={[styles.heroIcon, { backgroundColor: C.greenBg }]}><Icon name="check" size={40} color={C.green} strokeWidth={2.6} /></View>
          <T w="x" size={24}>Doğrulandın</T>
          <T size={15} color={C.text2} style={{ textAlign: 'center', lineHeight: 21 }}>
            Kimlik fotoğrafın ve selfie'n silindi. Profilinde artık “Doğrulanmış” rozeti var{gender === 'kadin' ? ' ve kadın masalarını görebilirsin' : ''}.
          </T>
          <View style={{ alignSelf: 'stretch', marginTop: 12 }}><PrimaryButton title="Devam" onPress={finish} /></View>
        </View>
      ) : null}
    </View>
  );
}

function Row({ icon, title, sub, good }: { icon: IconName; title: string; sub: string; good?: boolean }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={20} color={good ? C.green : C.text3} strokeWidth={2.6} />
      <View style={{ flex: 1 }}>
        <T w="s" size={15}>{title}</T>
        <T size={13} color={C.text2} style={{ lineHeight: 18 }}>{sub}</T>
      </View>
    </View>
  );
}

function Check({ on, onPress, text }: { on: boolean; onPress: () => void; text: string }) {
  return (
    <Tap accessibilityRole="checkbox" accessibilityState={{ checked: on }} onPress={() => { tapLight(); onPress(); }} style={[styles.row, { alignItems: 'flex-start' }]}>
      <View style={[styles.box, on && { backgroundColor: C.primary, borderColor: C.primary }]}>
        {on ? <Icon name="check" size={14} color="#FFF" strokeWidth={3} /> : null}
      </View>
      <T size={14} style={{ flex: 1, lineHeight: 20 }}>{text}</T>
    </Tap>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 6 },
  hero: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  heroIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12 },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 14, backgroundColor: 'rgba(242,242,247,0.97)' },
  frame: { height: 220, borderRadius: 20, backgroundColor: '#2C2C2E', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', borderStyle: 'dashed' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 32 },
});
