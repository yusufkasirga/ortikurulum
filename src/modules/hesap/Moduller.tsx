import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Card, NavBack, SectionLabel, Sep, T, Toggle } from '../../components/ui';
import { MODULES, ModuleGroup } from '../../core/modules';
import { useSession } from '../../core/store';
import type { ScreenProps } from '../../core/navigation';
import { track } from '../../core/analytics';

const GROUPS: ModuleGroup[] = ['Oyun & sosyal', 'Kampüs', 'Hesap'];

export default function Moduller({ navigation }: ScreenProps<'Moduller'>) {
  const insets = useSafeAreaInsets();
  const { modules, toggleModule } = useSession();
  const on = MODULES.filter((m) => modules[m.id]).length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 18 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Geri" onPress={() => navigation.goBack()} /></View>
      <View style={{ gap: 6 }}>
        <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Modüller</T>
        <T size={15} color={C.text2} style={{ lineHeight: 21 }}>Orti’yi kendine göre kur. Kapattığın modüller ana sayfadan ve bildirimlerden kalkar. {on}/{MODULES.length} açık.</T>
      </View>

      {GROUPS.map((g) => (
        <View key={g} style={{ gap: 8 }}>
          <SectionLabel>{g}</SectionLabel>
          <Card>
            {MODULES.filter((m) => m.group === g).map((m, i) => (
              <View key={m.id}>
                {i > 0 ? <Sep inset={68} /> : null}
                <View style={styles.row}>
                  <View style={[styles.icon, { backgroundColor: m.color }]}>
                    <Icon name={m.icon} size={20} color={m.ink} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <T w="s" size={16}>{m.title}</T>
                    <T size={13} color={C.text2}>{m.locked ? 'Temel modül · hep açık' : m.sub}</T>
                  </View>
                  {m.locked ? <Icon name="lock" size={18} color={C.gray} /> : <Toggle value={!!modules[m.id]} onChange={() => { track(modules[m.id] ? 'modul_kapat' : 'modul_ac', { modul: m.id }); toggleModule(m.id); }} label={m.title} />}
                </View>
              </View>
            ))}
          </Card>
        </View>
      ))}

      <View style={styles.note}>
        <Icon name="cap" size={20} color={C.primary} />
        <T size={13} color={C.tintText} style={{ flex: 1, lineHeight: 18 }}>Kampüs modülleri üniversiteye göre açılır. ERÜ pilotunda hepsi aktif; yeni üniversite eklendiğinde orada hangilerinin olacağı ayrıca seçilir.</T>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: C.tint, borderRadius: 16, padding: 14 },
});
