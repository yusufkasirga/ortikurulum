import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { MY_LESSONS, Note } from './data';

export const KIND_COLOR: Record<Note['kind'], { bg: string; ink: string }> = {
  'Özet': { bg: '#ECE7FF', ink: '#3A1FB0' },
  'Formül kağıdı': { bg: '#FFF1C2', ink: '#7A5200' },
  'Çıkmış sorular': { bg: '#FDE3EF', ink: '#8A1450' },
  'El yazısı': { bg: '#DBF5F4', ink: '#05605F' },
};

const FALLBACK = ['#6D4AFF', '#F2711C', '#0EA5A4', '#E8398A', '#14A44D'];

/** Course accent colour: the user's timetable colour if it is one of their courses, else a stable fallback. */
export function courseColor(code: string) {
  const mine = MY_LESSONS.find((l) => l.code === code);
  if (mine) return mine.color;
  let h = 0;
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return FALLBACK[h % FALLBACK.length];
}

/** Stylised page preview — gives every note a recognisable "paper" without needing real thumbnails. */
export function PaperThumb({ note, width, height, tilt = 0 }: { note: Note; width: number; height: number; tilt?: number }) {
  const accent = courseColor(note.code);
  const k = KIND_COLOR[note.kind];
  const lines = Math.max(4, Math.floor((height - 34) / 9));
  const hand = note.kind === 'El yazısı';
  const formula = note.kind === 'Formül kağıdı';
  return (
    <View style={{ width, height, transform: [{ rotate: `${tilt}deg` }], shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect x={0} y={0} width={width} height={height} rx={10} fill="#FFFFFF" />
        <Rect x={0} y={0} width={width} height={14} rx={10} fill={accent} />
        <Rect x={0} y={7} width={width} height={7} fill={accent} />
        <Path d={`M${width - 18} ${height} L${width} ${height - 18} L${width} ${height - 8} Q${width} ${height} ${width - 8} ${height} Z`} fill={k.bg} />
        <Rect x={10} y={22} width={width * 0.55} height={6} rx={3} fill="#1C1C1E" opacity={0.75} />
        {Array.from({ length: lines }).map((_, i) => {
          const y = 36 + i * 9;
          if (y > height - 12) return null;
          const w = (width - 20) * (0.55 + ((i * 37) % 40) / 100);
          if (hand) return <Path key={i} d={`M10 ${y} q ${w / 4} -3 ${w / 2} 0 t ${w / 2} 0`} stroke="#5B6474" strokeWidth={1.4} fill="none" opacity={0.55} />;
          if (formula && i % 3 === 1) return <Rect key={i} x={10} y={y - 3} width={w * 0.6} height={7} rx={3} fill={k.bg} />;
          return <Rect key={i} x={10} y={y - 2} width={w} height={3.5} rx={2} fill="#C7CBD3" />;
        })}
      </Svg>
    </View>
  );
}
