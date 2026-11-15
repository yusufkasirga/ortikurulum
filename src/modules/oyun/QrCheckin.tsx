import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { PrimaryButton, T, Tap, tapSuccess } from '../../components/ui';
import { venueById } from '../mekan/venues';
import type { ScreenProps } from '../../core/navigation';
import { track } from '../../core/analytics';

/**
 * Table QR check-in at partner venues.
 * Prototype: the scan is simulated. Production: expo-camera barcode scanning of a signed
 * per-table code (venue + table + rotating token) so a photo of the code cannot be reused remotely.
 */
export default function QrCheckin({ navigation, route }: ScreenProps<'QrCheckin'>) {
  const insets = useSafeAreaInsets();
  const venue = venueById(route.params?.venueId ?? 'arena');
  const [done, setDone] = React.useState(false);
  const line = React.useState(() => new Animated.Value(0))[0];
  React.useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(line, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(line, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [line]);

  if (done) {
    return (
      <View style={[styles.root, { backgroundColor: C.bg, paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 }} accessibilityLiveRegion="polite">
          <View style={styles.ok}><Icon name="check" size={44} color={C.green} strokeWidth={2.6} /></View>
          <T w="x" size={26} style={{ letterSpacing: -0.5 }}>Masadasın!</T>
          <T size={15} color={C.text2} style={{ textAlign: 'center' }}>{venue?.name} · Masa 7 · 21:24{'\n'}Dakiklik puanın korundu, lig maçın sayıldı.</T>
          {venue?.featured ? (
            <View style={styles.reward}>
              <T w="b" size={12} color={C.sunText}>KAZANDIĞIN</T>
              <T w="x" size={18} color="#241200">{venue.featured.offer}</T>
              <T size={13} color="#4A3100">Bu ekranı garsona göster.</T>
            </View>
          ) : null}
        </View>
        <PrimaryButton title="Masa sohbetine dön" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: '#0B0B12', paddingTop: insets.top + 8, paddingBottom: insets.bottom + 20 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tap onPress={() => navigation.goBack()} accessibilityLabel="Kapat" style={styles.close}><Icon name="close" size={18} color="#FFF" strokeWidth={2.6} /></Tap>
        <T w="s" size={15} color="#FFF">{venue?.name}</T>
        <View style={{ width: 40 }} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <T w="x" size={24} color="#FFF" style={{ textAlign: 'center' }}>Masadaki QR’ı okut</T>
        <View style={styles.frame}>
          {[0, 1, 2, 3].map((i) => <View key={i} style={[styles.corner, cornerPos[i]]} />)}
          <Animated.View style={[styles.scan, { transform: [{ translateY: line.interpolate({ inputRange: [0, 1], outputRange: [10, 220] }) }] }]} />
          <T size={13} color="rgba(255,255,255,0.6)">Kamera önizlemesi (prototip)</T>
        </View>
        <T size={14} color="rgba(255,255,255,0.75)" style={{ textAlign: 'center', lineHeight: 20 }}>Kod her masada farklı ve birkaç dakikada bir yenilenir;{'\n'}uzaktan check-in yapılamaz.</T>
      </View>
      <PrimaryButton title="Okutuldu (demo)" color={C.sun} textColor="#241200" onPress={() => { tapSuccess(); setDone(true); track('checkin_qr', { mekan: venue?.id ?? '' }); }} />
    </View>
  );
}

const cornerPos = [
  { top: -2, left: -2, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 22 },
  { top: -2, right: -2, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 22 },
  { bottom: -2, left: -2, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 22 },
  { bottom: -2, right: -2, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 22 },
];

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 20 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  frame: { width: 240, height: 240, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  corner: { position: 'absolute', width: 44, height: 44, borderColor: C.sun },
  scan: { position: 'absolute', top: 0, left: 16, right: 16, height: 3, borderRadius: 2, backgroundColor: C.sun },
  ok: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.greenBg, alignItems: 'center', justifyContent: 'center' },
  reward: { alignSelf: 'stretch', backgroundColor: C.sun, borderRadius: 18, padding: 16, gap: 4, marginTop: 8 },
});
