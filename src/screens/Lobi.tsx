import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';
import Icon, { IconName } from '../components/Icon';
import { Avatar, Card, GameTile, NavBack, PrimaryButton, SectionLabel, Sep, T, Tap, tapSuccess } from '../components/ui';
import { LOBBIES, ME, TABLE_PLAYERS } from '../data';
import type { ScreenProps } from '../navigation';

type Stage = 'idle' | 'requested' | 'approved';

export default function Lobi({ navigation, route }: ScreenProps<'Lobi'>) {
  const insets = useSafeAreaInsets();
  const lobby = LOBBIES.find((l) => l.id === route.params?.id) ?? LOBBIES[0];
  const [stage, setStage] = React.useState<Stage>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const total = lobby.players.length + lobby.empty;
  const base = TABLE_PLAYERS.slice(0, Math.min(lobby.players.length, TABLE_PLAYERS.length));
  const ok = stage === 'approved';
  const players = ok ? [...base, { id: 'me', i: ME.i, bg: ME.bg, name: 'Sen', meta: 'Az önce katıldın', rating: '4,8', trust: 96 }] : base;
  const filled = lobby.players.length + (ok ? 1 : 0);
  const done = filled >= total;

  const request = () => {
    setStage('requested');
    timer.current = setTimeout(() => { tapSuccess(); setStage('approved'); }, 2000);
  };
  const cancel = () => { if (timer.current) clearTimeout(timer.current); setStage('idle'); };

  const rows: { icon: IconName; title: string; sub: string; action?: string }[] = [
    { icon: 'pin', title: lobby.place.split(' · ')[0], sub: `${lobby.place.split(' · ')[1] ?? ''} · ${lobby.dist}`, action: lobby.type === 'online' ? undefined : 'Yol tarifi' },
    { icon: 'clock', title: lobby.time, sub: 'Tahmini 2 saat' },
    { icon: 'bars', title: 'Orta seviye', sub: 'Kurucu onayıyla katılım · Güven 85+' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={styles.nav}>
        <NavBack label="Geri" onPress={() => navigation.goBack()} />
        <View style={{ flexDirection: 'row' }}>
          <Tap accessibilityLabel="Kaydet" style={styles.navBtn}><Icon name="bookmark" color={C.primary} size={21} /></Tap>
          <Tap accessibilityLabel="Paylaş" style={styles.navBtn}><Icon name="share" color={C.primary} size={22} /></Tap>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 170, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <GameTile mark={lobby.mark} bg={lobby.tileBg} size={72} />
          <View style={{ gap: 6, flex: 1 }}>
            <T w="x" size={28} style={{ letterSpacing: -0.6 }} accessibilityRole="header">{lobby.game}</T>
            <View style={[styles.badge, { backgroundColor: done ? C.greenBg : C.tint }]}>
              <T w="s" size={13} color={done ? C.green : C.tintText}>{done ? 'Masa tamamlandı' : `${total - filled} kişi aranıyor`}</T>
            </View>
          </View>
        </View>

        <Card>
          {rows.map((r, idx) => (
            <View key={r.icon}>
              {idx > 0 ? <Sep inset={48} /> : null}
              <View style={styles.row}>
                <Icon name={r.icon} color={C.primary} size={20} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <T size={16}>{r.title}</T>
                    {idx === 0 && lobby.partner ? <View style={styles.partner}><T w="b" size={10} color={C.tintText}>PARTNER</T></View> : null}
                  </View>
                  <T size={13} color={C.text2}>{r.sub}</T>
                </View>
                {r.action ? <Tap style={{ minHeight: 44, justifyContent: 'center' }}><T w="s" size={15} color={C.primary}>{r.action}</T></Tap> : null}
              </View>
            </View>
          ))}
        </Card>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {['Eşli değil', 'Çaylar kurucudan', 'Sigarasız alan', 'Yeni başlayana açık'].map((r) => (
            <View key={r} style={styles.rule}><T w="s" size={13}>{r}</T></View>
          ))}
        </View>

        <View style={{ gap: 8 }}>
          <SectionLabel>Masadakiler · {filled}/{total}</SectionLabel>
          <Card>
            {players.map((p, idx) => (
              <View key={p.id}>
                {idx > 0 ? <Sep inset={68} /> : null}
                <View style={[styles.row, { paddingVertical: 10 }]}>
                  <Avatar i={p.i} bg={p.bg} size={40} />
                  <View style={{ flex: 1 }}>
                    <T w="s" size={16}>{p.name}</T>
                    <T size={13} color={C.text2}>{p.meta}</T>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="star" size={13} color={C.orange} fill={C.orange} strokeWidth={1} />
                      <T w="s" size={14}>{p.rating}</T>
                    </View>
                    <T w="s" size={12} color={C.green}>Güven {p.trust}</T>
                  </View>
                </View>
              </View>
            ))}
            {!done ? (
              <>
                <Sep inset={68} />
                <View style={[styles.row, { paddingVertical: 10 }]}>
                  <View style={styles.seat}><T size={18} color={C.text2}>+</T></View>
                  <T size={16} color={C.text2}>Boş sandalye — senin yerin olabilir</T>
                </View>
              </>
            ) : null}
          </Card>
        </View>

        <Card style={{ padding: 16, gap: 6 }}>
          <T w="s" size={13} color={C.text2}>Kurucunun notu</T>
          <T size={16} style={{ lineHeight: 22 }}>Her hafta oynayan bir ekibiz, eksiğimiz var. Keyifli ve saygılı bir masa arıyoruz.</T>
        </Card>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {stage === 'idle' ? (
          <>
            <PrimaryButton title="Katılma isteği gönder" onPress={request} />
            <T size={13} color={C.text2} style={{ textAlign: 'center' }}>Kurucu genelde 3 dakika içinde yanıtlıyor</T>
          </>
        ) : null}
        {stage === 'requested' ? (
          <>
            <View style={styles.pending} accessibilityLiveRegion="polite">
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.orange }} />
              <T w="s" size={16} color={C.text3}>İstek gönderildi · onay bekleniyor</T>
            </View>
            <Tap onPress={cancel} style={{ height: 36, alignItems: 'center', justifyContent: 'center' }}>
              <T w="s" size={15} color={C.red}>İsteği geri çek</T>
            </Tap>
          </>
        ) : null}
        {stage === 'approved' ? (
          <>
            <PrimaryButton title="Masadasın · Sohbete geç" color={C.green} onPress={() => navigation.navigate('Sohbet')} />
            <T size={13} color={C.text2} style={{ textAlign: 'center' }}>Başlamadan 30 dk önce hatırlatacağız</T>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 4 },
  navBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  partner: { backgroundColor: C.tint, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  rule: { backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  seat: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderStyle: 'dashed', borderColor: C.gray, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, gap: 8, backgroundColor: 'rgba(242,242,247,0.97)' },
  pending: { height: 54, borderRadius: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
});
