import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './theme';
import Icon, { IconName } from '../components/Icon';
import { T, Tap, tapMedium } from '../components/ui';

import Hosgeldin from '../modules/hesap/Hosgeldin';
import Kesfet from '../modules/kesfet/Kesfet';
import Masalarim from '../modules/oyun/Masalarim';
import Sohbetler from '../modules/oyun/Sohbetler';
import Profil from '../modules/hesap/Profil';
import HizliEsles from '../modules/oyun/HizliEsles';
import Lobi from '../modules/oyun/Lobi';
import Sohbet from '../modules/oyun/Sohbet';
import Olustur from '../modules/oyun/Olustur';
import Degerlendir from '../modules/oyun/Degerlendir';
import Sikayet from '../modules/oyun/Sikayet';
import Harita from '../modules/mekan/Harita';
import Mekan from '../modules/mekan/Mekan';
import Dogrulama from '../modules/hesap/Dogrulama';
import Kampus from '../modules/kampus/Kampus';
import NotDetay from '../modules/kampus/NotDetay';
import Moduller from '../modules/hesap/Moduller';
import Firsatlar from '../modules/mekan/Firsatlar';
import Ekipler from '../modules/oyun/Ekipler';
import Lig from '../modules/oyun/Lig';
import QrCheckin from '../modules/oyun/QrCheckin';
import Kayit from '../modules/hesap/Kayit';
import Ayarlar from '../modules/hesap/Ayarlar';
import Yasal from '../modules/hesap/Yasal';
import Moderasyon from '../modules/yonetim/Moderasyon';
import IsletmePaneli from '../modules/yonetim/IsletmePaneli';
import KulupPaneli from '../modules/yonetim/KulupPaneli';
import { useSession } from './store';

export type TabParams = {
  Kesfet: undefined;
  Harita: { filter?: 'halisaha' } | undefined;
  Ekle: undefined;
  Kampus: { tab?: 'program' | 'calisma' | 'etkinlik' | 'notlar' } | undefined;
  Profil: undefined;
};
export type RootParams = {
  Hosgeldin: undefined;
  Tabs: NavigatorScreenParams<TabParams> | undefined;
  HizliEsles: undefined;
  Lobi: { id?: string; venueId?: string; tableId?: string } | undefined;
  Sohbet: undefined;
  Olustur: { venueId?: string; audience?: 'karma' | 'kadin' | 'erkek' } | undefined;
  Mekan: { id: string };
  Dogrulama: { then?: 'olustur'; venueId?: string } | undefined;
  Masalarim: undefined;
  Sohbetler: undefined;
  Degerlendir: undefined;
  Sikayet: { name?: string } | undefined;
  Moduller: undefined;
  Firsatlar: undefined;
  NotDetay: { id: string };
  Ekipler: undefined;
  Lig: undefined;
  QrCheckin: { venueId?: string } | undefined;
  Kayit: { method?: 'apple' | 'telefon' } | undefined;
  Ayarlar: undefined;
  Yasal: { doc: 'kvkk' | 'kosullar' | 'topluluk' };
  Moderasyon: undefined;
  IsletmePaneli: undefined;
  KulupPaneli: undefined;
};
export type ScreenProps<K extends keyof RootParams> = NativeStackScreenProps<RootParams, K>;

const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabParams>();

const Empty = () => null;

const TAB_META: Record<keyof TabParams, { icon: IconName; label: string }> = {
  Kesfet: { icon: 'compass', label: 'Keşfet' },
  Harita: { icon: 'map', label: 'Harita' },
  Ekle: { icon: 'plus', label: 'Masa aç' },
  Kampus: { icon: 'cap', label: 'Kampüs' },
  Profil: { icon: 'person', label: 'Profil' },
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[styles.tabRow, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const name = route.name as keyof TabParams;
        const meta = TAB_META[name];
        const focused = state.index === index;
        if (name === 'Ekle') {
          return (
            <View key={route.key} style={styles.tabItem}>
              <Tap
                haptic="medium"
                accessibilityLabel="Masa aç"
                onPress={() => navigation.getParent()?.navigate('Olustur')}
                style={styles.fab}
              >
                <Icon name="plus" color="#FFFFFF" size={24} strokeWidth={2.6} />
              </Tap>
            </View>
          );
        }
        const color = focused ? C.primary : C.text2;
        return (
          <Tap
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
            onPress={() => {
              const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.tabItem}
          >
            <View style={[styles.tabIcon, focused && { backgroundColor: C.tint }]}>
              <Icon name={meta.icon} color={color} size={24} strokeWidth={2} />
              {name === 'Kampus' ? (
                <View style={styles.badge}><T w="b" size={11} color="#FFFFFF">3</T></View>
              ) : null}
            </View>
            <T w={focused ? 'b' : 's'} size={10} color={color} style={{ marginTop: 2 }}>{meta.label}</T>
          </Tap>
        );
      })}
    </View>
  );
  return (
    <View style={styles.tabWrap}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(249,249,249,0.97)' }]} />
      )}
      {content}
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Kesfet" component={Kesfet} />
      <Tab.Screen name="Harita" component={Harita} />
      <Tab.Screen name="Ekle" component={Empty} listeners={{ tabPress: (e) => { e.preventDefault(); tapMedium(); } }} />
      <Tab.Screen name="Kampus" component={Kampus} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.bg, primary: C.primary } };

export default function RootNavigation() {
  const { onboarded } = useSession();
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName={onboarded ? 'Tabs' : 'Hosgeldin'} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
        <Stack.Screen name="Hosgeldin" component={Hosgeldin} />
        <Stack.Screen name="Tabs" component={Tabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="HizliEsles" component={HizliEsles} />
        <Stack.Screen name="Lobi" component={Lobi} />
        <Stack.Screen name="Sohbet" component={Sohbet} options={{ contentStyle: { backgroundColor: '#FFFFFF' } }} />
        <Stack.Screen name="Degerlendir" component={Degerlendir} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Olustur" component={Olustur} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Sikayet" component={Sikayet} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Dogrulama" component={Dogrulama} options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Mekan" component={Mekan} />
        <Stack.Screen name="Masalarim" component={Masalarim} />
        <Stack.Screen name="Sohbetler" component={Sohbetler} />
        <Stack.Screen name="Moduller" component={Moduller} />
        <Stack.Screen name="Firsatlar" component={Firsatlar} />
        <Stack.Screen name="NotDetay" component={NotDetay} />
        <Stack.Screen name="Ekipler" component={Ekipler} />
        <Stack.Screen name="Kayit" component={Kayit} options={{ contentStyle: { backgroundColor: '#FFFFFF' } }} />
        <Stack.Screen name="Ayarlar" component={Ayarlar} />
        <Stack.Screen name="Yasal" component={Yasal} />
        <Stack.Screen name="Moderasyon" component={Moderasyon} />
        <Stack.Screen name="IsletmePaneli" component={IsletmePaneli} />
        <Stack.Screen name="KulupPaneli" component={KulupPaneli} />
        <Stack.Screen name="Lig" component={Lig} />
        <Stack.Screen name="QrCheckin" component={QrCheckin} options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabWrap: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.sep, overflow: 'hidden' },
  tabRow: { flexDirection: 'row', paddingTop: 8, paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 50 },
  fab: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: C.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  tabIcon: { width: 52, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -4, right: 0, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.badge, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
});
