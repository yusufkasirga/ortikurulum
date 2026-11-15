import React from 'react';
import { ScrollView, View } from 'react-native';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, Card, PrimaryButton, Sep, T, Tap, Toggle, tapLight, tapSuccess } from '../../components/ui';
import { styles } from './styles';
import { LIB_NOW, MY_LESSONS, STUDY_PLACES, STUDY_TABLES } from './data';

type StudyStyle = 'sessiz' | 'soru';

export default function Kutuphane({ onCreate }: { onCreate: () => void }) {
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
