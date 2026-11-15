import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon, { IconName } from '../../components/Icon';
import { Avatar, Logo, PrimaryButton, T } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

const FEATURES: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'pin', title: 'Yakınındaki masalar', sub: 'Eksiği olan grupları anlık gör' },
  { icon: 'shield', title: 'Doğrulanmış oyuncular', sub: 'Herkesin bir güven skoru var' },
  { icon: 'star', title: 'Oyun sonu puanla', sub: 'İyi oyuncular öne çıkar, sorunlular elenir' },
];

export default function Hosgeldin({ navigation }: ScreenProps<'Hosgeldin'>) {
  const insets = useSafeAreaInsets();
  const [appleOk, setAppleOk] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS === 'ios') AppleAuthentication.isAvailableAsync().then(setAppleOk).catch(() => setAppleOk(false));
  }, []);

  const signInWithApple = async () => {
    try {
      const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      // Live: pass cred.identityToken to Supabase auth.signInWithIdToken({ provider: 'apple', token }).
      navigation.navigate('Kayit', { method: 'apple', appleToken: cred.identityToken ?? undefined, name: cred.fullName?.givenName ?? undefined });
    } catch (e) {
      if ((e as { code?: string }).code !== 'ERR_REQUEST_CANCELED') navigation.navigate('Kayit', { method: 'telefon' });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 20 }]}>
      <View style={{ flex: 1, gap: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Logo size={34} />
          <T w="x" size={26} style={{ letterSpacing: -0.9 }}>orti</T>
        </View>
        <Preview />
        <View style={{ gap: 10 }}>
          <T w="x" size={36} style={{ lineHeight: 41, letterSpacing: -1.2 }} accessibilityRole="header">Eksik mi var?{'\n'}Orti tamamlar.</T>
          <T size={17} color={C.text2} style={{ lineHeight: 24 }}>Okeyden halı sahaya, tavladan online maça. Yakınındaki masaları gör, dakikalar içinde katıl.</T>
        </View>
        <View style={{ gap: 16 }}>
          {FEATURES.map((f) => (
            <View key={f.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={styles.featIcon}><Icon name={f.icon} color={C.primary} size={20} /></View>
              <View style={{ flex: 1 }}>
                <T w="s" size={16}>{f.title}</T>
                <T size={14} color={C.text2}>{f.sub}</T>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={{ gap: 10 }}>
        {appleOk ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={16}
            style={{ height: 54 }}
            onPress={signInWithApple}
          />
        ) : null}
        <PrimaryButton title="Telefon numarasıyla devam et" color={appleOk ? C.bg : C.primary} textColor={appleOk ? C.text : '#FFFFFF'} onPress={() => navigation.navigate('Kayit', { method: 'telefon' })} />
        <T size={12} color={C.text2} style={{ textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
          Devam ederek <T size={12} w="s" color={C.text} onPress={() => navigation.navigate('Yasal', { doc: 'kosullar' })} accessibilityRole="link">Kullanım Koşulları</T> ve{' '}
          <T size={12} w="s" color={C.text} onPress={() => navigation.navigate('Yasal', { doc: 'topluluk' })} accessibilityRole="link">Topluluk Kuralları</T>’nı kabul edersin. Kişisel verilerin{' '}
          <T size={12} w="s" color={C.text} onPress={() => navigation.navigate('Yasal', { doc: 'kvkk' })} accessibilityRole="link">KVKK Aydınlatma Metni</T>’ne göre işlenir.
        </T>
      </View>
    </View>
  );
}

/** A real-looking open table: shows the product before any words do. */
function Preview() {
  return (
    <View style={{ height: 150 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.pv, styles.pvBack]}>
        <View style={[styles.pvTile, { backgroundColor: '#2DD4BF' }]}><Icon name="ball" size={20} color="#022C26" /></View>
        <View style={{ flex: 1 }}><T w="b" size={14}>Halı saha · 7v7</T><T size={12} color={C.text2}>Gezegen · 3 kişi aranıyor</T></View>
      </View>
      <View style={[styles.pv, styles.pvFront]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={[styles.pvTile, { backgroundColor: '#0C642F' }]}><Icon name="tiles" size={20} color="#FFFFFF" /></View>
          <View style={{ flex: 1 }}>
            <T w="b" size={16}>101 Okey</T>
            <T size={13} color={C.text2}>Arena Premium · 400 m</T>
          </View>
          <View style={styles.pvTime}><T w="b" size={13} color={C.urgent}>21:30</T></View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          {[['MK', '#FFD8B5'], ['EA', '#CFE3FF'], ['SY', '#D3F0DA']].map(([i, bg], k) => (
            <View key={i} style={{ marginLeft: k ? -8 : 0 }}><Avatar i={i} bg={bg} size={30} border /></View>
          ))}
          <View style={styles.pvSeat}><T w="b" size={14} color={C.primary}>+</T></View>
          <T w="s" size={13} color={C.primary} style={{ marginLeft: 10 }}>1 kişi aranıyor</T>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pv: { position: 'absolute', left: 0, right: 0, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, shadowColor: '#1B1340', shadowOpacity: 0.1, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  pvBack: { top: 0, left: 22, right: 22, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: 0.7, transform: [{ scale: 0.94 }] },
  pvFront: { top: 34, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(0,0,0,0.06)' },
  pvTile: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  pvTime: { backgroundColor: '#FFF1E5', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  pvSeat: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderStyle: 'dashed', borderColor: C.primary, marginLeft: -8, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  root: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  markWrap: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  featIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
});
