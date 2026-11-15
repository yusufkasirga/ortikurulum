/** Persistent crews ("Tekrar oynarım" → ekip) and the Talas league. Demo data. */

export type Member = { name: string; i: string; bg: string };
export type Team = { id: string; name: string; game: string; usual: string; venueId: string; members: Member[]; played: number; color: string; discord?: string };

export const TEAMS: Team[] = [
  {
    id: 'k1', name: 'Perşembe Okey Ekibi', game: '101 Okey', usual: 'Perşembe akşamları · Arena', venueId: 'arena', played: 12, color: '#0C642F',
    members: [{ name: 'Mehmet K.', i: 'MK', bg: '#FFD8B5' }, { name: 'Elif A.', i: 'EA', bg: '#CFE3FF' }, { name: 'Sen', i: 'DA', bg: '#E2DBFF' }],
  },
  {
    id: 'k2', name: 'Gece FC Kadrosu', game: 'EA FC · 2v2', usual: 'Hafta sonu gece · Sade Vip Lounge', venueId: 'sade', played: 5, color: '#4C21FF', discord: 'https://discord.gg/orti-gecefc',
    members: [{ name: 'Cem Y.', i: 'CY', bg: '#FFF1C2' }, { name: 'Kaan D.', i: 'KD', bg: '#D3F0DA' }, { name: 'Burak T.', i: 'BT', bg: '#FFE3E8' }, { name: 'Sen', i: 'DA', bg: '#E2DBFF' }],
  },
];

export type LeagueRow = { rank: number; name: string; bolum: string; points: number; wins: number; played: number; me?: boolean; trend: 'up' | 'down' | 'same' };

export const LEAGUE = {
  name: 'Talas Okey Ligi',
  season: 'Güz 2026 · 4. hafta',
  prize: 'Sezon birincisine partner mekanlarda 1 ay ücretsiz masa',
  venues: ['Arena Premium Okey', 'Şahinler Cafe', 'Rüzgarlı Cafe'],
  nextRound: 'Perşembe 20:00',
  rows: [
    { rank: 1, name: 'Mehmet K.', bolum: 'Hukuk', points: 41, wins: 13, played: 16, trend: 'same' },
    { rank: 2, name: 'Zeynep S.', bolum: 'Bilgisayar Müh.', points: 38, wins: 12, played: 15, trend: 'up' },
    { rank: 3, name: 'Hasan B.', bolum: 'İşletme', points: 35, wins: 11, played: 16, trend: 'down' },
    { rank: 4, name: 'Elif A.', bolum: 'İktisat', points: 31, wins: 10, played: 14, trend: 'up' },
    { rank: 5, name: 'Sen', bolum: 'Bilgisayar Müh.', points: 27, wins: 8, played: 12, trend: 'up', me: true },
    { rank: 6, name: 'Tolga E.', bolum: 'Makine Müh.', points: 24, wins: 7, played: 13, trend: 'down' },
  ] as LeagueRow[],
};

/** Next table the user has joined — drives the countdown banner (Live Activity on iOS later). */
export const NEXT_TABLE = { game: '101 Okey', venue: 'Arena Premium Okey', venueId: 'arena', tableId: 't1', minutesFromNow: 38, seats: '3/4' };
