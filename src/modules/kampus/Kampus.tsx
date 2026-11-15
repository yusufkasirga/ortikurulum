import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Segmented, T } from '../../components/ui';
import { ME_CAMPUS } from './data';
import { useSession } from '../../core/store';
import { styles } from './styles';
import Program from './Program';
import Kutuphane from './Kutuphane';
import Etkinlikler from './Etkinlikler';
import Notlar from './Notlar';
import type { TabParams } from '../../core/navigation';

type Tab = 'program' | 'etkinlik' | 'notlar' | 'calisma';

export default function Kampus({ navigation, route }: BottomTabScreenProps<TabParams, 'Kampus'>) {
  const insets = useSafeAreaInsets();
  const root = navigation.getParent();
  const { modules } = useSession();
  const all: { id: Tab; label: string; mod: 'program' | 'kutuphane' | 'etkinlik' | 'notlar' }[] = [
    { id: 'program', label: 'Program', mod: 'program' },
    { id: 'calisma', label: 'Kütüphane', mod: 'kutuphane' },
    { id: 'etkinlik', label: 'Etkinlik', mod: 'etkinlik' },
    { id: 'notlar', label: 'Notlar', mod: 'notlar' },
  ];
  const items = all.filter((x) => modules[x.mod]);
  const [tab, setTab] = React.useState<Tab>(route.params?.tab ?? items[0]?.id ?? 'program');
  // Follow a new tab requested via navigation params (adjust state during render, no effect).
  const [seenParam, setSeenParam] = React.useState(route.params?.tab);
  if (route.params?.tab !== seenParam) { setSeenParam(route.params?.tab); if (route.params?.tab) setTab(route.params.tab); }
  const current = items.some((x) => x.id === tab) ? tab : items[0]?.id;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 120, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <T w="s" size={14} color={C.text2}>ERÜ · {ME_CAMPUS.bolum} · {ME_CAMPUS.sinif}. sınıf</T>
          <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Kampüs</T>
        </View>
        <View style={styles.capBadge}><Icon name="cap" size={22} color={C.primary} /></View>
      </View>
      {items.length > 1 && current ? <Segmented<Tab> value={current} onChange={setTab} items={items.map(({ id, label }) => ({ id, label }))} /> : null}
      {items.length === 0 ? <T size={15} color={C.text2}>Kampüs modüllerinin hepsi kapalı. Profil › Modüller’den açabilirsin.</T> : null}
      {current === 'program' ? <Program onTable={(venueId, tableId) => root?.navigate('Lobi', { venueId, tableId })} /> : null}
      {current === 'etkinlik' ? <Etkinlikler /> : null}
      {current === 'notlar' ? <Notlar onOpen={(id) => root?.navigate('NotDetay', { id })} /> : null}
      {current === 'calisma' ? <Kutuphane onCreate={() => root?.navigate('Olustur')} /> : null}
    </ScrollView>
  );
}
