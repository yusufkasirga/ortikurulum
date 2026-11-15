import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './backend';

export type NotifKey = 'masa' | 'bosSaat' | 'ekip' | 'etkinlik' | 'kampanya';

export const NOTIF_LABELS: Record<NotifKey, { title: string; sub: string }> = {
  masa: { title: 'Masa güncellemeleri', sub: 'Onay, hatırlatma, sohbet' },
  bosSaat: { title: 'Boş saat önerileri', sub: 'Ders programına göre uygun masalar' },
  ekip: { title: 'Ekip çağrıları', sub: '“Bu akşam var mısınız?”' },
  etkinlik: { title: 'Etkinlikler', sub: 'Kulüp etkinlikleri ve eşleşmeler' },
  kampanya: { title: 'Mekan kampanyaları', sub: 'Reklam içerir, varsayılan kapalı' },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

export async function setupAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('masa', { name: 'Masa güncellemeleri', importance: 4 /* AndroidImportance.HIGH */ }).catch(() => {});
  }
}

/** Ask once, at the moment it is useful (onboarding step), never at cold start. */
export async function requestPermission(): Promise<boolean> {
  try {
    const cur = await Notifications.getPermissionsAsync();
    if (cur.granted) return true;
    const res = await Notifications.requestPermissionsAsync();
    return res.granted;
  } catch {
    return false;
  }
}

/** Registers the Expo push token on the profile (live mode, physical device only). */
export async function registerPushToken() {
  if (!supabase || !Device.isDevice) return;
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    const { data: u } = await supabase.auth.getUser();
    if (u.user) await supabase.from('profiles').update({ push_token: data }).eq('id', u.user.id);
  } catch {
    // ignore: push is optional
  }
}

/** Local notification (demo of what the server will push). Respects the user's per-type preference. */
export async function notify(kind: NotifKey, enabled: Record<NotifKey, boolean>, title: string, body: string, inSeconds = 1) {
  if (!enabled[kind]) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: inSeconds, channelId: 'masa' },
    });
  } catch {
    // web / permissions denied
  }
}
