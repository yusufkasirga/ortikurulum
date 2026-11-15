import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { C } from '../theme';
import Icon from '../components/Icon';
import { Card, PrimaryButton, Segmented, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../components/ui';
import { LIB_NOW, STUDY_PLACES } from '../campus';
import { Avatar } from '../components/ui';
import { DAYS, EVENTS, ME_CAMPUS, MY_LESSONS, NOTES, Note, STUDY_TABLES, freeWindows, todayIndex } from '../campus';
import { CAT_META, VENUES } from '../venues';
import type { TabParams } from '../navigation';

type Tab = 'program' | 'etkinlik' | 'notlar' | 'calisma';
type NoteFilter = 'derslerim' | 'bolumum' | 'tumu';

const KIND_COLOR: Record<Note['kind'], { bg: string; ink: string }> = {
  'Özet': { bg: '#ECE7FF', ink: '#3A1FB0' },
  'Formül kağıdı': { bg: '#FFF1C2', ink: '#7A5200' },
  'Çıkmış sorular': { bg: '#FDE3EF', ink: '#8A1450' },
  'El yazısı': { bg: '#DBF5F4', ink: '#05605F' },
};

const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;
const TABLES = VENUES.flatMap((v) => v.tables.map((t) => ({ v, t })));

export default function Kampus({ navigation }: BottomTabScreenProps<TabParams, 'Kampus'>) {
  const insets = useSafeAreaInsets();
  const root = navigation.getParent();
  const [tab, setTab] = React.useState<Tab>('program');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 120, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View>
          <T w="s" size={14} color={C.text2}>ERÜ · {ME_CAMPUS.bolum} · {ME_CAMPUS.sinif}. sınıf</T>
          <T w="x" size={32} style={{ letterSpacing: -0.8 }} accessibilityRole="header">Kampüs</T>
        </View>
        <View style={styles.capBadge}><Icon name="cap" size={22} color={C.primary} /></View>
      </View>
      <Segmented<Tab> value={tab} onChange={setTab} items={[{ id: 'program', label: 'Program' }, { id: 'calisma', label: 'Kütüphane' }, { id: 'etkinlik', label: 'Etkinlik' }, { id: 'notlar', label: 'Notlar' }]} />
      {tab === 'program' ? <Program onTable={(venueId, tableId) => root?.navigate('Lobi', { venueId, tableId })} /> : null}
      {tab === 'etkinlik' ? <Etkinlikler /> : null}
      {tab === 'notlar' ? <Notlar /> : null}
      {tab === 'calisma' ? <Calisma onCreate={() => root?.navigate('Olustur')} /> : null}
    </ScrollView>
  );
}

function Program({ onTable }: { onTable: (venueId: string, tableId: string) => void }) {
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

function Etkinlikler() {
  const [going, setGoing] = React.useState<Record<string, boolean>>({});
  const [buddy, setBuddy] = React.useState<Record<string, boolean>>({});
  const [kind, setKind] = React.useState<string>('Hepsi');
  const kinds = ['Hepsi', 'Turnuva', 'Konser', 'Spor', 'Atölye', 'Kariyer', 'Sosyal'];
  const list = EVENTS.filter((e) => kind === 'Hepsi' || e.kind === kind);
  return (
    <View style={{ gap: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
        {kinds.map((k) => (
          <Tap key={k} haptic="light" onPress={() => setKind(k)} accessibilityState={{ selected: kind === k }} style={[styles.chip, kind === k && { backgroundColor: C.text }]}>
            <T w="b" size={14} color={kind === k ? '#FFF' : C.text}>{k}</T>
          </Tap>
        ))}
      </ScrollView>
      {list.map((e) => {
        const g = !!going[e.id];
        const b = !!buddy[e.id];
        return (
          <View key={e.id} style={styles.event}>
            <View style={[styles.eventHead, { backgroundColor: e.color }]}>
              <View style={styles.eventDeco} />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.eventKind}><T w="b" size={11} color={e.color}>{e.kind.toUpperCase()}</T></View>
                <T w="b" size={13} color="#FFF">{e.free ? 'Ücretsiz' : 'Masa ücreti var'}</T>
              </View>
              <T w="x" size={20} color="#FFF" style={{ letterSpacing: -0.4 }}>{e.title}</T>
              <T w="s" size={13} color="rgba(255,255,255,0.92)">{e.club}</T>
            </View>
            <View style={{ padding: 14, gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="calendar" size={16} color={C.text3} /><T w="s" size={14}>{e.when}</T>
                <T size={14} color={C.text2}>·</T>
                <Icon name="pin" size={16} color={C.text3} /><T size={14} color={C.text3} numberOfLines={1} style={{ flex: 1 }}>{e.place}</T>
              </View>
              <T size={13} color={C.text2}>{e.going + (g ? 1 : 0)} kişi gidiyor · {e.lookingBuddy + (b ? 1 : 0)} kişi birlikte gidecek arkadaş arıyor</T>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Tap haptic="medium" onPress={() => setGoing((x) => ({ ...x, [e.id]: !g }))} accessibilityState={{ selected: g }} style={[styles.evBtn, { backgroundColor: g ? C.green : C.tint }]}>
                  <T w="s" size={14} color={g ? '#FFF' : C.primary}>{g ? 'Gidiyorsun' : 'Gidiyorum'}</T>
                </Tap>
                <Tap haptic="medium" onPress={() => { tapSuccess(); setBuddy((x) => ({ ...x, [e.id]: !b })); setGoing((x) => ({ ...x, [e.id]: true })); }} accessibilityState={{ selected: b }} style={[styles.evBtn, { flex: 1.3, backgroundColor: b ? C.text : C.sun }]}>
                  <T w="b" size={14} color={b ? '#FFF' : '#241200'}>{b ? 'Eşleşme aranıyor…' : 'Birlikte gidelim'}</T>
                </Tap>
              </View>
            </View>
          </View>
        );
      })}
      <T size={12} color={C.text2} style={{ textAlign: 'center' }}>Etkinlikler örnek; kulüpler kendi panelinden ekleyecek.</T>
    </View>
  );
}

function Notlar() {
  const [filter, setFilter] = React.useState<NoteFilter>('derslerim');
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});
  const [upload, setUpload] = React.useState(false);
  const myCodes = new Set(MY_LESSONS.map((l) => l.code));
  const list = NOTES.filter((n) => filter === 'tumu' || (filter === 'bolumum' ? n.bolum === ME_CAMPUS.bolum : myCodes.has(n.code)));

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {([['derslerim', 'Derslerim'], ['bolumum', 'Bölümüm'], ['tumu', 'Tüm kampüs']] as [NoteFilter, string][]).map(([id, label]) => (
          <Tap key={id} haptic="light" onPress={() => setFilter(id)} accessibilityState={{ selected: filter === id }} style={[styles.chip, filter === id && { backgroundColor: C.text }]}>
            <T w="b" size={14} color={filter === id ? '#FFF' : C.text}>{label}</T>
          </Tap>
        ))}
      </View>

      {upload ? (
        <View style={styles.uploadCard}>
          <T w="b" size={16}>Not yükle</T>
          <T size={14} color={C.text3} style={{ lineHeight: 20 }}>Kendi notunu, özetini ya da formül kağıdını paylaş. Hocanın slaytlarını ve kitap sayfalarını izinsiz yükleme; bu tür içerik kaldırılır.</T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tap onPress={() => setUpload(false)} style={[styles.uploadBtn, { backgroundColor: '#FFF' }]}><T w="s" size={15}>Vazgeç</T></Tap>
            <Tap haptic="medium" onPress={() => { tapSuccess(); setUpload(false); }} style={[styles.uploadBtn, { backgroundColor: C.primary, flex: 1 }]}><Icon name="upload" size={18} color="#FFF" /><T w="s" size={15} color="#FFF">Fotoğraf veya PDF seç</T></Tap>
          </View>
        </View>
      ) : (
        <Tap haptic="medium" onPress={() => setUpload(true)} style={styles.uploadEntry}>
          <View style={styles.uploadIcon}><Icon name="upload" size={20} color={C.sunText} /></View>
          <View style={{ flex: 1 }}>
            <T w="b" size={16} color="#241200">Notunu paylaş</T>
            <T size={13} color="#4A3100">Beğeni topladıkça profilinde “Not ustası” rozeti çıkar</T>
          </View>
        </Tap>
      )}

      {list.map((n) => {
        const k = KIND_COLOR[n.kind];
        const isSaved = !!saved[n.id];
        return (
          <View key={n.id} style={styles.note}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.kind, { backgroundColor: k.bg }]}><T w="b" size={11} color={k.ink}>{n.kind.toUpperCase()}</T></View>
              <T w="s" size={12} color={C.text2}>{n.code} · {n.course}</T>
            </View>
            <T w="b" size={17} style={{ lineHeight: 22 }}>{n.title}</T>
            <T size={13} color={C.text2}>{n.author} · {n.bolum} · {n.sinif}. sınıf · {n.pages} sayfa · {n.when}</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 2 }}>
              <View style={styles.stat}><Icon name="heart" size={15} color={C.heart} fill={C.heart} strokeWidth={1.5} /><T w="s" size={13}>{n.likes}</T></View>
              <View style={styles.stat}><Icon name="save" size={15} color={C.text2} /><T w="s" size={13}>{n.saves + (isSaved ? 1 : 0)}</T></View>
              <View style={{ flex: 1 }} />
              <Tap onPress={() => { tapLight(); setSaved((x) => ({ ...x, [n.id]: !isSaved })); }} accessibilityState={{ selected: isSaved }} style={[styles.saveBtn, isSaved && { backgroundColor: C.primary }]}>
                <T w="s" size={14} color={isSaved ? '#FFF' : C.primary}>{isSaved ? 'Kaydedildi' : 'Kaydet'}</T>
              </Tap>
            </View>
          </View>
        );
      })}
    </View>
  );
}

type StudyStyle = 'sessiz' | 'soru';

function Calisma({ onCreate }: { onCreate: () => void }) {
  const [joined, setJoined] = React.useState<Record<string, boolean>>({});
  const courses = MY_LESSONS.filter((l, i, a) => a.findIndex((x) => x.code === l.code) === i);
  const [course, setCourse] = React.useState(courses[0].code);
  const [place, setPlace] = React.useState<string>(STUDY_PLACES[0]);
  const [style, setStyle] = React.useState<StudyStyle>('sessiz');
  const [stage, setStage] = React.useState<'form' | 'search' | 'match' | 'coming'>('form');
  const [coming, setComing] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (stage !== 'search') return;
    const t = setTimeout(() => { tapSuccess(); setStage('match'); }, 1600);
    return () => clearTimeout(t);
  }, [stage]);

  const cName = courses.find((c) => c.code === course)?.name ?? '';
  const match = LIB_NOW.find((l) => l.code === course) ?? LIB_NOW[0];

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.lib}>
        <View style={styles.libDeco} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.libIcon}><Icon name="book" size={22} color="#0A5A7A" /></View>
          <View style={{ flex: 1 }}>
            <T w="x" size={20} color="#062F40" style={{ letterSpacing: -0.4 }}>Kütüphane arkadaşı</T>
            <T w="m" size={13} color="#0A4A63">Yalnız çalışma, yanına biri otursun</T>
          </View>
        </View>

        {stage === 'form' ? (
          <>
            <T w="b" size={12} color="#0A4A63">HANGİ DERS?</T>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {courses.map((c) => (
                <Tap key={c.code} onPress={() => { tapLight(); setCourse(c.code); }} style={[styles.libChip, course === c.code && styles.libChipOn]}>
                  <T w="b" size={13} color={course === c.code ? '#FFF' : '#062F40'}>{c.name}</T>
                </Tap>
              ))}
            </ScrollView>
            <T w="b" size={12} color="#0A4A63">NEREDE?</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {STUDY_PLACES.map((p) => (
                <Tap key={p} onPress={() => { tapLight(); setPlace(p); }} style={[styles.libChip, place === p && styles.libChipOn]}>
                  <T w="b" size={13} color={place === p ? '#FFF' : '#062F40'}>{p}</T>
                </Tap>
              ))}
            </View>
            <T w="b" size={12} color="#0A4A63">NASIL?</T>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {([['sessiz', 'Sessiz eşlik', 'Konuşmadan yan yana'], ['soru', 'Soru çözelim', 'Birlikte çalışalım']] as [StudyStyle, string, string][]).map(([id, l, sub]) => (
                <Tap key={id} onPress={() => { tapLight(); setStyle(id); }} style={[styles.styleCard, style === id && styles.libChipOn]}>
                  <T w="b" size={14} color={style === id ? '#FFF' : '#062F40'}>{l}</T>
                  <T size={12} color={style === id ? 'rgba(255,255,255,0.85)' : '#0A4A63'}>{sub}</T>
                </Tap>
              ))}
            </View>
            <Tap haptic="medium" onPress={() => setStage('search')} style={styles.libGo}>
              <T w="b" size={16} color="#FFF">Çalışma arkadaşı bul</T>
            </Tap>
          </>
        ) : null}

        {stage === 'search' ? (
          <View style={{ paddingVertical: 18, alignItems: 'center', gap: 6 }} accessibilityLiveRegion="polite">
            <T w="b" size={16} color="#062F40">{cName} çalışanlar aranıyor…</T>
            <T size={13} color="#0A4A63">{place} · {style === 'sessiz' ? 'Sessiz eşlik' : 'Soru çözelim'}</T>
          </View>
        ) : null}

        {stage === 'match' || stage === 'coming' ? (
          <View style={styles.matchCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar i={match.i} bg={match.bg} size={48} />
              <View style={{ flex: 1 }}>
                <T w="b" size={16}>{match.name} şu an çalışıyor</T>
                <T size={13} color={C.text2}>{match.course} · {match.until}'e kadar</T>
                <T size={13} color={C.text2}>{match.place}</T>
              </View>
            </View>
            {stage === 'match' ? (
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Tap onPress={() => setStage('form')} style={[styles.evBtn, { backgroundColor: C.bg }]}><T w="s" size={14}>Başkası</T></Tap>
                <Tap haptic="medium" onPress={() => { tapSuccess(); setStage('coming'); }} style={[styles.evBtn, { flex: 2, backgroundColor: '#0A7FB0' }]}>
                  <T w="b" size={14} color="#FFF">Yanına geliyorum</T>
                </Tap>
              </View>
            ) : (
              <View style={[styles.comingBox]} accessibilityLiveRegion="polite">
                <Icon name="checkCircle" size={20} color={C.green} />
                <T w="s" size={14} color={C.green} style={{ flex: 1 }}>{match.name.split(' ')[0]}'e haber verildi. Yanına yer tutacak; 50 dk çalışma, 10 dk mola.</T>
              </View>
            )}
          </View>
        ) : null}
      </View>

      <T w="b" size={18} style={{ marginTop: 4 }}>Şu an kütüphanede</T>
      <Card>
        {LIB_NOW.map((l, i) => (
          <View key={l.id}>
            {i > 0 ? <Sep inset={68} /> : null}
            <View style={styles.row}>
              <Avatar i={l.i} bg={l.bg} size={40} />
              <View style={{ flex: 1 }}>
                <T w="s" size={15}>{l.name} · {l.course}</T>
                <T size={12} color={C.text2} numberOfLines={1}>{l.place} · {l.until}'e kadar · {l.style}</T>
              </View>
              <Tap haptic="light" onPress={() => setComing((x) => ({ ...x, [l.id]: !x[l.id] }))} style={[styles.saveBtn, coming[l.id] && { backgroundColor: C.green }]}>
                <T w="s" size={13} color={coming[l.id] ? '#FFF' : C.primary}>{coming[l.id] ? 'Geliyorsun' : 'Yanına otur'}</T>
              </Tap>
            </View>
          </View>
        ))}
      </Card>

      <T w="b" size={18} style={{ marginTop: 4 }}>Çalışma grupları</T>
      {STUDY_TABLES.map((s) => {
        const on = !!joined[s.id];
        return (
          <View key={s.id} style={styles.note}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.sugIcon, { width: 40, height: 40, borderRadius: 12, backgroundColor: '#6D4AFF' }]}><Icon name="book" size={20} color="#FFF" /></View>
              <View style={{ flex: 1 }}>
                <T w="b" size={16}>{s.course}</T>
                <T size={13} color={C.text2}>{s.place} · {s.time}</T>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.needPill}><T w="b" size={12} color={C.tintText}>{s.need} kişi aranıyor</T></View>
              {s.quiet ? <View style={[styles.needPill, { backgroundColor: '#DBF5F4' }]}><T w="b" size={12} color="#05605F">Sessiz masa</T></View> : null}
              <View style={{ flex: 1 }} />
              <Tap haptic="medium" onPress={() => setJoined((x) => ({ ...x, [s.id]: !on }))} style={[styles.saveBtn, { backgroundColor: on ? C.green : C.primary }]}>
                <T w="s" size={14} color="#FFF">{on ? 'Katıldın' : 'Katıl'}</T>
              </Tap>
            </View>
          </View>
        );
      })}
      <PrimaryButton title="Çalışma masası aç" onPress={onCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  capBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  day: { flex: 1, height: 48, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', gap: 3 },
  todayDot: { width: 5, height: 5, borderRadius: 3 },
  lesson: { flexDirection: 'row', gap: 12 },
  timeCol: { width: 48, paddingTop: 6 },
  lessonCard: { flex: 1, borderRadius: 16, padding: 14, gap: 2 },
  freeCard: { flex: 1, borderRadius: 16, padding: 12, gap: 8, backgroundColor: '#FFF', borderWidth: 2, borderColor: C.greenBg, borderStyle: 'dashed' },
  freeTag: { backgroundColor: C.greenBg, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  suggest: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.bg, borderRadius: 12, padding: 8 },
  sugIcon: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, minHeight: 50 },
  chip: { height: 38, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  uploadEntry: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.sun, borderRadius: 18, padding: 14 },
  uploadIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  uploadCard: { backgroundColor: C.tint, borderRadius: 18, padding: 14, gap: 10 },
  uploadBtn: { height: 44, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  note: { backgroundColor: '#FFF', borderRadius: 20, padding: 14, gap: 8 },
  kind: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveBtn: { height: 34, paddingHorizontal: 14, borderRadius: 10, backgroundColor: C.tint, justifyContent: 'center' },
  event: { backgroundColor: '#FFF', borderRadius: 22, overflow: 'hidden' },
  eventHead: { padding: 16, gap: 6, overflow: 'hidden' },
  eventDeco: { position: 'absolute', right: -30, top: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.16)' },
  eventKind: { backgroundColor: '#FFF', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  evBtn: { flex: 1, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  lib: { backgroundColor: '#BDEBFF', borderRadius: 24, padding: 16, gap: 10, overflow: 'hidden' },
  libDeco: { position: 'absolute', right: -40, top: -50, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.35)' },
  libIcon: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  libChip: { paddingHorizontal: 12, height: 34, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.75)', justifyContent: 'center' },
  libChipOn: { backgroundColor: '#0A7FB0' },
  styleCard: { flex: 1, borderRadius: 14, padding: 10, backgroundColor: 'rgba(255,255,255,0.75)', gap: 2 },
  libGo: { height: 50, borderRadius: 14, backgroundColor: '#062F40', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  matchCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 14, gap: 12 },
  comingBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.greenBg, borderRadius: 12, padding: 10 },
  needPill: { backgroundColor: C.tint, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
