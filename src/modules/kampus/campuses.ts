export type Campus = { id: string; name: string; short: string; city: string; domain: string; active: boolean };

/** Mirrors public.campuses. Only ERÜ is live in the pilot; the rest collect a waitlist. */
export const CAMPUSES: Campus[] = [
  { id: 'eru', name: 'Erciyes Üniversitesi', short: 'ERÜ', city: 'Kayseri', domain: 'erciyes.edu.tr', active: true },
  { id: 'agu', name: 'Abdullah Gül Üniversitesi', short: 'AGÜ', city: 'Kayseri', domain: 'agu.edu.tr', active: false },
  { id: 'kayseri', name: 'Kayseri Üniversitesi', short: 'KAYÜ', city: 'Kayseri', domain: 'kayseri.edu.tr', active: false },
  { id: 'nny', name: 'Nuh Naci Yazgan Üniversitesi', short: 'NNYÜ', city: 'Kayseri', domain: 'nny.edu.tr', active: false },
];

export const OTHER_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Konya', 'Eskişehir', 'Bursa'];

export const campusById = (id?: string) => CAMPUSES.find((c) => c.id === id) ?? CAMPUSES[0];
