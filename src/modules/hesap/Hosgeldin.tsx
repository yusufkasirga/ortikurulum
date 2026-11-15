import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon, { IconName } from '../../components/Icon';
import { Logo, PrimaryButton, T } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

const FEATURES: { icon: IconName; title: string; sub: string }[] = [
  { icon: 'pin', title: 'Yakınındaki masalar', sub: 'Eksiği olan grupları anlık gör' },
  { icon: 'shield', title: 'Doğrulanmış oyuncular', sub: 'Herkesin bir güven skoru var' },
  { icon: 'star', title: 'Oyun sonu puanla', sub: 'İyi oyuncular öne çıkar, sorunlular elenir' },
];

export default function Hosgeldin({ navigation }: ScreenProps<'Hosgeldin'>) {
  const insets = useSafeAreaInsets();
  const enter = () => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  return (
    <View style={[styles.root, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 20 }]}>
      <View style={{ flex: 1, gap: 28 }}>
        <View style={styles.markWrap}>
          <View style={[StyleSheet.absoluteFill, { borderRadius: 66, backgroundColor: C.tint }]} />
          <View style={{ position: 'absolute', top: 18, left: 18, right: 18, bottom: 18, borderRadius: 48, backgroundColor: C.tint2 }} />
          <View style={{ zIndex: 1 }}><Logo size={72} /></View>
        </View>
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
        <PrimaryButton title="Apple ile devam et" color="#000000" onPress={enter} />
        <PrimaryButton title="Telefon numarasıyla devam et" color={C.bg} textColor={C.text} onPress={enter} />
        <T size={12} color={C.text2} style={{ textAlign: 'center', marginTop: 6, lineHeight: 17 }}>
          Devam ederek Kullanım Koşulları ve Topluluk Kuralları'nı kabul edersin.
        </T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 24 },
  markWrap: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  featIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
});
