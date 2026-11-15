import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../../core/theme';
import Icon from '../../components/Icon';
import { NavBack, PrimaryButton, SectionLabel, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import { CAMPUSES, OTHER_CITIES } from '../kampus/campuses';
import { useSession } from '../../core/store';
import { isLive, sendOtp, sendStudentMail, verifyOtp } from '../../core/backend';
import { registerPushToken, requestPermission, setupAndroidChannel } from '../../core/notifications';
import { track } from '../../core/analytics';
import type { ScreenProps } from '../../core/navigation';

type Step = 'kampus' | 'telefon' | 'kod' | 'eposta' | 'izin';

export default function Kayit({ navigation, route }: ScreenProps<'Kayit'>) {
  const insets = useSafeAreaInsets();
  const { set } = useSession();
  const viaApple = route.params?.method === 'apple';
  const onlyMail = route.params?.only === 'eposta';
  const session = useSession();
  const steps: Step[] = onlyMail ? ['eposta'] : viaApple ? ['kampus', 'eposta', 'izin'] : ['kampus', 'telefon', 'kod', 'eposta', 'izin'];
  const [i, setI] = React.useState(0);
  const step = steps[i];
  const [campus, setCampus] = React.useState(onlyMail ? session.campusId : 'eru');
  const [waitlisted, setWaitlisted] = React.useState<string | undefined>();
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');
  const [mail, setMail] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | undefined>();

  const c = CAMPUSES.find((x) => x.id === campus)!;
  const phoneDigits = phone.replace(/\D/g, '');
  const phoneOk = /^5\d{9}$/.test(phoneDigits);
  const mailOk = new RegExp(`^[^@\\s]+@${c.domain.replace('.', '\\.')}$`, 'i').test(mail.trim());

  const next = () => { setErr(undefined); tapLight(); setI((x) => Math.min(x + 1, steps.length - 1)); };
  const finish = async (allowNotif: boolean) => {
    if (allowNotif) { await setupAndroidChannel(); const ok = await requestPermission(); if (ok) registerPushToken(); }
    set({ onboarded: true, campusId: campus, phone: phoneDigits || undefined, studentEmail: mailOk ? mail.trim() : undefined });
    track('onboarding_tamam', { kampus: campus, apple: viaApple, ogrenci_maili: mailOk });
    tapSuccess();
    navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  const onPrimary = async () => {
    setErr(undefined);
    if (step === 'kampus') { track('kampus_secildi', { kampus: campus }); next(); return; }
    if (step === 'telefon') {
      setBusy(true); const r = await sendOtp(`+90${phoneDigits}`); setBusy(false);
      if (r.ok) next(); else setErr('Kod gönderilemedi. Numarayı kontrol edip tekrar dene.');
      return;
    }
    if (step === 'kod') {
      setBusy(true); const r = await verifyOtp(`+90${phoneDigits}`, code); setBusy(false);
      if (r.ok) next(); else setErr('Kod hatalı ya da süresi doldu.');
      return;
    }
    if (step === 'eposta') {
      setBusy(true); const r = await sendStudentMail(mail.trim()); setBusy(false);
      if (!r.ok) { setErr('E-posta gönderilemedi.'); return; }
      if (onlyMail) { session.set({ studentEmail: mail.trim() }); tapSuccess(); navigation.goBack(); return; }
      next();
    }
  };

  const primaryTitle = step === 'kampus' ? 'Devam' : step === 'telefon' ? 'Kod gönder' : step === 'kod' ? 'Doğrula' : 'Doğrulama bağlantısı gönder';
  const primaryDisabled = busy || (step === 'kampus' && !c.active) || (step === 'telefon' && !phoneOk) || (step === 'kod' && code.length !== 6) || (step === 'eposta' && !mailOk);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FFFFFF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.top, { paddingTop: insets.top + 4 }]}>
        <NavBack label={i === 0 ? 'Geri' : 'Önceki'} onPress={() => (i === 0 ? navigation.goBack() : setI(i - 1))} />
        <View style={styles.progress}>
          {steps.map((s, k) => <View key={s} style={[styles.bar, { backgroundColor: k <= i ? C.primary : C.fill }]} />)}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 8, gap: 18, paddingBottom: 140 }} keyboardShouldPersistTaps="handled">
        {step === 'kampus' ? (
          <>
            <T w="x" size={30} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Hangi kampüstesin?</T>
            <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Masalar, notlar ve etkinlikler kampüsüne göre gelir.</T>
            <SectionLabel>Kayseri</SectionLabel>
            <View style={{ gap: 10 }}>
              {CAMPUSES.map((x) => {
                const on = x.id === campus;
                return (
                  <Tap key={x.id} onPress={() => { tapLight(); setCampus(x.id); }} accessibilityRole="radio" accessibilityState={{ checked: on }}
                    style={[styles.campus, on && { borderColor: C.primary, backgroundColor: C.tint }]}>
                    <View style={[styles.campusBadge, { backgroundColor: x.active ? C.primary : C.fill }]}><T w="x" size={13} color={x.active ? '#FFFFFF' : C.text2}>{x.short}</T></View>
                    <View style={{ flex: 1 }}>
                      <T w="s" size={16}>{x.name}</T>
                      <T size={13} color={x.active ? C.green : C.text2}>{x.active ? 'Pilot aktif · Talas' : 'Yakında'}</T>
                    </View>
                    {on ? <Icon name="check" size={20} color={C.primary} strokeWidth={3} /> : null}
                  </Tap>
                );
              })}
            </View>
            {!c.active ? (
              <View style={styles.wait}>
                <T w="b" size={15} color={C.tintText}>{c.short} için bekleme listesi</T>
                <T size={14} color={C.tintText} style={{ lineHeight: 19 }}>Kampüsünden yeterli kişi katılınca açılır. Seni listeye ekleyelim, ilk haber verilenlerden ol.</T>
                <Tap haptic="medium" onPress={() => setWaitlisted(c.id)} disabled={waitlisted === c.id} style={styles.waitBtn}>
                  <T w="b" size={14} color="#FFFFFF">{waitlisted === c.id ? 'Listeye eklendin' : 'Bekleme listesine katıl'}</T>
                </Tap>
              </View>
            ) : null}
            <SectionLabel>Diğer şehirler · yakında</SectionLabel>
            <T size={14} color={C.text2}>{OTHER_CITIES.join(' · ')}</T>
          </>
        ) : null}

        {step === 'telefon' ? (
          <>
            <T w="x" size={30} style={{ letterSpacing: -0.8 }}>Telefon numaran</T>
            <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Sahte hesapları engellemek için SMS ile doğruluyoruz. Numaran kimseye gösterilmez.</T>
            <View style={styles.inputRow}>
              <T w="s" size={18} color={C.text2}>+90</T>
              <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="5XX XXX XX XX" placeholderTextColor={C.text2}
                maxLength={14} accessibilityLabel="Telefon numarası" style={styles.input} autoFocus />
            </View>
          </>
        ) : null}

        {step === 'kod' ? (
          <>
            <T w="x" size={30} style={{ letterSpacing: -0.8 }}>Kodu gir</T>
            <T size={15} color={C.text2} style={{ lineHeight: 21 }}>+90 {phoneDigits} numarasına 6 haneli kod gönderdik.{isLive ? '' : ' (Demo: herhangi 6 rakam)'}</T>
            <TextInput value={code} onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" textContentType="oneTimeCode"
              autoComplete="sms-otp" placeholder="••••••" placeholderTextColor={C.text2} accessibilityLabel="Doğrulama kodu" style={[styles.input, styles.code]} autoFocus />
          </>
        ) : null}

        {step === 'eposta' ? (
          <>
            <T w="x" size={30} style={{ letterSpacing: -0.8 }}>Öğrenci e-postan</T>
            <T size={15} color={C.text2} style={{ lineHeight: 21 }}>@{c.domain} adresine bir bağlantı göndereceğiz. Öğrenci rozeti ve kampüs masaları için gerekli.</T>
            <View style={styles.inputRow}>
              <Icon name="cap" size={20} color={C.text2} />
              <TextInput value={mail} onChangeText={setMail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                placeholder={`ad.soyad@${c.domain}`} placeholderTextColor={C.text2} accessibilityLabel="Öğrenci e-postası" style={styles.input} />
            </View>
            <Tap onPress={onlyMail ? () => navigation.goBack() : next} style={{ alignSelf: 'flex-start', minHeight: 40, justifyContent: 'center' }}>
              <T w="s" size={15} color={C.primary}>{onlyMail ? "Vazgeç" : "Şimdilik atla"}</T>
            </Tap>
          </>
        ) : null}

        {step === 'izin' ? (
          <>
            <View style={styles.bell}><Icon name="bell" size={36} color={C.primary} /></View>
            <T w="x" size={30} style={{ letterSpacing: -0.8 }}>Masan dolunca haber verelim</T>
            <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Onaylandığında, boş saatinde yakında masa açıldığında ve ekibin seni çağırdığında bildirim gelir. Hangilerini alacağını Ayarlar’dan seçersin.</T>
          </>
        ) : null}

        {err ? <T w="s" size={14} color={C.red}>{err}</T> : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        {step === 'izin' ? (
          <>
            <PrimaryButton title="Bildirimlere izin ver" onPress={() => finish(true)} />
            <Tap onPress={() => finish(false)} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}><T w="s" size={15} color={C.text2}>Şimdi değil</T></Tap>
          </>
        ) : (
          <PrimaryButton title={busy ? 'Bekle…' : primaryTitle} disabled={primaryDisabled} onPress={onPrimary} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingBottom: 6 },
  progress: { flex: 1, flexDirection: 'row', gap: 6, paddingRight: 12 },
  bar: { flex: 1, height: 5, borderRadius: 3 },
  campus: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 2, borderColor: C.fill, backgroundColor: '#FFFFFF' },
  campusBadge: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  wait: { backgroundColor: C.tint, borderRadius: 16, padding: 14, gap: 8 },
  waitBtn: { alignSelf: 'flex-start', backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 14, height: 40, justifyContent: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, backgroundColor: C.bg, paddingHorizontal: 16, height: 58 },
  input: { flex: 1, fontFamily: F.s, fontSize: 18, color: C.text },
  code: { flex: 0, height: 64, borderRadius: 14, backgroundColor: C.bg, textAlign: 'center', letterSpacing: 12, fontSize: 28 },
  bell: { width: 84, height: 84, borderRadius: 26, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 12, backgroundColor: '#FFFFFF', gap: 4 },
});
