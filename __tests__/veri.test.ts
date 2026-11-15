/// <reference types="jest" />
/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { VENUES, CAT_META, FEATURED, distanceKm, fmtKm, PILOT_REGION } from '../src/modules/mekan/venues';
import { MODULES, DEFAULT_ENABLED } from '../src/core/modules';
import { bolumOf, BOLUMLER, freeWindows, MY_LESSONS, NOTES, EVENTS, LIB_NOW } from '../src/modules/kampus/data';
import { LEAGUE, TEAMS } from '../src/modules/oyun/teams';

describe('Mekan verisi', () => {
  it('her mekanın kimliği benzersiz', () => {
    const ids = VENUES.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('tüm mekanlar Talas pilot bölgesine yakın (≤ 4 km)', () => {
    for (const v of VENUES) {
      expect(distanceKm(v.lat, v.lng, { name: 'merkez', lat: PILOT_REGION.latitude, lng: PILOT_REGION.longitude })).toBeLessThan(4);
    }
  });
  it('her mekanın kategorisi tanımlı', () => {
    for (const v of VENUES) expect(CAT_META[v.cat]).toBeDefined();
  });
  it('masalarda eksik sayısı mantıklı (1 ≤ eksik < toplam)', () => {
    for (const v of VENUES) for (const t of v.tables) {
      expect(t.need).toBeGreaterThanOrEqual(1);
      expect(t.need).toBeLessThan(t.total);
      expect(t.hostTrust).toBeLessThanOrEqual(100);
    }
  });
  it('masa kimlikleri tüm uygulamada benzersiz', () => {
    const ids = VENUES.flatMap((v) => v.tables.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('öne çıkan her mekanın kampanyası var', () => {
    expect(FEATURED.length).toBeGreaterThan(0);
    for (const v of FEATURED) { expect(v.featured?.offer.length).toBeGreaterThan(5); expect(v.featured?.detail.length).toBeGreaterThan(5); }
  });
  it('mesafe biçimi Türkçe', () => {
    expect(fmtKm(0.42)).toBe('420 m');
    expect(fmtKm(1.5)).toBe('1,5 km');
  });
});

describe('Modül kaydı', () => {
  const nav = fs.readFileSync(path.join(__dirname, '../src/core/navigation.tsx'), 'utf8');
  it('kimlikler benzersiz ve varsayılan ayarı var', () => {
    const ids = MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(DEFAULT_ENABLED[id]).toBe(true);
  });
  it.each(MODULES.map((m) => [m.title, m]))('%s gerçek bir ekrana açılıyor', (_t, m) => {
    const t = (m as (typeof MODULES)[number]).target;
    if (t.kind === 'screen') expect(nav).toContain(`name="${t.name}"`);
    if (t.kind === 'tab') expect(nav).toContain(`name="${t.name}"`);
    if (t.kind === 'kampus') expect(nav).toContain('name="Kampus"');
  });
  it('temel modüller kilitli', () => {
    for (const id of ['eslesme', 'harita', 'masaac']) expect(MODULES.find((m) => m.id === id)?.locked).toBe(true);
  });
});

describe('Kampüs', () => {
  it('bölüm ataması aynı isim için hep aynı', () => {
    expect(bolumOf('Elif A.')).toEqual(bolumOf('Elif A.'));
    expect(BOLUMLER).toContain(bolumOf('Herhangi Biri').bolum);
    const s = bolumOf('Test').sinif; expect(s).toBeGreaterThanOrEqual(1); expect(s).toBeLessThanOrEqual(4);
  });
  it('dersler çakışmıyor', () => {
    for (let d = 0; d < 5; d++) {
      const l = MY_LESSONS.filter((x) => x.day === d).sort((a, b) => a.start - b.start);
      for (let i = 1; i < l.length; i++) expect(l[i].start).toBeGreaterThanOrEqual(l[i - 1].end);
    }
  });
  it('boş saatler derslerle çakışmıyor ve en az 2 saat', () => {
    for (let d = 0; d < 5; d++) for (const w of freeWindows(d)) {
      expect(w.end - w.start).toBeGreaterThanOrEqual(2);
      for (const l of MY_LESSONS.filter((x) => x.day === d)) expect(w.end <= l.start || w.start >= l.end).toBe(true);
    }
  });
  it('pazartesi 11–16 arası boş', () => {
    expect(freeWindows(0)).toEqual([{ start: 11, end: 16 }]);
  });
  it('not, etkinlik ve kütüphane verisi tutarlı', () => {
    expect(new Set(NOTES.map((n) => n.id)).size).toBe(NOTES.length);
    for (const n of NOTES) expect(n.pages).toBeGreaterThan(0);
    for (const e of EVENTS) expect(e.going).toBeGreaterThanOrEqual(e.lookingBuddy);
    expect(LIB_NOW.length).toBeGreaterThan(0);
  });
});

describe('Ekip ve lig', () => {
  it('lig sıralaması puana göre azalan', () => {
    const p = LEAGUE.rows.map((r) => r.points);
    expect([...p].sort((a, b) => b - a)).toEqual(p);
    expect(LEAGUE.rows.filter((r) => r.me)).toHaveLength(1);
  });
  it('her ekipte kullanıcı var ve ekip mekanı gerçek', () => {
    for (const t of TEAMS) {
      expect(t.members.some((m) => m.name === 'Sen')).toBe(true);
      expect(VENUES.some((v) => v.id === t.venueId)).toBe(true);
    }
  });
});
