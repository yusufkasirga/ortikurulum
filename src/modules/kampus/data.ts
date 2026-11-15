/**
 * Campus layer (ERÜ pilot): departments, the user's weekly timetable and shared course notes.
 * All demo data. Departments are assigned pseudo-randomly per person (stable per name) until
 * students verify with their @erciyes.edu.tr address and pick their own.
 */

export const BOLUMLER = [
  'Bilgisayar Mühendisliği', 'Makine Mühendisliği', 'Elektrik-Elektronik Müh.', 'İnşaat Mühendisliği',
  'Tıp', 'Diş Hekimliği', 'Eczacılık', 'Hukuk', 'İşletme', 'İktisat', 'Psikoloji', 'Mimarlık',
  'Endüstri Mühendisliği', 'Hemşirelik', 'Türk Dili ve Edebiyatı', 'Güzel Sanatlar',
];

/** Stable "random" department + year for a name, so the same person always shows the same one. */
export function bolumOf(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { bolum: BOLUMLER[h % BOLUMLER.length], sinif: (h % 4) + 1 };
}

export const ME_CAMPUS = { bolum: 'Bilgisayar Mühendisliği', sinif: 3 };

export const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'] as const;
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17] as const;

export type Lesson = { day: number; start: number; end: number; code: string; name: string; room: string; color: string };

export const MY_LESSONS: Lesson[] = [
  { day: 0, start: 9, end: 11, code: 'BM301', name: 'Veri Yapıları', room: 'MÜH-B204', color: '#6D4AFF' },
  { day: 0, start: 16, end: 18, code: 'BM305', name: 'İşletim Sistemleri', room: 'MÜH-A101', color: '#0EA5A4' },
  { day: 1, start: 10, end: 12, code: 'BM303', name: 'Veritabanı Sistemleri', room: 'MÜH-B110', color: '#F2711C' },
  { day: 1, start: 14, end: 16, code: 'MAT221', name: 'Olasılık ve İstatistik', room: 'FEN-A12', color: '#E8398A' },
  { day: 2, start: 9, end: 12, code: 'BM307', name: 'Bilgisayar Ağları', room: 'MÜH-LAB3', color: '#14A44D' },
  { day: 3, start: 13, end: 15, code: 'BM301', name: 'Veri Yapıları (Lab)', room: 'MÜH-LAB1', color: '#6D4AFF' },
  { day: 3, start: 15, end: 17, code: 'BM305', name: 'İşletim Sistemleri', room: 'MÜH-A101', color: '#0EA5A4' },
  { day: 4, start: 10, end: 12, code: 'TDE101', name: 'Türk Dili', room: 'ONLINE', color: '#A35200' },
];

/** Free windows (≥2h) between 09:00–18:00 for a weekday. */
export function freeWindows(day: number): { start: number; end: number }[] {
  const busy = MY_LESSONS.filter((l) => l.day === day).sort((a, b) => a.start - b.start);
  const out: { start: number; end: number }[] = [];
  let cur = 9;
  for (const l of busy) {
    if (l.start - cur >= 2) out.push({ start: cur, end: l.start });
    cur = Math.max(cur, l.end);
  }
  if (18 - cur >= 2) out.push({ start: cur, end: 18 });
  return out;
}

export const todayIndex = () => {
  const d = new Date().getDay(); // 0 Sun … 6 Sat
  return d >= 1 && d <= 5 ? d - 1 : 0;
};

export type Note = {
  id: string; course: string; code: string; title: string; author: string; bolum: string; sinif: number;
  pages: number; kind: 'El yazısı' | 'Özet' | 'Çıkmış sorular' | 'Formül kağıdı'; likes: number; saves: number; when: string; mine?: boolean;
};

export const NOTES: Note[] = [
  { id: 'n1', course: 'Veri Yapıları', code: 'BM301', title: 'Ağaçlar ve AVL — vize öncesi özet', author: 'Elif A.', bolum: 'Bilgisayar Mühendisliği', sinif: 3, pages: 14, kind: 'Özet', likes: 86, saves: 41, when: '2 gün önce' },
  { id: 'n2', course: 'Olasılık ve İstatistik', code: 'MAT221', title: 'Dağılımlar formül kağıdı', author: 'Kaan D.', bolum: 'Endüstri Mühendisliği', sinif: 2, pages: 2, kind: 'Formül kağıdı', likes: 152, saves: 97, when: '1 hafta önce' },
  { id: 'n3', course: 'Veritabanı Sistemleri', code: 'BM303', title: 'SQL join örnekleri (çözümlü)', author: 'Mehmet K.', bolum: 'Bilgisayar Mühendisliği', sinif: 4, pages: 9, kind: 'Özet', likes: 64, saves: 30, when: '3 gün önce' },
  { id: 'n4', course: 'İşletim Sistemleri', code: 'BM305', title: '2024–2025 vize soruları ve cevap anahtarı', author: 'Zeynep S.', bolum: 'Bilgisayar Mühendisliği', sinif: 4, pages: 6, kind: 'Çıkmış sorular', likes: 203, saves: 140, when: 'Dün' },
  { id: 'n5', course: 'Anatomi', code: 'TIP102', title: 'Üst ekstremite kas tablosu', author: 'Serkan Y.', bolum: 'Tıp', sinif: 1, pages: 4, kind: 'Özet', likes: 118, saves: 88, when: '5 gün önce' },
  { id: 'n6', course: 'Anayasa Hukuku', code: 'HUK103', title: 'Ders notları — 1. ünite (el yazısı)', author: 'Burak T.', bolum: 'Hukuk', sinif: 1, pages: 22, kind: 'El yazısı', likes: 47, saves: 25, when: '1 hafta önce' },
  { id: 'n7', course: 'Bilgisayar Ağları', code: 'BM307', title: 'OSI katmanları tek sayfa', author: 'Sen', bolum: 'Bilgisayar Mühendisliği', sinif: 3, pages: 1, kind: 'Özet', likes: 39, saves: 12, when: '2 hafta önce', mine: true },
];

export type StudyTable = { id: string; course: string; place: string; time: string; need: number; total: number; host: string; quiet: boolean };

export const STUDY_TABLES: StudyTable[] = [
  { id: 's1', course: 'Veri Yapıları vize', place: 'ELUA Coffee · üst kat', time: 'Bugün 19:00', need: 2, total: 5, host: 'Elif A.', quiet: true },
  { id: 's2', course: 'Olasılık çalışma grubu', place: 'Latibule Coffee', time: 'Yarın 15:00', need: 3, total: 6, host: 'Kaan D.', quiet: true },
  { id: 's3', course: 'Anatomi tekrar', place: 'ERÜ Merkez Kütüphane', time: 'Çarşamba 13:00', need: 1, total: 4, host: 'Serkan Y.', quiet: true },
];

export type CampusEvent = {
  id: string; title: string; club: string; kind: 'Turnuva' | 'Konser' | 'Kariyer' | 'Atölye' | 'Spor' | 'Sosyal';
  place: string; when: string; going: number; lookingBuddy: number; free: boolean; color: string;
};

/** Demo events (not real announcements) until clubs publish via the club panel. */
export const EVENTS: CampusEvent[] = [
  { id: 'e1', title: 'Kampüs Okey Turnuvası', club: 'Orti × Arena', kind: 'Turnuva', place: 'Arena Premium Okey', when: 'Cuma 19:00', going: 48, lookingBuddy: 7, free: true, color: '#14A44D' },
  { id: 'e2', title: 'Bahar Şenliği açılış konseri', club: 'Öğrenci Konseyi', kind: 'Konser', place: 'Kampüs açık hava sahnesi', when: 'Cumartesi 20:30', going: 612, lookingBuddy: 34, free: true, color: '#E8398A' },
  { id: 'e3', title: '24 saat hackathon', club: 'Bilgisayar Topluluğu', kind: 'Atölye', place: 'Mühendislik Fakültesi', when: '28–29 Kasım', going: 96, lookingBuddy: 12, free: true, color: '#6D4AFF' },
  { id: 'e4', title: 'Fakülteler arası halı saha ligi', club: 'Spor Kulübü', kind: 'Spor', place: 'ERÜ 15 Temmuz Kampüs Sahası', when: 'Her pazar 14:00', going: 140, lookingBuddy: 9, free: true, color: '#0EA5A4' },
  { id: 'e5', title: 'Mühendislik kariyer günü', club: 'Kariyer Merkezi', kind: 'Kariyer', place: 'Kongre ve Kültür Merkezi', when: '3 Aralık 10:00', going: 230, lookingBuddy: 5, free: true, color: '#F2711C' },
  { id: 'e6', title: 'Kutu oyunu gecesi', club: 'Oyun Kulübü', kind: 'Sosyal', place: 'Latibule Coffee', when: 'Perşembe 20:00', going: 31, lookingBuddy: 6, free: false, color: '#A35200' },
];

export const STUDY_PLACES = ['Merkez Kütüphane', 'Mühendislik Kütüphanesi', 'Sessiz kafe'] as const;

/** Who is studying right now (demo). */
export const LIB_NOW = [
  { id: 'l1', name: 'Elif A.', i: 'EA', bg: '#CFE3FF', course: 'Veri Yapıları', place: 'Merkez Kütüphane · 2. kat', until: '18:00', style: 'Sessiz eşlik', code: 'BM301' },
  { id: 'l2', name: 'Kaan D.', i: 'KD', bg: '#FFF1C2', course: 'Olasılık ve İstatistik', place: 'Mühendislik Kütüphanesi', until: '17:30', style: 'Soru çözelim', code: 'MAT221' },
  { id: 'l3', name: 'Zeynep S.', i: 'ZS', bg: '#E8DAFF', course: 'İşletim Sistemleri', place: 'Merkez Kütüphane · grup odası 4', until: '20:00', style: 'Soru çözelim', code: 'BM305' },
  { id: 'l4', name: 'Serkan Y.', i: 'SY', bg: '#D3F0DA', course: 'Anatomi', place: 'Merkez Kütüphane · 1. kat', until: '19:00', style: 'Sessiz eşlik', code: 'TIP102' },
];
