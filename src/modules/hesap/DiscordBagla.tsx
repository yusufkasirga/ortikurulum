import React from 'react';
import { Linking, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, DISCORD, DISCORD_TINT, F } from '../../core/theme';
import Icon, { IconName } from '../../components/Icon';
import { Card, PrimaryButton, Sep, T, Tap, Toggle, tapSuccess } from '../../components/ui';
import { useSession } from '../../core/store';
import { isLive, linkDiscord } from '../../core/backend';
import { track } from '../../core/analytics';
import type { ScreenProps } from '../../core/navigation';


const POINTS: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'headset', title: 'Sesliye tek dokunuşla', sub: 'Online masanın kurucusu ses kanalı davetini ekler, onaylanınca butonu görürsün.' },
  { icon: 'person', title: 'Takım arkadaşların seni bulur', sub: 'Discord adın yalnızca aynı online masadaki oyunculara görünür.' },
  { icon: 'lock', title: 'Sunucularına dokunmayız', sub: 'Sadece kullanıcı adını alırız. Mesajlarını, sunucularını ve arkadaş listeni göremeyiz.' },
];

export default function DiscordBagla({ navigation }: ScreenProps<'DiscordBagla'>) {
  const insets = useSafeAreaInsets();
  const { discord, set } = useSession();
  const [name, setName] = React.useState('');
  const [err, setErr] = React.useState<string | undefined>();
  const valid = /^[a-z0-9_.]{2,32}$/.test(name.trim().replace(/^@/, '').toLowerCase());

  const connect = async () => {
    setErr(undefined);
    if (isLive) {
      const r = await linkDiscord();
      if (!r.ok) { setErr(r.error ?? 'Bağlanamadı, tekrar dene.'); return; }
      if (r.url) { Linking.openURL(r.url).catch(() => {}); return; } // username arrives via auth callback
    }
    if (!valid) { setErr('Discord kullanıcı adı 2–32 karakter: küçük harf, rakam, _ ve . olabilir.'); return; }
    set({ discord: { username: name.trim().replace(/^@/, '').toLowerCase(), showOnTables: true } });
    track('discord_baglandi');
    tapSuccess();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={styles.grab} />
      <View style={styles.nav}>
        <View style={{ width: 70 }} />
        <T w="s" size={17}>Discord</T>
        <Tap onPress={() => navigation.goBack()} style={{ width: 70, alignItems: 'flex-end', minHeight: 44, justifyContent: 'center' }}>
          <T w="s" size={17} color={C.primary}>Bitti</T>
        </Tap>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32, gap: 20 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', gap: 12, paddingTop: 8 }}>
          <View style={styles.pair}>
            <View style={[styles.mark, { backgroundColor: C.primary }]}><Icon name="table" size={30} color="#FFFFFF" /></View>
            <View style={styles.bridge}><Icon name="link" size={16} color={C.text2} /></View>
            <View style={[styles.mark, { backgroundColor: DISCORD }]}><Icon name="discord" size={32} color="#FFFFFF" /></View>
          </View>
          <T w="x" size={26} style={{ letterSpacing: -0.6, textAlign: 'center' }} accessibilityRole="header">
            {discord ? 'Discord bağlı' : 'Online masalar için\nDiscord’unu bağla'}
          </T>
          {discord ? (
            <View style={styles.handle}><Icon name="discord" size={16} color={DISCORD} /><T w="b" size={15} color={DISCORD}>@{discord.username}</T></View>
          ) : null}
        </View>

        <Card>
          {POINTS.map((p, i) => (
            <View key={p.title}>
              {i > 0 ? <Sep inset={58} /> : null}
              <View style={styles.row}>
                <View style={styles.pIcon}><Icon name={p.icon} size={18} color={DISCORD} /></View>
                <View style={{ flex: 1, gap: 2 }}>
                  <T w="s" size={15}>{p.title}</T>
                  <T size={13} color={C.text2} style={{ lineHeight: 18 }}>{p.sub}</T>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {discord ? (
          <>
            <Card>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <T size={16}>Online masalarda göster</T>
                  <T size={13} color={C.text2}>Kapalıyken adın sadece sen paylaşınca görünür</T>
                </View>
                <Toggle value={discord.showOnTables} label="Online masalarda göster" onChange={(v) => set({ discord: { ...discord, showOnTables: v } })} />
              </View>
            </Card>
            <Tap onPress={() => { set({ discord: undefined }); track('discord_kaldirildi'); }} style={styles.unlink} accessibilityLabel="Discord bağlantısını kaldır">
              <T w="s" size={16} color={C.red}>Bağlantıyı kaldır</T>
            </Tap>
          </>
        ) : (
          <View style={{ gap: 10 }}>
            {!isLive ? (
              <View style={styles.inputWrap}>
                <T w="b" size={16} color={C.text2}>@</T>
                <TextInput value={name} onChangeText={(t) => { setName(t); setErr(undefined); }} placeholder="kullanici_adi" placeholderTextColor={C.gray}
                  autoCapitalize="none" autoCorrect={false} accessibilityLabel="Discord kullanıcı adı" onSubmitEditing={connect}
                  style={{ flex: 1, fontFamily: F.m, fontSize: 17, color: C.text, padding: 0 }} />
              </View>
            ) : null}
            {err ? <T size={13} color={C.red} style={{ marginHorizontal: 4 }}>{err}</T> : null}
            <PrimaryButton title="Discord ile bağlan" color={DISCORD} onPress={connect} disabled={!isLive && !valid} />
            <T size={12} color={C.text2} style={{ textAlign: 'center', lineHeight: 17 }}>
              Discord, Discord Inc.’in markasıdır. Orti, Discord ile resmi bir ortaklık içinde değildir.
            </T>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grab: { alignSelf: 'center', width: 36, height: 5, borderRadius: 3, backgroundColor: C.border, marginTop: 8 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  pair: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bridge: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  handle: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: DISCORD_TINT, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  pIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: DISCORD_TINT, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 16, height: 54 },
  unlink: { height: 50, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});
