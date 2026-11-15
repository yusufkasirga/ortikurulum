export type Person = { i: string; bg: string; name?: string };

export const TABLE_PLAYERS = [
  { id: 'mk', i: 'MK', bg: '#FFD8B5', name: 'Mehmet K.', meta: 'Kurucu · 142 oyun', rating: '4,9', trust: 98 },
  { id: 'ea', i: 'EA', bg: '#CFE3FF', name: 'Elif A.', meta: '58 oyun · Dakik', rating: '4,8', trust: 95 },
  { id: 'sy', i: 'SY', bg: '#D3F0DA', name: 'Serkan Y.', meta: '97 oyun · Centilmen', rating: '4,7', trust: 90 },
];

export const ME = { i: 'DA', bg: '#E4E0FC', name: 'Deniz Aydın' };

export type GameOpt = { id: string; label: string; mark: string; bg: string; size: number };

export const GAMES_TABLE: GameOpt[] = [
  { id: 'okey', label: 'Okey', mark: 'O', bg: '#0C642F', size: 4 },
  { id: 'tavla', label: 'Tavla', mark: 'T', bg: '#8A5A2B', size: 2 },
  { id: 'bilardo', label: 'Bilardo', mark: 'B', bg: '#1C1C1E', size: 2 },
  { id: 'batak', label: 'Batak', mark: 'B', bg: '#C8243C', size: 4 },
  { id: 'satranc', label: 'Satranç', mark: 'S', bg: '#3A3A3C', size: 2 },
  { id: 'saha', label: 'Halı saha', mark: 'H', bg: '#086363', size: 14 },
];

export const GAMES_ONLINE: GameOpt[] = [
  { id: 'val', label: 'Valorant', mark: 'V', bg: '#C8243C', size: 5 },
  { id: 'cs', label: 'CS2', mark: 'C', bg: '#8E4100', size: 5 },
  { id: 'lol', label: 'LoL', mark: 'L', bg: '#0B5C8C', size: 5 },
  { id: 'fc', label: 'EA FC', mark: 'F', bg: '#146C34', size: 2 },
  { id: 'pubg', label: 'PUBG', mark: 'P', bg: '#8A6A00', size: 4 },
  { id: 'diger', label: 'Diğer', mark: '+', bg: '#4F4F54', size: 4 },
];

export const RECENT_GAMES = [
  { name: '101 Okey', meta: 'Arena Premium Okey · Dün', mark: 'O', bg: '#0C642F', score: '5,0' },
  { name: 'Valorant', meta: 'Online · 2 gün önce', mark: 'V', bg: '#C8243C', score: '4,7' },
  { name: 'Tavla', meta: 'Şahinler Cafe · Geçen hafta', mark: 'T', bg: '#8A5A2B', score: '4,9' },
  { name: 'Halı saha', meta: 'Gezegen Halı Saha · Geçen hafta', mark: 'H', bg: '#086363', score: '4,6' },
];
