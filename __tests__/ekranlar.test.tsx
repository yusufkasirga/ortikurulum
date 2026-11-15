/// <reference types="jest" />
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

jest.mock('react-native-maps', () => {
  const R = require('react'); const { View } = require('react-native');
  const MockMap = R.forwardRef((p: any, _r: any) => R.createElement(View, { testID: 'map' }, p.children));
  const Marker = (p: any) => R.createElement(View, null, p.children);
  return { __esModule: true, default: MockMap, Marker, PROVIDER_DEFAULT: undefined };
});
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(), setNotificationChannelAsync: jest.fn(async () => {}), getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })), scheduleNotificationAsync: jest.fn(async () => 'id'), getExpoPushTokenAsync: jest.fn(async () => ({ data: 't' })),
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
}));
jest.mock('react-native-webview', () => { const R = require('react'); const { View } = require('react-native'); return { WebView: (p: any) => R.createElement(View, { testID: 'osm' }) }; });
jest.mock('expo-blur', () => {
  const R = require('react'); const { View } = require('react-native');
  return { BlurView: (p: any) => R.createElement(View, p) };
});
jest.mock('react-native-safe-area-context', () => {
  const R = require('react');
  const inset = { top: 47, right: 0, bottom: 34, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    SafeAreaInsetsContext: R.createContext(inset),
    SafeAreaFrameContext: R.createContext(frame),
    initialWindowMetrics: { insets: inset, frame },
  };
});

// Render the real navigator, but let the test drive it.
const mockNavRef = createNavigationContainerRef<any>();
jest.mock('@react-navigation/native', () => {
  const R = require('react');
  const actual = jest.requireActual('@react-navigation/native');
  return { ...actual, NavigationContainer: (p: any) => R.createElement(actual.NavigationContainer, { ...p, ref: mockNavRef }) };
});
const ref = mockNavRef;

import RootNavigation from '../src/core/navigation';
import { SessionProvider } from '../src/core/store';

const ROUTES: [string, any?][] = [
  ['Hosgeldin'],
  ['Tabs', { screen: 'Kesfet' }],
  ['Tabs', { screen: 'Harita' }],
  ['Tabs', { screen: 'Harita', params: { filter: 'halisaha' } }],
  ['Tabs', { screen: 'Kampus', params: { tab: 'program' } }],
  ['Tabs', { screen: 'Kampus', params: { tab: 'calisma' } }],
  ['Tabs', { screen: 'Kampus', params: { tab: 'etkinlik' } }],
  ['Tabs', { screen: 'Kampus', params: { tab: 'notlar' } }],
  ['Tabs', { screen: 'Profil' }],
  ['HizliEsles'],
  ['Lobi', { venueId: 'arena', tableId: 't1' }],
  ['Lobi', { venueId: 'sahinler', tableId: 't4' }],
  ['Sohbet'],
  ['Olustur'],
  ['Olustur', { venueId: 'gezegen', audience: 'kadin' }],
  ['Mekan', { id: 'arena' }],
  ['Mekan', { id: 'wembley' }],
  ['Dogrulama'],
  ['Degerlendir'],
  ['Sikayet', { name: 'Serkan Y.' }],
  ['Masalarim'],
  ['Sohbetler'],
  ['Moduller'],
  ['Firsatlar'],
  ['NotDetay', { id: 'n4' }],
  ['Ekipler'],
  ['Lig'],
  ['QrCheckin', { venueId: 'arena' }],
  ['Kayit', { method: 'telefon' }],
  ['Kayit', { method: 'apple' }],
  ['Ayarlar'],
  ['Yasal', { doc: 'kvkk' }],
  ['Yasal', { doc: 'kosullar' }],
  ['Yasal', { doc: 'topluluk' }],
  ['Moderasyon'],
  ['IsletmePaneli'],
  ['KulupPaneli'],
  ['DiscordBagla'],
  ['Kayit', { only: 'eposta' }],
  ['Lobi', { mine: { game: 'Valorant', need: 2, total: 5, time: 'Bu akşam 21:30', level: 'Orta', discord: 'https://discord.gg/orti' } }],
  ['Lobi', { mine: { game: 'Okey', need: 1, total: 4, time: 'Şimdi', level: 'Her seviye', venueId: 'arena' } }],
];

beforeAll(() => { jest.useFakeTimers(); });

describe('Tüm ekranlar açılıyor (native renderer)', () => {
  it.each(ROUTES.map(([r, p]) => [`${r}${p ? ' ' + JSON.stringify(p) : ''}`, r, p]))('%s', async (_label, route, params) => {
    const errors: string[] = [];
    const spy = jest.spyOn(console, 'error').mockImplementation((...a) => { errors.push(a.map(String).join(' ')); });
    const r: any = await render(<SessionProvider><RootNavigation /></SessionProvider>);
    await act(async () => { jest.advanceTimersByTime(50); });
    await act(async () => { (ref.navigate as (...a: unknown[]) => void)(route, params); jest.advanceTimersByTime(3000); });
    expect(ref.getCurrentRoute()).toBeTruthy();
    expect(r.toJSON()).toBeTruthy();
    expect(ref.getCurrentRoute()?.name).toBe(params?.screen ?? route);
    spy.mockRestore();
    const real = errors.filter((e) => !/act\(|not wrapped|useNativeDriver|Animated/.test(e));
    expect(real).toEqual([]);
  });
});
