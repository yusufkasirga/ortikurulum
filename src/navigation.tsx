import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './theme';
import Icon, { IconName } from './components/Icon';
import { T, Tap, tapMedium } from './components/ui';

import Hosgeldin from './screens/Hosgeldin';
import Kesfet from './screens/Kesfet';
import Masalarim from './screens/Masalarim';
import Sohbetler from './screens/Sohbetler';
import Profil from './screens/Profil';
import HizliEsles from './screens/HizliEsles';
import Lobi from './screens/Lobi';
import Sohbet from './screens/Sohbet';
import Olustur from './screens/Olustur';
import Degerlendir from './screens/Degerlendir';
import Sikayet from './screens/Sikayet';
import Harita from './screens/Harita';
import Mekan from './screens/Mekan';
import Dogrulama from './screens/Dogrulama';

export type TabParams = { Kesfet: undefined; Harita: undefined; Ekle: undefined; Sohbetler: undefined; Profil: undefined };
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
  Degerlendir: undefined;
  Sikayet: { name?: string } | undefined;
};
export type ScreenProps<K extends keyof RootParams> = NativeStackScreenProps<RootParams, K>;

const Stack = createNativeStackNavigator<RootParams>();
const Tab = createBottomTabNavigator<TabParams>();

const Empty = () => null;

const TAB_META: Record<keyof TabParams, { icon: IconName; label: string }> = {
  Kesfet: { icon: 'compass', label: 'Keşfet' },
  Harita: { icon: 'map', label: 'Harita' },
  Ekle: { icon: 'plus', label: 'Masa aç' },
  Sohbetler: { icon: 'chat', label: 'Sohbet' },
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
            <View>
              <Icon name={meta.icon} color={color} size={25} strokeWidth={2} />
              {name === 'Sohbetler' ? (
                <View style={styles.badge}><T w="b" size={11} color="#FFFFFF">2</T></View>
              ) : null}
            </View>
            <T w="s" size={10} color={color} style={{ marginTop: 3 }}>{meta.label}</T>
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
      <Tab.Screen name="Sohbetler" component={Sohbetler} />
      <Tab.Screen name="Profil" component={Profil} />
    </Tab.Navigator>
  );
}

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: C.bg, primary: C.primary } };

export default function RootNavigation() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
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
  badge: { position: 'absolute', top: -4, right: -10, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.badge, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
});
