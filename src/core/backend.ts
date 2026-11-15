import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Live backend switch. When EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set at build
 * time the app talks to Supabase (schema: supabase/migrations). Otherwise it runs on demo data.
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isLive = !!(url && anon);

export const supabase: SupabaseClient | null = isLive
  ? createClient(url!, anon!, { auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false } })
  : null;

/** Phone sign-in. Demo mode accepts any 6-digit code. */
export async function sendOtp(phone: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  const { error } = await supabase.auth.signInWithOtp({ phone });
  return { ok: !error, error: error?.message };
}

export async function verifyOtp(phone: string, token: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: /^\d{6}$/.test(token) };
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  return { ok: !error, error: error?.message };
}

/** Student e-mail: magic link to the university address. Demo mode accepts any address on the domain. */
export async function sendStudentMail(email: string): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  const { error } = await supabase.auth.updateUser({ email });
  return { ok: !error, error: error?.message };
}

export async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: true };
  const { error } = await supabase.rpc('delete_my_account');
  if (!error) await supabase.auth.signOut();
  return { ok: !error, error: error?.message };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

/** Discord account linking. Live: Supabase OAuth identity link (provider "discord", scope identify only). */
export async function linkDiscord(): Promise<{ ok: boolean; url?: string; error?: string }> {
  if (!isLive || !supabase) return { ok: true };
  const { data, error } = await supabase.auth.linkIdentity({ provider: 'discord', options: { redirectTo: 'orti://auth/discord', scopes: 'identify', skipBrowserRedirect: true } });
  return error ? { ok: false, error: error.message } : { ok: true, url: data?.url ?? undefined };
}

export const DISCORD_INVITE = /^(https?:\/\/)?(www\.)?(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]{2,32}\/?$/;
export const normalizeInvite = (s: string) => {
  const t = s.trim();
  return /^https?:\/\//.test(t) ? t : `https://${t}`;
};
