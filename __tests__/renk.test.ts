/// <reference types="jest" />
import { contrast } from './contrast';
import { C } from '../src/core/theme';
import { CAT_META } from '../src/modules/mekan/venues';
import { MODULES } from '../src/core/modules';
import { MY_LESSONS, EVENTS } from '../src/modules/kampus/data';
import { TEAMS } from '../src/modules/oyun/teams';

const AAA = 7;

describe('Renk kontrastı (WCAG AAA ≥ 7:1)', () => {
  const textPairs: [string, string, string][] = [
    ['ana metin / beyaz', C.text, '#FFFFFF'],
    ['ana metin / zemin', C.text, C.bg],
    ['ikincil metin / beyaz', C.text2, '#FFFFFF'],
    ['ikincil metin / zemin', C.text2, C.bg],
    ['üçüncül metin / beyaz', C.text3, '#FFFFFF'],
    ['marka butonu yazısı', '#FFFFFF', C.primary],
    ['marka link / zemin', C.primary, C.bg],
    ['marka link / beyaz', C.primary, '#FFFFFF'],
    ['marka / açık mor', C.primary, C.tint],
    ['koyu mor / açık mor', C.tintText, C.tint],
    ['yeşil / açık yeşil', C.green, C.greenBg],
    ['yeşil / beyaz', C.green, '#FFFFFF'],
    ['acil turuncu / beyaz', C.urgent, '#FFFFFF'],
    ['kırmızı buton yazısı', '#FFFFFF', C.red],
    ['sarı üstü koyu metin', C.sunText, C.sun],
    ['uyarı metni', C.warnText, C.warnBg],
    ['kalp sayacı', C.heartText, '#FFFFFF'],
  ];
  it.each(textPairs)('%s', (_n, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(Object.entries(CAT_META))('kategori %s: dolgu üstü yazı ve çip', (_k, m) => {
    expect(contrast(m.on, m.color)).toBeGreaterThanOrEqual(AAA);
    expect(contrast(m.ink, m.tint)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(MODULES.map((m) => [m.title, m.ink, m.color]))('modül kutusu %s', (_t, ink, color) => {
    expect(contrast(ink as string, color as string)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(MY_LESSONS.map((l) => [l.name, l.color]))('ders kartı %s (beyaz yazı)', (_n, color) => {
    expect(contrast('#FFFFFF', color as string)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(EVENTS.map((e) => [e.title, e.color]))('etkinlik kartı %s (beyaz yazı)', (_n, color) => {
    expect(contrast('#FFFFFF', color as string)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(TEAMS.map((t) => [t.name, t.color]))('ekip kartı %s (beyaz yazı)', (_n, color) => {
    expect(contrast('#FFFFFF', color as string)).toBeGreaterThanOrEqual(AAA);
  });
});
