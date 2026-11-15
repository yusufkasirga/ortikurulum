# Orti

Oyun ve kampüs arkadaşı bulma uygulaması — Expo (React Native), iOS + Android. Pilot: Kayseri / Talas (ERÜ).

## Klasör yapısı
```
src/
  core/         theme, navigation, store (oturum + modül ayarları), modules (modül kaydı), useOpenModule
  components/   ortak arayüz: ui (T, Tap, butonlar…), Icon, ModuleTile, VenueMap (.web)
  modules/
    kesfet/     ana sayfa
    oyun/       Hızlı Eşleş, masa (Lobi), masa aç, sohbet, QR check-in, puanlama, şikayet, ekipler, lig
    mekan/      harita, mekan detayı, fırsatlar, venues.ts (Talas mekan verisi)
    kampus/     program, kütüphane arkadaşı, etkinlikler, ders notları (+ detay)
    hesap/      hoş geldin, profil, kimlik doğrulama, modüller
```
Yeni bir özellik = `src/modules/<alan>/` altında ekran + `core/modules.ts` içinde bir kayıt.

## Çalıştırma
- `npm install` → `npx expo start` → telefonda Expo Go ile aç.

## Derleme
- Android APK: `main` dalına push → GitHub Actions → Releases (`orti.apk`). Harita için `GOOGLE_MAPS_API_KEY` secret'ı gerekir.
- iPhone önizleme: `preview` dalına push → Releases'ta Expo Go linki (`EXPO_TOKEN` secret'ı gerekir).

## Veri notları
- Mekan isim/konum/puanları prototip için Google Haritalar'dan alındı; canlıda Places API ile anlık çekilmeli (saklanmamalı).
- Kampanyalar, partner rozetleri, etkinlikler, notlar ve masalar örnek veridir.
