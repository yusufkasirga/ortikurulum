import React from 'react';
import { ScrollView, View } from 'react-native';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, Card, PrimaryButton, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../../components/ui';
import { styles } from './styles';
import { DAYS, MY_LESSONS, freeWindows, todayIndex } from './data';
import { CAT_META, VENUES } from '../mekan/venues';

const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;
const TABLES = VENUES.flatMap((v) => v.tables.map((t) => ({ v, t })));

export default function Program({ onTable }: { onTable: (venueId: string, tableId: string) => void }) {
  const [day, setDay] = React.useState(todayIndex());
  const [notify, setNotify] = React.useState(true);
  const [exam, setExam] = React.useState(false);
  const lessons = MY_LESSONS.filter((l) => l.day === day).sort((a, b) => a.start - b.start);
  const free = freeWindows(day);
  type Block = { kind: 'lesson'; start: number; end: number; l: (typeof lessons)[number] } | { kind: 'free'; start: number; end: number };
  const blocks: Block[] = [
    ...lessons.map((l) => ({ kind: 'lesson' as const, start: l.start, end: l.end, l })),
    ...free.map((f) => ({ kind: 'free' as const, ...f })),
  ].sort((a, b) => a.start - b.start);

  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {DAYS.map((d, i) => {
          const on = i === day;
          return (
            <Tap key={d} haptic="light" onPress={() => setDay(i)} accessibilityState={{ selected: on }} style={[styles.day, on && { backgroundColor: C.primary }]}>
              <T w="b" size={14} color={on ? '#FFF' : C.text}>{d}</T>
              {i === todayIndex() ? <View style={[styles.todayDot, { backgroundColor: on ? '#FFF' : C.primary }]} /> : null}
            </Tap>
          );
        })}
      </View>

      <View style={{ gap: 10 }}>
        {blocks.map((b) => b.kind === 'lesson' ? (
          <View key={`l${b.start}`} style={styles.lesson}>
            <View style={styles.timeCol}><T w="b" size={13}>{hh(b.start)}</T><T size={12} color={C.text2}>{hh(b.end)}</T></View>
            <View style={[styles.lessonCard, { backgroundColor: b.l.color }]}>
              <T w="b" size={16} color="#FFF">{b.l.name}</T>
              <T w="s" size={13} color="rgba(255,255,255,0.9)">{b.l.code} · {b.l.room}</T>
            </View>
          </View>
        ) : (
          <View key={`f${b.start}`} style={styles.lesson}>
            <View style={styles.timeCol}><T w="b" size={13}>{hh(b.start)}</T><T size={12} color={C.text2}>{hh(b.end)}</T></View>
            <View style={styles.freeCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.freeTag}><T w="b" size={11} color={C.green}>BOŞ · {b.end - b.start} SAAT</T></View>
                <T w="s" size={13} color={C.text2}>Kampüse yakın {Math.min(3, TABLES.length)} masa uygun</T>
              </View>
              {TABLES.slice(b.start % 3, (b.start % 3) + 2).map(({ v, t }) => (
                <Tap key={t.id} onPress={() => onTable(v.id, t.id)} style={styles.suggest}>
                  <View style={[styles.sugIcon, { backgroundColor: CAT_META[v.cat].color }]}><Icon name={CAT_META[v.cat].icon} size={16} color="#FFF" strokeWidth={2} /></View>
                  <View style={{ flex: 1 }}>
                    <T w="s" size={14} numberOfLines={1}>{t.game} · {t.need} kişi</T>
                    <T size={12} color={C.text2} numberOfLines={1}>{v.name}</T>
                  </View>
                  <Icon name="chevRight" size={13} color={C.chevron} strokeWidth={3} />
                </Tap>
              ))}
            </View>
          </View>
        ))}
      </View>

      <Card>
        <View style={styles.row}>
          <Icon name="bell" size={20} color={C.primary} />
          <View style={{ flex: 1 }}>
            <T size={16}>Boş saatlerimde haber ver</T>
            <T size={13} color={C.text2}>Boşluğun başlamadan 15 dk önce uygun masa bildirimi</T>
          </View>
          <Toggle value={notify} onChange={setNotify} label="Boş saatlerimde haber ver" />
        </View>
        <Sep inset={50} />
        <View style={styles.row}>
          <Icon name="moon" size={20} color={C.text3} />
          <View style={{ flex: 1 }}>
            <T size={16}>Sınav haftası modu</T>
            <T size={13} color={C.text2}>Oyun bildirimleri susar, sadece çalışma masaları gelir</T>
          </View>
          <Toggle value={exam} onChange={setExam} label="Sınav haftası modu" />
        </View>
      </Card>
      <Tap style={styles.linkRow}>
        <Icon name="calendar" size={18} color={C.primary} />
        <T w="s" size={15} color={C.primary} style={{ flex: 1 }}>Programı OBİS'ten içe aktar</T>
        <Icon name="chevRight" size={13} color={C.chevron} strokeWidth={3} />
      </Tap>
    </View>
  );
}
