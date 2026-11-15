import { supabase } from './backend';

/**
 * Product analytics + crash log. No personal data in props (no names, phone, messages).
 * Demo mode keeps a ring buffer in memory (shown in Ayarlar › Verilerimi indir); live mode also inserts into
 * public.app_events / public.app_errors.
 */
export type EventName =
  | 'onboarding_tamam' | 'kampus_secildi' | 'hizli_esles_ara' | 'eslesme_bulundu' | 'masa_istek' | 'masa_onay'
  | 'masa_acildi' | 'checkin_qr' | 'puan_gonderildi' | 'sikayet' | 'not_kaydet' | 'etkinlik_birlikte'
  | 'kutuphane_eslesme' | 'modul_ac' | 'modul_kapat' | 'kampanya_gor' | 'hesap_silindi'
  | 'discord_baglandi' | 'discord_kaldirildi' | 'discord_katil' | 'masa_paylas';

type Logged = { name: string; props: Record<string, string | number | boolean>; at: string };

const buffer: Logged[] = [];
const MAX = 200;

export function track(name: EventName, props: Logged['props'] = {}) {
  const e = { name, props, at: new Date().toISOString() };
  buffer.push(e);
  if (buffer.length > MAX) buffer.shift();
  if (supabase) supabase.from('app_events').insert({ name, props }).then(() => {}, () => {});
}

export function captureError(error: unknown, screen?: string) {
  const err = error instanceof Error ? error : new Error(String(error));
  if (__DEV__) console.warn('[orti] hata', screen, err.message);
  if (supabase) supabase.from('app_errors').insert({ message: err.message.slice(0, 500), stack: err.stack?.slice(0, 4000), screen }).then(() => {}, () => {});
}

export const recentEvents = () => [...buffer];
