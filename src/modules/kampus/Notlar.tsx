import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { C, F } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import { ME_CAMPUS, MY_LESSONS, NOTES, Note } from './data';
import { KIND_COLOR, PaperThumb, courseColor } from './noteUi';

type Scope = 'derslerim' | 'bolumum' | 'tumu';

const AVATAR_BG = ['#CFE3FF', '#FFF1C2', '#E8DAFF', '#D3F0DA', '#FFE3E8', '#FFD8B5'];
const initials = (n: string) => n.split(' ').map((x) => x[0]).join('').slice(0, 2);

export default function Notlar({ onOpen }: { onOpen: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const colW = Math.floor((width - 40 - 12) / 2);
  const [scope, setScope] = React.useState<Scope>('derslerim');
  const [course, setCourse] = React.useState<string | undefined>();
  const [q, setQ] = React.useState('');
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});
  const [upload, setUpload] = React.useState(false);

  const myCodes = new Set(MY_LESSONS.map((l) => l.code));
  const courses = MY_LESSONS.filter((l, i, a) => a.findIndex((x) => x.code === l.code) === i);
  const list = NOTES
    .filter((n) => scope === 'tumu' || (scope === 'bolumum' ? n.bolum === ME_CAMPUS.bolum : myCodes.has(n.code)))
    .filter((n) => !course || n.code === course)
    .filter((n) => !q.trim() || `${n.title} ${n.course} ${n.code}`.toLocaleLowerCase('tr').includes(q.trim().toLocaleLowerCase('tr')));
  const star = [...NOTES].sort((a, b) => b.saves - a.saves)[0];
  const masters = Object.values(NOTES.reduce<Record<string, { name: string; likes: number }>>((acc, n) => {
    if (n.mine) return acc;
    acc[n.author] = { name: n.author, likes: (acc[n.author]?.likes ?? 0) + n.likes };
    return acc;
  }, {})).sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <View style={{ gap: 16 }}>
      <View style={styles.search}>
        <Icon name="search" size={18} color={C.text2} />
        <TextInput value={q} onChangeText={setQ} placeholder="Ders, konu veya kod ara" placeholderTextColor={C.gray} accessibilityLabel="Notlarda ara"
          style={{ flex: 1, fontFamily: F.r, fontSize: 16, color: C.text, paddingVertical: 0 }} />
      </View>

      {/* Star of the week */}
      {!q && !course ? (
        <Tap onPress={() => onOpen(star.id)} style={[styles.star, { backgroundColor: courseColor(star.code) }]} accessibilityLabel={`Haftanın notu: ${star.title}`}>
          <View style={styles.starDeco} />
          <View style={{ flex: 1, gap: 6 }}>
            <View style={styles.starTag}><T w="b" size={11} color="#241200">HAFTANIN NOTU</T></View>
            <T w="x" size={19} color="#FFF" numberOfLines={3} style={{ letterSpacing: -0.3, lineHeight: 23 }}>{star.title}</T>
            <T w="s" size={13} color="#FFFFFF">{star.code} · {star.author}</T>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
              <T w="b" size={13} color="#FFF">♥ {star.likes}</T>
              <T w="b" size={13} color="#FFF">{star.saves} kayıt</T>
            </View>
          </View>
          <View style={{ width: 92, height: 120 }}>
            <View style={{ position: 'absolute', left: 10, top: 6 }}><PaperThumb note={star} width={78} height={104} tilt={9} /></View>
            <PaperThumb note={star} width={78} height={104} tilt={-6} />
          </View>
        </Tap>
      ) : null}

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {([['derslerim', 'Derslerim'], ['bolumum', 'Bölümüm'], ['tumu', 'Tüm kampüs']] as [Scope, string][]).map(([id, label]) => (
            <Tap key={id} haptic="light" onPress={() => { setScope(id); setCourse(undefined); }} accessibilityState={{ selected: scope === id }} style={[styles.chip, scope === id && { backgroundColor: C.text }]}>
              <T w="b" size={14} color={scope === id ? '#FFF' : C.text}>{label}</T>
            </Tap>
          ))}
        </View>
        {scope === 'derslerim' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}>
            {courses.map((c) => {
              const on = course === c.code;
              return (
                <Tap key={c.code} haptic="light" onPress={() => setCourse(on ? undefined : c.code)} accessibilityState={{ selected: on }}
                  style={[styles.course, { backgroundColor: on ? c.color : '#FFF', borderColor: c.color }]}>
                  <View style={[styles.courseDot, { backgroundColor: on ? '#FFF' : c.color }]} />
                  <T w="b" size={13} color={on ? '#FFF' : C.text}>{c.code}</T>
                </Tap>
              );
            })}
          </ScrollView>
        ) : null}
      </View>

      {upload ? (
        <View style={styles.uploadCard}>
          <T w="b" size={16}>Not yükle</T>
          <T size={14} color={C.text3} style={{ lineHeight: 20 }}>Kendi notunu, özetini ya da formül kağıdını paylaş. Hocanın slaytlarını ve kitap sayfalarını izinsiz yükleme; bu tür içerik kaldırılır.</T>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Tap onPress={() => setUpload(false)} style={[styles.uploadBtn, { backgroundColor: '#FFF' }]}><T w="s" size={15}>Vazgeç</T></Tap>
            <Tap haptic="medium" onPress={() => { tapSuccess(); setUpload(false); }} style={[styles.uploadBtn, { backgroundColor: C.primary, flex: 1 }]}>
              <Icon name="upload" size={18} color="#FFF" /><T w="s" size={15} color="#FFF">Fotoğraf veya PDF seç</T>
            </Tap>
          </View>
        </View>
      ) : (
        <Tap haptic="medium" onPress={() => setUpload(true)} style={styles.uploadEntry}>
          <View style={styles.uploadIcon}><Icon name="upload" size={20} color={C.sunText} /></View>
          <View style={{ flex: 1 }}>
            <T w="b" size={16} color="#241200">Notunu paylaş</T>
            <T size={13} color="#4A3100">100 beğenide “Not ustası” rozeti</T>
          </View>
          <Icon name="chevRight" size={14} color="#241200" strokeWidth={3} />
        </Tap>
      )}

      {/* Grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {list.map((n) => (
          <NoteCard key={n.id} n={n} width={colW} saved={!!saved[n.id]} onOpen={() => onOpen(n.id)}
            onSave={() => { tapLight(); setSaved((x) => ({ ...x, [n.id]: !x[n.id] })); }} />
        ))}
        {list.length === 0 ? <T size={15} color={C.text2}>Bu filtrede not yok. İlk notu sen paylaş.</T> : null}
      </View>

      {/* Leaderboard */}
      <View style={styles.board}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T w="b" size={17}>Not ustaları</T>
          <T w="s" size={12} color={C.text2}>Bu ay · ERÜ</T>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {masters.map((m, i) => (
            <View key={m.name} style={{ alignItems: 'center', gap: 4, width: 72 }}>
              <View>
                <Avatar i={initials(m.name)} bg={AVATAR_BG[i % AVATAR_BG.length]} size={52} />
                <View style={[styles.rank, i === 0 && { backgroundColor: C.sun }]}><T w="x" size={11} color={i === 0 ? '#241200' : '#FFF'}>{i + 1}</T></View>
              </View>
              <T w="s" size={12} numberOfLines={1}>{m.name}</T>
              <T size={11} color={C.text2}>♥ {m.likes}</T>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function NoteCard({ n, width, saved, onOpen, onSave }: { n: Note; width: number; saved: boolean; onOpen: () => void; onSave: () => void }) {
  const k = KIND_COLOR[n.kind];
  const accent = courseColor(n.code);
  return (
    <Tap onPress={onOpen} style={[styles.card, { width }]} accessibilityLabel={`${n.title}, ${n.course}, ${n.author}`}>
      <View style={[styles.thumbWrap, { backgroundColor: k.bg }]}>
        <PaperThumb note={n} width={width - 56} height={96} tilt={-3} />
        <Tap onPress={onSave} accessibilityLabel={saved ? 'Kaydedildi' : 'Kaydet'} accessibilityState={{ selected: saved }} style={styles.saveFab}>
          <Icon name="save" size={16} color={saved ? '#FFF' : C.text} fill={saved ? '#FFF' : 'none'} />
        </Tap>
        {saved ? <View style={[styles.saveFab, { backgroundColor: C.primary, zIndex: -1 }]} /> : null}
      </View>
      <View style={{ padding: 10, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <T w="b" size={11} color={C.text2}>{n.code}</T>
          <T w="b" size={11} color={k.ink}>· {n.kind}</T>
        </View>
        <T w="b" size={14} numberOfLines={2} style={{ lineHeight: 18 }}>{n.title}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
          <T size={12} color={C.text2} numberOfLines={1} style={{ flex: 1 }}>{n.author}</T>
          <T w="b" size={12} color={C.heartText}>♥ {n.likes}</T>
        </View>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 46, borderRadius: 14, backgroundColor: '#FFF', paddingHorizontal: 14 },
  star: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 24, padding: 16, overflow: 'hidden' },
  starDeco: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -60, bottom: -90, backgroundColor: 'rgba(255,255,255,0.14)' },
  starTag: { alignSelf: 'flex-start', backgroundColor: C.sun, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  chip: { height: 38, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  course: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1.5 },
  courseDot: { width: 8, height: 8, borderRadius: 4 },
  uploadEntry: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.sun, borderRadius: 18, padding: 14 },
  uploadIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  uploadCard: { backgroundColor: C.tint, borderRadius: 18, padding: 14, gap: 10 },
  uploadBtn: { height: 44, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  card: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden' },
  thumbWrap: { height: 124, alignItems: 'center', justifyContent: 'center' },
  saveFab: { position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  board: { backgroundColor: '#FFF', borderRadius: 22, padding: 16, gap: 14 },
  rank: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: C.text, borderWidth: 2, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
});
