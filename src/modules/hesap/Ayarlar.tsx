import React from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { C } from '../../core/theme';
import Icon, { IconName } from '../../components/Icon';
import { Card, NavBack, SectionLabel, Segmented, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../../components/ui';
import { LocationPrecision, Visibility, useSession } from '../../core/store';
import { NOTIF_LABELS, NotifKey, requestPermission } from '../../core/notifications';
import { deleteAccount, isLive, signOut } from '../../core/backend';
import { recentEvents, track } from '../../core/analytics';
import { campusById } from '../kampus/campuses';
import type { ScreenProps } from '../../core/navigation';

export default function Ayarlar({ navigation }: ScreenProps<'Ayarlar'>) {
  const insets = useSafeAreaInsets();
  const s = useSession();
  const [confirm, setConfirm] = React.useState<0 | 1 | 2>(0);
  const [typed, setTyped] = React.useState(false);
  const campus = campusById(s.campusId);

  const exportData = async () => {
    tapLight();
    const payload = {
      olusturulma: new Date().toISOString(),
      kampus: campus.name,
      telefon: s.phone ? `+90${s.phone}` : null,
      ogrenci_epostasi: s.studentEmail ?? null,
      kimlik_dogrulama: s.verification.status === 'verified' ? { durum: 'dogrulandi', cinsiyet: s.verification.gender, tarih: s.verification.verifiedAt } : { durum: 'yok' },
      gorunurluk: s.visibility, konum: s.location, bildirimler: s.notif, moduller: s.modules, engellenenler: s.blocked,
      son_etkinlikler: recentEvents(),
      not: 'Kimlik fotoğrafı ve selfie hiçbir zaman saklanmaz.',
    };
    await Share.share({ title: 'Orti verilerim', message: JSON.stringify(payload, null, 2) }).catch(() => {});
  };

  const doDelete = async () => {
    const r = await deleteAccount();
    if (r.ok) { track('hesap_silindi'); tapSuccess(); s.reset(); navigation.reset({ index: 0, routes: [{ name: 'Hosgeldin' }] }); }
  };

  const logout = async () => { await signOut(); s.set({ onboarded: false }); navigation.reset({ index: 0, routes: [{ name: 'Hosgeldin' }] }); };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 18 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Profil" onPress={() => navigation.goBack()} /></View>
      <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Ayarlar</T>

      <Group title="Bildirimler">
        {(Object.keys(NOTIF_LABELS) as NotifKey[]).map((k, i) => (
          <View key={k}>
            {i > 0 ? <Sep /> : null}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <T size={16}>{NOTIF_LABELS[k].title}</T>
                <T size={13} color={C.text2}>{NOTIF_LABELS[k].sub}</T>
              </View>
              <Toggle value={s.notif[k]} label={NOTIF_LABELS[k].title} onChange={(v) => { if (v) requestPermission(); s.set({ notif: { ...s.notif, [k]: v } }); }} />
            </View>
          </View>
        ))}
      </Group>

      <View style={{ gap: 8 }}>
        <SectionLabel>Profilimi kimler görsün</SectionLabel>
        <Segmented<Visibility> value={s.visibility} onChange={(v) => s.set({ visibility: v })}
          items={[{ id: 'herkes', label: 'Herkes' }, { id: 'kampus', label: 'Kampüsüm' }, { id: 'ekip', label: 'Ekibim' }]} />
        <T size={13} color={C.text2} style={{ marginHorizontal: 4 }}>Masaya katıldığın kişiler adını ve puanını her durumda görür.</T>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Konum</SectionLabel>
        <Segmented<LocationPrecision> value={s.location} onChange={(v) => s.set({ location: v })}
          items={[{ id: 'tam', label: 'Tam' }, { id: 'yaklasik', label: 'Yaklaşık' }, { id: 'kapali', label: 'Kapalı' }]} />
        <T size={13} color={C.text2} style={{ marginHorizontal: 4, lineHeight: 18 }}>
          {s.location === 'tam' ? 'Check-in için mekâna vardığını anlarız; konumun kimseye gösterilmez.' : s.location === 'yaklasik' ? 'Mesafeler yaklaşık hesaplanır, check-in QR ile yapılır.' : 'Mesafe gösterilmez; check-in sadece QR ile.'}
        </T>
      </View>

      <Group title="Güvenlik">
        <Row icon="shield" title="Kimlik doğrulama" value={s.verification.status === 'verified' ? 'Doğrulandı' : 'Doğrula'} onPress={() => navigation.navigate('Dogrulama')} />
        <Sep inset={50} />
        <Row icon="close" title="Engellenenler" value={`${s.blocked.length} kişi`} onPress={() => { tapLight(); s.set({ blocked: [] }); }} hint={s.blocked.length ? 'Dokun: hepsinin engelini kaldır' : undefined} />
      </Group>

      <Group title="Yasal">
        <Row icon="lock" title="KVKK Aydınlatma Metni" onPress={() => navigation.navigate('Yasal', { doc: 'kvkk' })} />
        <Sep inset={50} />
        <Row icon="menu" title="Kullanım Koşulları" onPress={() => navigation.navigate('Yasal', { doc: 'kosullar' })} />
        <Sep inset={50} />
        <Row icon="person" title="Topluluk Kuralları" onPress={() => navigation.navigate('Yasal', { doc: 'topluluk' })} />
      </Group>

      <Group title="Yönetim (rol bazlı)">
        <Row icon="flag" title="Moderasyon" value="Moderatör" onPress={() => navigation.navigate('Moderasyon')} />
        <Sep inset={50} />
        <Row icon="tag" title="İşletme paneli" value="Mekan sahibi" onPress={() => navigation.navigate('IsletmePaneli')} />
        <Sep inset={50} />
        <Row icon="star" title="Kulüp paneli" value="Kulüp yöneticisi" onPress={() => navigation.navigate('KulupPaneli')} />
      </Group>

      <Group title="Hesap">
        <Row icon="upload" title="Verilerimi indir" onPress={exportData} />
        <Sep inset={50} />
        <Row icon="back" title="Çıkış yap" onPress={logout} />
        <Sep inset={50} />
        {confirm === 0 ? (
          <Tap onPress={() => setConfirm(1)} style={styles.row} accessibilityLabel="Hesabımı sil">
            <Icon name="close" size={20} color={C.red} />
            <T w="s" size={16} color={C.red} style={{ flex: 1 }}>Hesabımı sil</T>
          </Tap>
        ) : (
          <View style={{ padding: 16, gap: 10, backgroundColor: '#FFF1F2' }}>
            <T w="b" size={16} color={C.red}>Hesabın kalıcı olarak silinecek</T>
            <T size={14} color={C.text3} style={{ lineHeight: 20 }}>Profilin, masaların, mesajların, puanların ve notların silinir. Bu işlem geri alınamaz. Açık şikayet kayıtları yasal süre boyunca anonim tutulur.</T>
            <Tap onPress={() => setTyped((x) => !x)} accessibilityRole="checkbox" accessibilityState={{ checked: typed }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 40 }}>
              <View style={[styles.box, typed && { backgroundColor: C.red, borderColor: C.red }]}>{typed ? <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3} /> : null}</View>
              <T size={14} style={{ flex: 1 }}>Anladım, hesabımı silmek istiyorum.</T>
            </Tap>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Tap onPress={() => { setConfirm(0); setTyped(false); }} style={[styles.btn, { backgroundColor: '#FFFFFF' }]}><T w="s" size={15}>Vazgeç</T></Tap>
              <Tap haptic="medium" disabled={!typed} onPress={doDelete} style={[styles.btn, { flex: 1, backgroundColor: typed ? C.red : C.border }]}>
                <T w="b" size={15} color={typed ? '#FFFFFF' : C.text3}>Kalıcı olarak sil</T>
              </Tap>
            </View>
          </View>
        )}
      </Group>

      <T size={12} color={C.text2} style={{ textAlign: 'center', lineHeight: 18 }}>
        Orti {Constants.expoConfig?.version ?? '1.0.0'} · {isLive ? 'Canlı sunucu' : 'Demo veri'} · {campus.name}
      </T>
    </ScrollView>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <SectionLabel>{title}</SectionLabel>
      <Card>{children}</Card>
    </View>
  );
}

function Row({ icon, title, value, onPress, hint }: { icon: IconName; title: string; value?: string; onPress: () => void; hint?: string }) {
  return (
    <Tap onPress={onPress} style={styles.row} accessibilityLabel={title}>
      <Icon name={icon} size={20} color={C.primary} />
      <View style={{ flex: 1 }}>
        <T size={16}>{title}</T>
        {hint ? <T size={12} color={C.text2}>{hint}</T> : null}
      </View>
      {value ? <T size={14} color={C.text2}>{value}</T> : null}
      <Icon name="chevRight" size={13} color={C.chevron} strokeWidth={3} />
    </Tap>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 50 },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  btn: { height: 44, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
});
