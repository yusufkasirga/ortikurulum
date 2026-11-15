import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect } from 'react-native-svg';
import { C, F } from '../../core/theme';
import Icon from '../../components/Icon';
import { Card, NavBack, SectionLabel, Segmented, Sep, T, Tap, Toggle, tapSuccess } from '../../components/ui';
import { CAT_META, Smoking, venueById } from '../mekan/venues';
import type { ScreenProps } from '../../core/navigation';

/** Venue owner panel (role: venue_owner). Demo for Arena; live: venues / venue_prices / promotions. */
const WEEK = [12, 18, 9, 22, 31, 27, 15];
const DAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

export default function IsletmePaneli({ navigation }: ScreenProps<'IsletmePaneli'>) {
  const insets = useSafeAreaInsets();
  const v = venueById('arena')!;
  const meta = CAT_META[v.cat];
  const [smoking, setSmoking] = React.useState<Smoking>(v.smoking.value);
  const [hookah, setHookah] = React.useState(false);
  const [offer, setOffer] = React.useState(v.featured?.offer ?? '');
  const [prices, setPrices] = React.useState<{ label: string; value: string }[]>([
    { label: 'Çay', value: '' }, { label: 'Okey masa ücreti (saat)', value: '' }, { label: 'Tost', value: '' },
  ]);
  const [saved, setSaved] = React.useState(false);
  const max = Math.max(...WEEK);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 16 }} keyboardShouldPersistTaps="handled">
      <View style={{ marginLeft: -8 }}><NavBack label="Ayarlar" onPress={() => navigation.goBack()} /></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={[styles.tile, { backgroundColor: meta.color }]}><Icon name={meta.icon} size={26} color={meta.on} /></View>
        <View style={{ flex: 1 }}>
          <T w="s" size={13} color={C.text2}>İşletme paneli</T>
          <T w="x" size={22} style={{ letterSpacing: -0.4 }} accessibilityRole="header" numberOfLines={1}>{v.name}</T>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Kpi n="134" label="Orti’den gelen" sub="bu hafta" />
        <Kpi n="%86" label="Check-in oranı" sub="masaya gelenler" />
        <Kpi n="2" label="Açık masa" sub="şu an" />
      </View>

      <Card style={{ padding: 16, gap: 12 }}>
        <T w="b" size={16}>Haftalık check-in</T>
        <Svg width="100%" height={110} viewBox="0 0 280 110">
          {WEEK.map((n, i) => {
            const h = (n / max) * 84;
            return <Rect key={i} x={i * 40 + 8} y={92 - h} width={24} height={h} rx={6} fill={i === 4 ? C.primary : C.tint2} />;
          })}
        </Svg>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>{DAYS.map((d) => <T key={d} size={12} color={C.text2}>{d}</T>)}</View>
        <T size={12} color={C.text2}>Örnek veri · en yoğun gün Cuma</T>
      </Card>

      <View style={{ gap: 8 }}>
        <SectionLabel>Kampanya (Reklam etiketiyle gösterilir)</SectionLabel>
        <Card style={{ padding: 14, gap: 8 }}>
          <TextInput value={offer} onChangeText={setOffer} placeholder="Örn. Orti’den gelen masaya ilk çaylar ikram" placeholderTextColor={C.text2} accessibilityLabel="Kampanya metni"
            style={styles.input} multiline />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Fiyatlar</SectionLabel>
        <Card>
          {prices.map((p, i) => (
            <View key={p.label}>
              {i > 0 ? <Sep /> : null}
              <View style={styles.row}>
                <T size={16} style={{ flex: 1 }}>{p.label}</T>
                <TextInput value={p.value} onChangeText={(t) => setPrices((x) => x.map((y, k) => (k === i ? { ...y, value: t } : y)))} keyboardType="numeric"
                  placeholder="₺" placeholderTextColor={C.text2} accessibilityLabel={`${p.label} fiyatı`} style={[styles.input, { width: 90, textAlign: 'right' }]} />
              </View>
            </View>
          ))}
          <Sep />
          <Tap onPress={() => setPrices((x) => [...x, { label: `Ürün ${x.length + 1}`, value: '' }])} style={styles.row}>
            <Icon name="plus" size={18} color={C.primary} /><T w="s" size={15} color={C.primary}>Ürün ekle</T>
          </Tap>
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Ortam bilgisi</SectionLabel>
        <Segmented<Smoking> value={smoking === 'bilinmiyor' ? 'dumansiz' : smoking} onChange={setSmoking}
          items={[{ id: 'dumansiz', label: 'Dumansız' }, { id: 'acik-alan', label: 'Açık alanda' }, { id: 'kapali-serbest', label: 'İçeride' }]} />
        <Card style={[styles.row, { paddingVertical: 10 }]}>
          <T size={16} style={{ flex: 1 }}>Nargile servisi var</T>
          <Toggle value={hookah} onChange={setHookah} label="Nargile servisi" />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionLabel>Masa QR kodları</SectionLabel>
        <Card style={{ padding: 14, gap: 8 }}>
          <T size={14} color={C.text3} style={{ lineHeight: 20 }}>Her masaya ayrı kod; birkaç dakikada bir yenilenen imzalı bağlantı. Yazdırıp masalara yapıştır.</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={styles.qr}><Icon name="tiles" size={16} color={C.primary} /><T w="b" size={12}>Masa {i + 1}</T></View>
            ))}
          </View>
          <Tap style={styles.print}><Icon name="upload" size={16} color={C.primary} /><T w="s" size={14} color={C.primary}>PDF olarak indir</T></Tap>
        </Card>
      </View>

      <Tap haptic="medium" onPress={() => { tapSuccess(); setSaved(true); }} style={[styles.save, saved && { backgroundColor: C.green }]}>
        <T w="b" size={17} color="#FFFFFF">{saved ? 'Kaydedildi · onay sonrası yayında' : 'Değişiklikleri kaydet'}</T>
      </Tap>
    </ScrollView>
  );
}

function Kpi({ n, label, sub }: { n: string; label: string; sub: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 1 }}>
      <T w="x" size={22}>{n}</T>
      <T w="s" size={12}>{label}</T>
      <T size={11} color={C.text2}>{sub}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 8, minHeight: 50 },
  input: { fontFamily: F.r, fontSize: 16, color: C.text, minHeight: 40, padding: 0 },
  qr: { width: 72, height: 64, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', gap: 4 },
  print: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', minHeight: 40 },
  save: { height: 54, borderRadius: 16, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
});
