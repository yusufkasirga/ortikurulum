export type Person = { i: string; bg: string; name?: string };

export type Lobby = {
  id: string;
  game: string;
  mark: string;
  type: 'masa' | 'online' | 'spor';
  partner: boolean;
  need: string;
  place: string;
  dist: string;
  tileBg: string;
  time: string;
  urgent: boolean;
  host: string;
  players: Person[];
  empty: number;
};

export const LOBBIES: Lobby[] = [
  {
    id: 'okey', game: '101 Okey', mark: 'O', type: 'masa', partner: true, need: '1 kişi aranıyor',
    place: 'Moda Kahvesi · Kadıköy', dist: '0,8 km', tileBg: '#1F8A4C', time: '40 dk sonra', urgent: true,
    host: 'Kurucu Mehmet K. · Güven 98',
    players: [{ i: 'MK', bg: '#FFD8B5' }, { i: 'EA', bg: '#CFE3FF' }, { i: 'SY', bg: '#D3F0DA' }], empty: 1,
  },
  {
    id: 'val', game: 'Valorant', mark: 'V', type: 'online', partner: false, need: '2 kişi aranıyor',
    place: 'Online · Rekabetçi · Altın ve üstü', dist: 'Online', tileBg: '#C8243C', time: 'Bugün 22:00', urgent: false,
    host: 'Kurucu Burak T. · Güven 94',
    players: [{ i: 'BT', bg: '#E8DAFF' }, { i: 'OK', bg: '#FFE3E8' }, { i: 'CY', bg: '#FFF1C2' }], empty: 2,
  },
  {
    id: 'bilardo', game: 'Bilardo · 8 top', mark: 'B', type: 'masa', partner: true, need: '1 kişi aranıyor',
    place: 'Cue Club · Beşiktaş', dist: '3,2 km', tileBg: '#1C1C1E', time: '25 dk sonra', urgent: true,
    host: 'Kurucu Tolga E. · Güven 91',
    players: [{ i: 'TE', bg: '#D7ECFF' }], empty: 1,
  },
  {
    id: 'saha', game: 'Halı saha · 7v7', mark: 'H', type: 'spor', partner: false, need: '3 kişi aranıyor',
    place: 'Ataköy Spor Tesisi', dist: '5,4 km', tileBg: '#C25E00', time: 'Yarın 19:00', urgent: false,
    host: 'Kurucu Ali K. · Güven 96',
    players: [{ i: 'AK', bg: '#FFE0C2' }, { i: 'MS', bg: '#D3F0DA' }, { i: 'RT', bg: '#CFE3FF' }], empty: 3,
  },
  {
    id: 'tavla', game: 'Tavla', mark: 'T', type: 'masa', partner: false, need: '1 kişi aranıyor',
    place: 'Çınaraltı Çay Bahçesi · Üsküdar', dist: '4,1 km', tileBg: '#8A5A2B', time: 'Bugün 18:30', urgent: false,
    host: 'Kurucu Hasan B. · Güven 99',
    players: [{ i: 'HB', bg: '#FFD8B5' }], empty: 1,
  },
];

export const TABLE_PLAYERS = [
  { id: 'mk', i: 'MK', bg: '#FFD8B5', name: 'Mehmet K.', meta: 'Kurucu · 142 oyun', rating: '4,9', trust: 98 },
  { id: 'ea', i: 'EA', bg: '#CFE3FF', name: 'Elif A.', meta: '58 oyun · Dakik', rating: '4,8', trust: 95 },
  { id: 'sy', i: 'SY', bg: '#D3F0DA', name: 'Serkan Y.', meta: '97 oyun · Centilmen', rating: '4,7', trust: 90 },
];

export const ME = { i: 'DA', bg: '#E4E0FC', name: 'Deniz Aydın' };

export type GameOpt = { id: string; label: string; mark: string; bg: string; size: number };

export const GAMES_TABLE: GameOpt[] = [
  { id: 'okey', label: 'Okey', mark: 'O', bg: '#1F8A4C', size: 4 },
  { id: 'tavla', label: 'Tavla', mark: 'T', bg: '#8A5A2B', size: 2 },
  { id: 'bilardo', label: 'Bilardo', mark: 'B', bg: '#1C1C1E', size: 2 },
  { id: 'batak', label: 'Batak', mark: 'B', bg: '#C8243C', size: 4 },
  { id: 'satranc', label: 'Satranç', mark: 'S', bg: '#3A3A3C', size: 2 },
  { id: 'saha', label: 'Halı saha', mark: 'H', bg: '#C25E00', size: 14 },
];

export const GAMES_ONLINE: GameOpt[] = [
  { id: 'val', label: 'Valorant', mark: 'V', bg: '#C8243C', size: 5 },
  { id: 'cs', label: 'CS2', mark: 'C', bg: '#B45A00', size: 5 },
  { id: 'lol', label: 'LoL', mark: 'L', bg: '#0B5C8C', size: 5 },
  { id: 'fc', label: 'EA FC', mark: 'F', bg: '#146C34', size: 2 },
  { id: 'pubg', label: 'PUBG', mark: 'P', bg: '#8A6A00', size: 4 },
  { id: 'diger', label: 'Diğer', mark: '+', bg: '#6E6E73', size: 4 },
];

export const RECENT_GAMES = [
  { name: '101 Okey', meta: 'Moda Kahvesi · Dün', mark: 'O', bg: '#1F8A4C', score: '5,0' },
  { name: 'Valorant', meta: 'Online · 2 gün önce', mark: 'V', bg: '#C8243C', score: '4,7' },
  { name: 'Tavla', meta: 'Çınaraltı · Geçen hafta', mark: 'T', bg: '#8A5A2B', score: '4,9' },
  { name: 'Halı saha', meta: 'Ataköy · Geçen hafta', mark: 'H', bg: '#C25E00', score: '4,6' },
];
