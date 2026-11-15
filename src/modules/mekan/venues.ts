/**
 * Talas (Kayseri) pilot venue registry.
 *
 * Source notes — read before going live:
 * - Names, coordinates, opening hours and the Google rating were looked up on Google Maps (Nov 2026)
 *   for the prototype only. Google's terms do not allow storing Places data in our own database:
 *   in production keep only `googlePlaceId` and fetch rating/hours live via the Places API,
 *   or re-survey coordinates (OpenStreetMap / field visit).
 * - Every amenity carries a `src`: 'yorum' = stated in public user reviews, 'isim' = implied by the
 *   venue's own name/category, undefined = unknown. Unknown fields are shown as unknown in the UI and
 *   are meant to be filled by venue owners (partner panel) and by players ("Bilgiyi düzelt").
 * - `tables` (who is looking for whom) is demo data until the backend exists.
 */

export type VenueCat = 'okey' | 'playstation' | 'bilardo' | 'kafe' | 'halisaha' | 'bowling';

export type Smoking = 'kapali-serbest' | 'acik-alan' | 'dumansiz' | 'bilinmiyor';

export type SourcedValue<T> = { value: T; src?: 'yorum' | 'isim' | 'isletme' };

export type OpenTable = {
  id: string;
  game: string;
  need: number;
  total: number;
  time: string;
  host: string;
  hostTrust: number;
  womenOnly?: boolean;
  level?: string;
};

export type Venue = {
  id: string;
  name: string;
  cat: VenueCat;
  lat: number;
  lng: number;
  area: string;
  hours: string;
  games: SourcedValue<string>[];
  smoking: SourcedValue<Smoking>;
  hookah?: SourcedValue<boolean>;
  prices: { label: string; value: string; src: 'yorum' | 'isletme' }[];
  highlights: string[];
  warnings: string[];
  google?: { rating: number; count: number; placeId: string };
  partner?: boolean;
  /** Paid/partner placement. Must always be labelled as advertising in the UI. Offers are DEMO copy until signed. */
  featured?: { offer: string; detail: string };
  tables: OpenTable[];
};

export const CAT_META: Record<VenueCat, { label: string; color: string; tint: string; ink: string; icon: 'tiles' | 'gamepad' | 'cue' | 'cup' | 'ball' | 'bowling' }> = {
  okey: { label: 'Okey salonu', color: '#14A44D', tint: '#E1F7E8', ink: '#0B5C2B', icon: 'tiles' },
  playstation: { label: 'PlayStation', color: '#6D4AFF', tint: '#ECE7FF', ink: '#3A1FB0', icon: 'gamepad' },
  bilardo: { label: 'Bilardo', color: '#1E293B', tint: '#E4E8EF', ink: '#1E293B', icon: 'cue' },
  kafe: { label: 'Kafe · kutu oyunu', color: '#F2711C', tint: '#FFEBDC', ink: '#8A3A05', icon: 'cup' },
  halisaha: { label: 'Halı saha', color: '#0EA5A4', tint: '#DBF5F4', ink: '#05605F', icon: 'ball' },
  bowling: { label: 'Bowling', color: '#E8398A', tint: '#FDE3EF', ink: '#8A1450', icon: 'bowling' },
};

export const SMOKING_LABEL: Record<Smoking, string> = {
  'kapali-serbest': 'İçeride sigara içiliyor',
  'acik-alan': 'Sigara sadece açık alanda',
  dumansiz: 'Dumansız mekan',
  bilinmiyor: 'Sigara durumu bilinmiyor',
};

/** Centre of the pilot map: Talas, between ERÜ campus and Mevlana / Yenidoğan student streets. */
export const PILOT_REGION = { latitude: 38.7025, longitude: 35.5525, latitudeDelta: 0.032, longitudeDelta: 0.032 };
export const CAMPUS = { name: 'Erciyes Üniversitesi', lat: 38.7093, lng: 35.5361 };

const g = (v: string, src: 'yorum' | 'isim' = 'isim'): SourcedValue<string> => ({ value: v, src });

export const VENUES: Venue[] = [
  {
    id: 'arena', name: 'Arena Premium Okey & Cafe', cat: 'okey', lat: 38.7114525, lng: 35.5527006, area: 'Mevlana · 15 Temmuz Cd.',
    hours: '12:00–02:00 (hafta sonu 14:00)', games: [g('Okey')],
    smoking: { value: 'kapali-serbest', src: 'yorum' },
    prices: [{ label: 'Masa ücreti', value: 'Var (bir yorumda oturduktan sonra söylendiği belirtilmiş)', src: 'yorum' }],
    highlights: ['Akıllı okey masaları', 'Öğrenci ve aile kitlesi'], warnings: ['Bazı yorumlarda havasız ve sigara kokulu'],
    google: { rating: 3.8, count: 33, placeId: 'ChIJ4W6Tu-UTKxURZrCM4MpTd9M' }, partner: true,
    featured: { offer: 'Orti’den gelen masaya ilk çaylar ikram', detail: 'Masada QR’ı okut, garsona göster. Hafta içi her gün.' },
    tables: [
      { id: 't1', game: '101 Okey', need: 1, total: 4, time: 'Bugün 21:30', host: 'Mehmet K.', hostTrust: 98, level: 'Orta' },
      { id: 't2', game: 'Okey (eşli)', need: 2, total: 4, time: 'Yarın 20:00', host: 'Burak T.', hostTrust: 93 },
    ],
  },
  {
    id: 'ruzgarli', name: 'Rüzgarlı Cafe & Okey Salonu', cat: 'bilardo', lat: 38.69212, lng: 35.549546, area: 'Bahçelievler · Rüzgarlı Cd.',
    hours: '08:30–01:00', games: [g('Okey'), g('Bilardo', 'yorum')],
    smoking: { value: 'kapali-serbest', src: 'yorum' },
    prices: [{ label: 'Bilardo', value: 'Bir yorumda 180 TL/saat', src: 'yorum' }],
    highlights: ['Bahçe', 'Okey + bilardo bir arada'], warnings: ['Son yorumlarda bilardo salonunun bakımsız olduğu söyleniyor'],
    google: { rating: 4.2, count: 135, placeId: 'ChIJe8kmUl8NKxURFxn6TbYN6Ag' },
    tables: [{ id: 't3', game: 'Bilardo · 8 top', need: 1, total: 2, time: '40 dk sonra', host: 'Tolga E.', hostTrust: 91 }],
  },
  {
    id: 'sahinler', name: 'Şahinler Cafe & Aile Okey Salonu', cat: 'okey', lat: 38.7011233, lng: 35.5425906, area: 'Yenidoğan · Çimenli Cd.',
    hours: '07:00–23:30', games: [g('Okey')], smoking: { value: 'bilinmiyor' },
    prices: [], highlights: ['Ayrı aile bölümü', 'Uygun fiyat (yorumlar)'], warnings: [],
    google: { rating: 4.8, count: 37, placeId: 'ChIJcfwhk5gSKxUR5YrWiXZ_oMQ' },
    tables: [{ id: 't4', game: '101 Okey', need: 1, total: 4, time: 'Bugün 20:00', host: 'Elif A.', hostTrust: 96, womenOnly: true }],
  },
  {
    id: 'maxgarden', name: 'MaxGarden Cafe & Aile Okey Salonu', cat: 'okey', lat: 38.6869829, lng: 35.5571735, area: 'Kiçiköy · Gonca Sk.',
    hours: '12:00–02:00', games: [g('Okey'), g('Çeşitli masa oyunları', 'yorum')], smoking: { value: 'bilinmiyor' },
    hookah: { value: true, src: 'yorum' },
    prices: [{ label: 'Masa ücreti', value: 'Reklamda "yok" deniyor; yorumlarda fiyatların reklamın üstünde olduğu yazılmış', src: 'yorum' }],
    highlights: ['Geniş, çok katlı', 'Aile ortamı'], warnings: ['Fiyat/ilan tutarsızlığı şikayetleri'],
    google: { rating: 4.2, count: 47, placeId: 'ChIJl0_j94YNKxURtvpkGIiusWM' }, tables: [],
  },
  {
    id: 'bahcelievler-okey', name: 'Talas Bahçelievler Okey Salonu', cat: 'okey', lat: 38.688957, lng: 35.552801, area: 'Bahçelievler Cd.',
    hours: '08:00–02:00', games: [g('Okey')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Temiz, hızlı servis (yorumlar)'], warnings: ['Bir yorumda yaş ortalamasının yüksek olduğu söyleniyor'],
    google: { rating: 4.2, count: 5, placeId: 'ChIJjyAT984NKxURm1lF9mshzTA' }, tables: [],
  },
  {
    id: 'sade', name: 'Sade Vip Lounge', cat: 'okey', lat: 38.7056419, lng: 35.5555228, area: 'Mevlana · 6076. Sk.',
    hours: '10:00–02:00', games: [g('Okey', 'yorum'), g('PlayStation', 'yorum')], smoking: { value: 'bilinmiyor' },
    hookah: { value: true, src: 'yorum' }, prices: [],
    highlights: ['Üst katta VIP odalar', 'Yemekleri övülüyor', 'Öğrencilerin takıldığı yeni bir mekan'], warnings: [],
    google: { rating: 4.8, count: 51, placeId: 'ChIJ6bgdLpETKxURZ9iO8prGW-M' }, partner: true,
    featured: { offer: 'PlayStation saatlik ücretinde öğrenciye %15', detail: 'Öğrenci kartını göstermen yeterli. 14:00–18:00 arası.' },
    tables: [{ id: 't5', game: 'EA FC · 1v1', need: 1, total: 2, time: 'Şimdi', host: 'Cem Y.', hostTrust: 89 }],
  },
  {
    id: 'winners', name: 'Winners Cafe & Oyun Salonu', cat: 'okey', lat: 38.7015483, lng: 35.5476374, area: 'Yenidoğan · Keşkül Sk.',
    hours: '13:00–01:00', games: [g('Oyun salonu')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Yorumlarda fiyatlar piyasaya göre uygun'], warnings: [],
    google: { rating: 4.2, count: 98, placeId: 'ChIJtQfztBATKxURvn_dJX1EHQc' }, tables: [],
  },
  {
    id: 'latibule', name: 'Latibule Coffee', cat: 'kafe', lat: 38.6932248, lng: 35.5473256, area: 'Bahçelievler · Atatürk Blv.',
    hours: '09:00–00:00', games: [g('Kutu oyunları (ücretsiz)', 'yorum')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Sakin, ders çalışmaya uygun', 'Kahvesi övülüyor'], warnings: [],
    google: { rating: 4.8, count: 57, placeId: 'ChIJTV6Ac-0NKxUR3_6mSVZbPlM' },
    featured: { offer: 'Perşembe 20:00 kutu oyunu gecesi', detail: 'Oyunları ekip anlatıyor, yeni gelenlere masa ayarlanıyor.' },
    tables: [{ id: 't6', game: 'Catan', need: 2, total: 4, time: 'Bugün 19:30', host: 'Zeynep S.', hostTrust: 97, level: 'Yeni başlayana açık' }],
  },
  {
    id: 'elua', name: 'ELUA Coffee', cat: 'kafe', lat: 38.693705, lng: 35.544884, area: 'Bahçelievler · Atatürk Blv.',
    hours: '09:00–03:00', games: [g('Kutu oyunları', 'yorum')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Üst katta çalışma alanı', 'Gece 03:00’e kadar açık'], warnings: [],
    google: { rating: 4.8, count: 118, placeId: 'ChIJlc4oYjcNKxURJyeb2EGxxgw' }, tables: [],
  },
  {
    id: 'lava', name: 'The Lava Coffee Talas', cat: 'kafe', lat: 38.697777, lng: 35.5409106, area: 'Yenidoğan · Deliçay 1. Sk.',
    hours: '12:00–01:00', games: [g('Geniş oyun çeşidi', 'yorum')], smoking: { value: 'kapali-serbest', src: 'yorum' },
    prices: [{ label: 'Minimum harcama', value: 'Yorumlara göre kişi başı ~150–200 TL', src: 'yorum' }],
    highlights: ['Oyun çeşidi geniş'], warnings: ['Minimum harcama kuralı şikayetleri'],
    google: { rating: 3.6, count: 241, placeId: 'ChIJWzeAcT0TKxURoY_BRy2sWps' }, tables: [],
  },
  {
    id: 'seksenler', name: 'Seksenler', cat: 'kafe', lat: 38.7010265, lng: 35.5498399, area: 'Yenidoğan · Yaprak Cd.',
    hours: '10:00–02:00', games: [], smoking: { value: 'kapali-serbest', src: 'yorum' }, prices: [],
    highlights: ['Masalar arası mesafe geniş (bazı yorumlar)'], warnings: ['Kalabalık saatlerde sıkışık (bazı yorumlar)'],
    google: { rating: 4.4, count: 742, placeId: 'ChIJA3NaKlITKxURgoirakONnzk' }, tables: [],
  },
  {
    id: 'quakka', name: 'Quakka Coffee Shop', cat: 'kafe', lat: 38.7044404, lng: 35.5519904, area: 'Mevlana · Bilge Kağan Cd.',
    hours: '08:30–01:30', games: [], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Self servis, uygun fiyat seviyesi'], warnings: [],
    google: { rating: 4.4, count: 415, placeId: 'ChIJj-EfkcwTKxURjwlUHlsv33g' }, tables: [],
  },
  {
    id: 'acacia', name: 'Acacia Co.ffee', cat: 'kafe', lat: 38.7010764, lng: 35.5498442, area: 'Yenidoğan',
    hours: '09:30–01:30', games: [], smoking: { value: 'kapali-serbest', src: 'yorum' }, prices: [],
    highlights: ['Geniş ve sakin'], warnings: ['Havalandırma için camlar açılıyor, kışın üşütebilir (yorum)'],
    google: { rating: 4.4, count: 283, placeId: 'ChIJF2IAcAsTKxURhLvDbGvBKV8' }, tables: [],
  },
  {
    id: 'bigwont', name: 'Big Wont Cafe & Bowling', cat: 'bowling', lat: 38.7100776, lng: 35.554078, area: 'Mevlana · 15 Temmuz Cd.',
    hours: '09:00–00:00', games: [g('Bowling')], smoking: { value: 'bilinmiyor' }, hookah: { value: true, src: 'isim' }, prices: [],
    highlights: ['Kampüse en yakın bowling'], warnings: [],
    google: { rating: 4.0, count: 1279, placeId: 'ChIJPWat78cSKxUR-5LDV2qndu8' },
    tables: [{ id: 't7', game: 'Bowling', need: 2, total: 6, time: 'Cuma 21:00', host: 'Ali K.', hostTrust: 95 }],
  },
  {
    id: 'alfa', name: 'Alfa E-Spor & PlayStation', cat: 'playstation', lat: 38.7022082, lng: 35.5646783, area: 'Mevlana · Cemil Baba Cd.',
    hours: '10:00–05:00', games: [g('PlayStation'), g('E-spor PC')], smoking: { value: 'bilinmiyor' },
    prices: [{ label: 'PlayStation', value: 'Bir yorumda 95 TL/saat, VIP oda ~125–130 TL', src: 'yorum' }],
    highlights: ['VIP odalar', 'İkram çay', 'Sabah 05:00’e kadar açık'], warnings: [],
    google: { rating: 4.2, count: 48, placeId: 'ChIJIdTGL4UTKxURz5qo0v02CMM' },
    featured: { offer: 'Gece 00:00 sonrası 2 saat al, 3 saat oyna', detail: 'E-spor PC ve PlayStation odalarında geçerli.' },
    tables: [{ id: 't8', game: 'Valorant · 5’li', need: 2, total: 5, time: 'Bugün 23:00', host: 'Kaan D.', hostTrust: 92, level: 'Altın+' }],
  },
  {
    id: 'lost3', name: 'Lost 3 PlayStation', cat: 'playstation', lat: 38.7065353, lng: 35.5653305, area: 'Mevlana · Anayurt Cd.',
    hours: '11:30–02:00', games: [g('PlayStation')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Klimalı, yeni kollar (yorumlar)'], warnings: [],
    google: { rating: 4.7, count: 82, placeId: 'ChIJp7rwIchtKxUR9Z__7UmbRkk' }, tables: [],
  },
  {
    id: 'infinity', name: 'Infinity Game Lounge', cat: 'playstation', lat: 38.7119859, lng: 35.560711, area: 'Mevlana · Taslak Sk.',
    hours: '13:00–03:00', games: [g('PlayStation 5', 'yorum')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Geniş özel odalar'], warnings: [],
    google: { rating: 4.8, count: 21, placeId: 'ChIJy1ScDMETKxUR15XF_LT0AzI' }, tables: [],
  },
  {
    id: 'maco', name: 'Maço PlayStation Cafe', cat: 'playstation', lat: 38.7126159, lng: 35.5587836, area: 'Mevlana · Karasu Cd.',
    hours: '10:30–03:00', games: [g('PlayStation')], smoking: { value: 'bilinmiyor' }, prices: [],
    highlights: ['Fiyat/performans iyi (yorumlar)'], warnings: [],
    google: { rating: 4.6, count: 75, placeId: 'ChIJyTm8lfITKxURzx3gPRrL07I' }, tables: [],
  },
  {
    id: 'peshane', name: 'Peshane PlayStation Cafe', cat: 'playstation', lat: 38.7044397, lng: 35.5627122, area: 'Mevlana · Cemil Baba Cd.',
    hours: '12:00–02:00', games: [g('PlayStation')], smoking: { value: 'bilinmiyor' }, hookah: { value: true, src: 'yorum' }, prices: [],
    highlights: ['Müdavimleri çok'], warnings: ['Odaların havalandırması yetersiz (bir yorum)'],
    google: { rating: 4.3, count: 103, placeId: 'ChIJR4EpqbUSKxURYBAtaaiyVhc' }, tables: [],
  },
  {
    id: 'gezegen', name: 'Gezegen Halı Saha', cat: 'halisaha', lat: 38.6979243, lng: 35.5470487, area: 'Yenidoğan · Orkide Sk.',
    hours: '09:00–00:00', games: [g('Halı saha')], smoking: { value: 'acik-alan', src: 'isim' }, prices: [],
    highlights: ['İki kamerayla maç kaydı', 'Zemin iyi (yorumlar)'], warnings: ['Kiralık kramponlar kötü (yorum)'],
    google: { rating: 3.7, count: 150, placeId: 'ChIJ42rl_yITKxURPDhCPMO7NGo' },
    featured: { offer: 'Hafta içi 14:00–17:00 öğrenci tarifesi', detail: 'Maç kaydı dahil. Takımın eksikse Orti’den tamamla.' },
    tables: [{ id: 't9', game: 'Halı saha · 7v7', need: 3, total: 14, time: 'Yarın 20:00', host: 'Ali K.', hostTrust: 95 }],
  },
  {
    id: 'eru-saha', name: 'ERÜ 15 Temmuz Kampüs Sahası', cat: 'halisaha', lat: 38.7132459, lng: 35.5543094, area: 'Kampüs · Mevlana',
    hours: '—', games: [g('Halı saha')], smoking: { value: 'acik-alan', src: 'isim' }, prices: [],
    highlights: ['Kampüs içi'], warnings: [],
    google: { rating: 4.6, count: 22, placeId: 'ChIJdfPZGsYSKxURL3I1u_QcV-I' }, tables: [],
  },
  {
    id: 'wembley', name: 'Wembley Halı Saha', cat: 'halisaha', lat: 38.6959978, lng: 35.5305181, area: 'Erenköy · Melikgazi',
    hours: '24 saat', games: [g('Halı saha')], smoking: { value: 'acik-alan', src: 'isim' }, prices: [],
    highlights: ['Maçlar kaydediliyor', 'Büfe uygun (yorumlar)'], warnings: ['Yenileme gerektiği söyleniyor'],
    google: { rating: 3.9, count: 354, placeId: 'ChIJFxXD-nwNKxURcoIxaCOsAXg' }, tables: [],
  },
];

export const FEATURED = VENUES.filter((v) => v.featured);

export const venueById = (id?: string) => VENUES.find((v) => v.id === id);

export function distanceKm(lat: number, lng: number, from = CAMPUS) {
  const R = 6371;
  const dLat = ((lat - from.lat) * Math.PI) / 180;
  const dLng = ((lng - from.lng) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((from.lat * Math.PI) / 180) * Math.cos((lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export const fmtKm = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`);
