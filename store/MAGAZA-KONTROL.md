# Orti — Mağaza yayın kontrol listesi

Kısa metinler, açıklama ve inceleme notları: `store.config.json` (App Store, `eas metadata:push` ile yüklenir) ve `store/google-play-aciklama.txt`.
Herkese açık sayfalar (GitHub Pages): https://yusufkasirga.github.io/ortikurulum/

| Sayfa | Adres | Nerede istenir |
| --- | --- | --- |
| Gizlilik politikası | /gizlilik.html | App Store Connect, Google Play |
| Hesap silme | /hesap-silme.html | Google Play › Veri güvenliği |
| Destek | /destek.html | App Store Connect |
| Kullanım koşulları | /kosullar.html | Uygulama içi ve mağaza |

## Yayından önce mutlaka

1. Supabase canlı ortam: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` EAS ortam değişkeni olarak eklenmeli. Demo veriyle gönderilen uygulama Apple 2.1 (eksik uygulama) gerekçesiyle reddedilir.
2. İnceleme hesabı: Supabase Auth › Phone › Test numbers: `905320000000` → `123456`.
3. Yasal metinlerdeki [ŞİRKET UNVANI], [ADRES], [KVKK E-POSTA], [DESTEK E-POSTA] doldurulmalı, avukat onayı alınmalı.
4. Sign in with Apple: Apple Developer › Identifiers › app.orti.mobile › “Sign In with Apple” açık olmalı (EAS Build otomatik açar). Canlıda token Supabase `signInWithIdToken` ile doğrulanır.
5. Moderasyon: şikayetlere 24 saat içinde yanıt verecek bir kişi atanmalı (Apple 1.2).
6. Yönetim panelleri uygulamada gizli; canlıda rol (`profiles.role`) ile açılmalı.

## Apple — App Privacy (gizlilik etiketleri)

| Veri | Toplanıyor | Kimliğe bağlı | İzleme | Amaç |
| --- | --- | --- | --- | --- |
| Telefon numarası | Evet | Evet | Hayır | Uygulama işlevi, hesap |
| E-posta (öğrenci) | Evet | Evet | Hayır | Uygulama işlevi |
| Ad | Evet | Evet | Hayır | Uygulama işlevi |
| Kullanıcı içeriği (mesaj, not, puan) | Evet | Evet | Hayır | Uygulama işlevi |
| Kullanım verisi (ekran olayları) | Evet | Evet | Hayır | Analiz |
| Tanılama (çökme) | Evet | Hayır | Hayır | Analiz |
| Cihaz kimliği (bildirim anahtarı) | Evet | Evet | Hayır | Uygulama işlevi |
| Konum | Hayır (bu sürüm konum kullanmıyor) | – | – | – |

Yaş derecesi: 18+ (kullanıcılar arası sohbet, yabancılarla buluşma). Uygulama 18 yaş altını kabul etmiyor.

## Google Play — Veri güvenliği

- Toplanan: telefon numarası, e-posta, ad, mesajlar, uygulama etkileşimleri, çökme kayıtları, cihaz kimliği.
- Paylaşılan: yok (hizmet sağlayıcılar hariç).
- Aktarım şifreli: evet (HTTPS). Kullanıcı silme talep edebilir: evet, uygulama içinden ve /hesap-silme.html.
- İçerik derecelendirmesi anketi: sosyal etkileşim ve kullanıcı içeriği “var”; şiddet, kumar, cinsellik “yok”.
- Hedef kitle: 18 yaş ve üzeri. Reklam içeriyor: hayır (kampanyalar uygulama içi “Reklam” etiketli mekan teklifleridir, reklam SDK’sı yok).

## Hesaplar ve anahtarlar

| Gereken | Kimde | Nereye girilir |
| --- | --- | --- |
| Apple Developer Program (yıllık 99 $) | Yusuf | developer.apple.com |
| App Store Connect’te “Orti” uygulama kaydı, bundle id `app.orti.mobile` | Yusuf | `eas.json › submit.production.ios.ascAppId` |
| App Store Connect API anahtarı (.p8) | Yusuf | expo.dev › Credentials (repo’ya koyma) |
| Google Play Console (tek seferlik 25 $) | Yusuf | play.google.com/console |
| Play servis hesabı JSON | Yusuf | expo.dev › Credentials › Google Service Account |
| Google Maps anahtarı (isteğe bağlı) | Yusuf | expo.dev › Environment variables › `GOOGLE_MAPS_API_KEY` |
| `EXPO_TOKEN` | Hazır | GitHub secrets |

## Derleme ve gönderim

GitHub › Actions › “Mağaza derlemesi” › Run workflow:
- `android` → Play için imzalı AAB (EAS anahtarı kendisi üretir ve saklar), ilk sürüm Play Console’a elle yüklenir, sonrakiler `submit: true` ile otomatik.
- `ios` → App Store derlemesi; Apple kimlik bilgileri expo.dev’e bir kez tanımlandıktan sonra çalışır, `submit: true` ile TestFlight’a gider.

Uygulama içi küçük düzeltmeler mağaza onayı beklemeden: `npx eas-cli update --channel production`.
