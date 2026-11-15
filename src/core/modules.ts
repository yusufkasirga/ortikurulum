import type { IconName } from '../components/Icon';

/**
 * Module registry. Every feature area is a module that can be switched on/off
 * per user (Modüller screen) and, later, per university (campus config from backend).
 */
export type ModuleId =
  | 'eslesme' | 'masaac' | 'harita' | 'halisaha' | 'firsatlar'
  | 'program' | 'kutuphane' | 'etkinlik' | 'notlar' | 'sohbet' | 'guvenlik' | 'ekipler' | 'lig';

export type ModuleGroup = 'Oyun & sosyal' | 'Kampüs' | 'Hesap';

export type Target =
  | { kind: 'screen'; name: 'HizliEsles' | 'Olustur' | 'Sohbetler' | 'Dogrulama' | 'Firsatlar' | 'Ekipler' | 'Lig' }
  | { kind: 'tab'; name: 'Harita'; filter?: 'halisaha' }
  | { kind: 'kampus'; tab: 'program' | 'calisma' | 'etkinlik' | 'notlar' };

export type AppModule = {
  id: ModuleId;
  title: string;
  sub: string;
  icon: IconName;
  color: string; // tile background
  ink: string; // text on tile
  group: ModuleGroup;
  target: Target;
  locked?: boolean; // cannot be turned off
};

export const MODULES: AppModule[] = [
  { id: 'eslesme', title: 'Hızlı Eşleş', sub: '30 saniyede masaya otur', icon: 'bolt', color: '#FFC83D', ink: '#241200', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'HizliEsles' }, locked: true },
  { id: 'harita', title: 'Mekan haritası', sub: 'Okey, PS, bilardo, kafe', icon: 'map', color: '#6D4AFF', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'tab', name: 'Harita' }, locked: true },
  { id: 'masaac', title: 'Masa aç', sub: 'Eksiğini tamamla', icon: 'plus', color: '#14A44D', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'Olustur' }, locked: true },
  { id: 'ekipler', title: 'Ekiplerim', sub: 'Tekrar oynadıkların', icon: 'person', color: '#FFE3E8', ink: '#8A1450', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'Ekipler' } },
  { id: 'lig', title: 'Talas Okey Ligi', sub: 'Sıralama · ödül', icon: 'tiles', color: '#0B5C2B', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'Lig' } },
  { id: 'halisaha', title: 'Halı saha', sub: 'Takımını tamamla', icon: 'ball', color: '#0EA5A4', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'tab', name: 'Harita', filter: 'halisaha' } },
  { id: 'firsatlar', title: 'Fırsatlar', sub: 'Mekan kampanyaları', icon: 'tag', color: '#FF6B5B', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'Firsatlar' } },
  { id: 'sohbet', title: 'Sohbetler', sub: 'Masa grupların', icon: 'chat', color: '#1E293B', ink: '#FFFFFF', group: 'Oyun & sosyal', target: { kind: 'screen', name: 'Sohbetler' } },
  { id: 'program', title: 'Ders programı', sub: 'Boş saatine masa', icon: 'calendar', color: '#BDEBFF', ink: '#062F40', group: 'Kampüs', target: { kind: 'kampus', tab: 'program' } },
  { id: 'kutuphane', title: 'Kütüphane arkadaşı', sub: 'Yanına biri otursun', icon: 'book', color: '#0A7FB0', ink: '#FFFFFF', group: 'Kampüs', target: { kind: 'kampus', tab: 'calisma' } },
  { id: 'etkinlik', title: 'Etkinlikler', sub: 'Birlikte gidelim', icon: 'star', color: '#E8398A', ink: '#FFFFFF', group: 'Kampüs', target: { kind: 'kampus', tab: 'etkinlik' } },
  { id: 'notlar', title: 'Ders notları', sub: 'Özet, çıkmış soru', icon: 'menu', color: '#F2711C', ink: '#FFFFFF', group: 'Kampüs', target: { kind: 'kampus', tab: 'notlar' } },
  { id: 'guvenlik', title: 'Güvenli oyun', sub: 'Kimlik ve kadın masaları', icon: 'shield', color: '#DDF5E4', ink: '#0B5C2B', group: 'Hesap', target: { kind: 'screen', name: 'Dogrulama' } },
];

export const DEFAULT_ENABLED: Record<ModuleId, boolean> = Object.fromEntries(MODULES.map((m) => [m.id, true])) as Record<ModuleId, boolean>;
