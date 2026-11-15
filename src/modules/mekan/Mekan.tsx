import React from 'react';
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Card, NavBack, PrimaryButton, SectionLabel, Sep, T, Tap, tapSuccess } from '../../components/ui';
import { CAT_META, SMOKING_LABEL, VENUES, distanceKm, fmtKm, venueById } from './venues';
import type { ScreenProps } from '../../core/navigation';

const SRC_LABEL = { yorum: 'Kullanıcı yorumlarından', isim: 'Mekan kategorisinden', isletme: 'İşletmeden' } as const;

export default function Mekan({ navigation, route }: ScreenProps<'Mekan'>) {
  const insets = useSafeAreaInsets();
  const v = venueById(route.params?.id) ?? VENUES[0];
  const meta = CAT_META[v.cat];
  const [reported, setReported] = React.useState(false);

  const directions = () => {
    const url = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${v.lat},${v.lng}&q=${encodeURIComponent(v.name)}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}&query_place_id=${v.google?.placeId ?? ''}`;
    Linking.openURL(url).catch(() => {});
  };
  const openGoogle = () => {
    if (!v.google) return;
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.name)}&query_place_id=${v.google.placeId}`).catch(() => {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={styles.nav}><NavBack label="Harita" onPress={() => navigation.goBack()} /></View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 120, gap: 18 }}>
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View style={[styles.tile, { backgroundColor: meta.color }]}><Icon name={meta.icon} color={meta.on} size={34} strokeWidth={1.8} /></View>
          <View style={{ flex: 1, gap: 4 }}>
            <T w="x" size={24} style={{ letterSpacing: -0.5 }} accessibilityRole="header">{v.name}</T>
            <T size={14} color={C.text2}>{meta.label} · {v.area}</T>
            {v.partner ? <View style={styles.partner}><T w="b" size={11} color={C.tintText}>ORTİ PARTNER</T></View> : null}
          </View>
        </View>

        {v.featured ? (
          <View style={styles.offer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <T w="b" size={12} color={C.sunText}>ORTİ’YE ÖZEL</T>
              <T w="s" size={11} color={C.sunText}>Reklam</T>
            </View>
            <T w="x" size={19} color="#241200" style={{ letterSpacing: -0.3 }}>{v.featured.offer}</T>
            <T size={14} color="#4A3100" style={{ lineHeight: 19 }}>{v.featured.detail}</T>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tap onPress={openGoogle} style={styles.stat} accessibilityLabel="Google puanı">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={16} color={C.orange} fill={C.orange} strokeWidth={1} />
              <T w="x" size={20}>{v.google ? v.google.rating.toFixed(1).replace('.', ',') : '—'}</T>
            </View>
            <T size={12} color={C.text2}>Google · {v.google?.count ?? 0} yorum</T>
          </Tap>
          <View style={styles.stat}>
            <T w="x" size={20} color={C.primary}>Yeni</T>
            <T size={12} color={C.text2}>Orti puanı ilk oyunlardan sonra</T>
          </View>
          <View style={styles.stat}>
            <T w="x" size={20}>{fmtKm(distanceKm(v.lat, v.lng))}</T>
            <T size={12} color={C.text2}>Kampüse</T>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>Açık masalar</SectionLabel>
          <Card>
            {v.tables.length === 0 ? (
              <View style={styles.row}><T size={15} color={C.text2} style={{ flex: 1 }}>Şu an açık masa yok.</T></View>
            ) : v.tables.map((t, i) => (
              <View key={t.id}>
                {i > 0 ? <Sep /> : null}
                <Tap onPress={() => navigation.navigate('Lobi', { venueId: v.id, tableId: t.id })} style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <T w="s" size={16}>{t.game}</T>
                    <T size={13} color={C.text2}>{t.time} · {t.total - t.need}/{t.total} · {t.host} (Güven {t.hostTrust}){t.womenOnly ? ' · Kadın masası' : ''}</T>
                  </View>
                  <View style={styles.need}><T w="s" size={12} color={C.tintText}>{t.need} kişi</T></View>
                  <Icon name="chevRight" size={14} color={C.chevron} strokeWidth={3} />
                </Tap>
              </View>
            ))}
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>Ortam</SectionLabel>
          <Card>
            <Fact icon={v.smoking.value === 'dumansiz' ? 'noSmoke' : 'smoke'} title={SMOKING_LABEL[v.smoking.value]} src={v.smoking.src} unknown={v.smoking.value === 'bilinmiyor'} />
            <Sep inset={52} />
            <Fact icon="hookah" title={v.hookah ? (v.hookah.value ? 'Nargile var' : 'Nargile yok') : 'Nargile bilgisi yok'} src={v.hookah?.src} unknown={!v.hookah} />
            <Sep inset={52} />
            <Fact icon="clock" title={v.hours} src="isletme" />
          </Card>
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>Oyunlar</SectionLabel>
          {v.games.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {v.games.map((x) => <View key={x.value} style={styles.chip}><T w="s" size={14}>{x.value}</T></View>)}
            </View>
          ) : <T size={14} color={C.text2} style={{ marginLeft: 4 }}>Henüz bildirilmedi.</T>}
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>Fiyat ve menü</SectionLabel>
          <Card>
            {v.prices.map((p, i) => (
              <View key={p.label}>
                {i > 0 ? <Sep /> : null}
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <T w="s" size={15}>{p.label}</T>
                    <T size={14} color={C.text3}>{p.value}</T>
                    <T size={12} color={C.text2}>{SRC_LABEL[p.src]}</T>
                  </View>
                </View>
              </View>
            ))}
            {v.prices.length ? <Sep /> : null}
            <View style={[styles.row, { alignItems: 'flex-start' }]}>
              <Icon name="menu" size={20} color={C.gray} />
              <View style={{ flex: 1, gap: 2 }}>
                <T w="s" size={15}>Menü henüz eklenmedi</T>
                <T size={13} color={C.text2}>Çay, masa ücreti ve saatlik fiyatları işletme ekleyince burada göreceksin.</T>
              </View>
            </View>
          </Card>
        </View>

        {v.highlights.length || v.warnings.length ? (
          <View style={{ gap: 8 }}>
            <SectionLabel>Oyuncular ne diyor</SectionLabel>
            <Card style={{ padding: 14, gap: 8 }}>
              {v.highlights.map((h) => <Line key={h} good text={h} />)}
              {v.warnings.map((h) => <Line key={h} text={h} />)}
              <T size={12} color={C.text2}>Herkese açık yorumlardan özetlendi.</T>
            </Card>
          </View>
        ) : null}

        <Tap onPress={() => { tapSuccess(); setReported(true); }} style={styles.report}>
          <Icon name="edit" size={18} color={C.primary} />
          <T w="s" size={15} color={C.primary} style={{ flex: 1 }}>{reported ? 'Teşekkürler, bilgiyi kontrol edeceğiz' : 'Bilgi eksik veya yanlış mı? Düzelt'}</T>
        </Tap>
        <Tap style={styles.report}>
          <Icon name="tag" size={18} color={C.text3} />
          <T w="s" size={15} color={C.text3} style={{ flex: 1 }}>Bu mekanın sahibi misin? Menünü ekle</T>
          <Icon name="chevRight" size={14} color={C.chevron} strokeWidth={3} />
        </Tap>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Tap onPress={directions} style={styles.dirBtn} accessibilityLabel="Yol tarifi"><Icon name="directions" size={22} color={C.primary} /></Tap>
        <PrimaryButton title="Burada masa aç" style={{ flex: 1 }} onPress={() => navigation.navigate('Olustur', { venueId: v.id })} />
      </View>
    </View>
  );
}

function Fact({ icon, title, src, unknown }: { icon: 'smoke' | 'noSmoke' | 'hookah' | 'clock'; title: string; src?: 'yorum' | 'isim' | 'isletme'; unknown?: boolean }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={22} color={unknown ? C.gray : C.text3} />
      <View style={{ flex: 1 }}>
        <T size={16} color={unknown ? C.text2 : C.text}>{title}</T>
        {src ? <T size={12} color={C.text2}>{SRC_LABEL[src]}</T> : unknown ? <T size={12} color={C.primary}>İlk bilgiyi sen ekle</T> : null}
      </View>
    </View>
  );
}

function Line({ text, good }: { text: string; good?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 6, backgroundColor: good ? C.greenDot : C.orange }} />
      <T size={15} style={{ flex: 1, lineHeight: 21 }}>{text}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { paddingHorizontal: 12, paddingVertical: 4 },
  tile: { width: 68, height: 68, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  offer: { backgroundColor: C.sun, borderRadius: 20, padding: 16, gap: 6 },
  partner: { alignSelf: 'flex-start', backgroundColor: C.tint, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  stat: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12 },
  need: { backgroundColor: C.tint, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  chip: { backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  report: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, minHeight: 50 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, flexDirection: 'row', gap: 10, backgroundColor: 'rgba(242,242,247,0.97)' },
  dirBtn: { width: 54, height: 54, borderRadius: 16, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
});
