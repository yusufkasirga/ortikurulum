import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import Icon from '../../components/Icon';
import { Avatar, NavBack, PrimaryButton, T, Tap, tapLight, tapSuccess } from '../../components/ui';
import { NOTES } from './data';
import { KIND_COLOR, PaperThumb, courseColor } from './noteUi';
import type { ScreenProps } from '../../core/navigation';
import { track } from '../../core/analytics';

export default function NotDetay({ navigation, route }: ScreenProps<'NotDetay'>) {
  const insets = useSafeAreaInsets();
  const n = NOTES.find((x) => x.id === route.params.id) ?? NOTES[0];
  const k = KIND_COLOR[n.kind];
  const accent = courseColor(n.code);
  const [saved, setSaved] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [thanked, setThanked] = React.useState(false);
  const similar = NOTES.filter((x) => x.id !== n.id && (x.code === n.code || x.bolum === n.bolum)).slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={[styles.hero, { backgroundColor: k.bg, paddingTop: insets.top + 4 }]}>
          <View style={{ alignSelf: 'flex-start', marginLeft: 12 }}><NavBack label="Notlar" onPress={() => navigation.goBack()} /></View>
          <View style={styles.stack} accessibilityLabel={`${n.pages} sayfalık not önizlemesi`}>
            <View style={{ position: 'absolute', left: 34, top: 12 }}><PaperThumb note={n} width={150} height={196} tilt={8} /></View>
            <View style={{ position: 'absolute', left: 14, top: 6 }}><PaperThumb note={n} width={150} height={196} tilt={-4} /></View>
            <View style={{ position: 'absolute', left: 24, top: 0 }}><PaperThumb note={n} width={150} height={196} tilt={1} /></View>
          </View>
          <View style={styles.pages}><T w="b" size={12} color="#FFF">{n.pages} sayfa · önizleme</T></View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 18, gap: 16 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <View style={[styles.pill, { backgroundColor: accent }]}><T w="b" size={12} color="#FFF">{n.code} · {n.course}</T></View>
              <View style={[styles.pill, { backgroundColor: k.bg }]}><T w="b" size={12} color={k.ink}>{n.kind}</T></View>
            </View>
            <T w="x" size={26} style={{ letterSpacing: -0.6, lineHeight: 31 }} accessibilityRole="header">{n.title}</T>
          </View>

          <View style={styles.author}>
            <Avatar i={n.author.split(' ').map((x) => x[0]).join('').slice(0, 2)} bg="#CFE3FF" size={46} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <T w="b" size={16}>{n.author}</T>
                {n.likes >= 100 ? <View style={styles.master}><T w="b" size={10} color="#241200">NOT USTASI</T></View> : null}
              </View>
              <T size={13} color={C.text2}>{n.bolum} · {n.sinif}. sınıf · {n.when}</T>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Tap haptic="light" onPress={() => setLiked((x) => !x)} accessibilityState={{ selected: liked }} style={[styles.stat, liked && { backgroundColor: '#FFE3EA' }]}>
              <Icon name="heart" size={20} color={C.heart} fill={liked ? C.heart : 'none'} />
              <T w="x" size={18}>{n.likes + (liked ? 1 : 0)}</T>
              <T size={11} color={C.text2}>beğeni</T>
            </Tap>
            <View style={styles.stat}>
              <Icon name="save" size={20} color={C.primary} />
              <T w="x" size={18}>{n.saves + (saved ? 1 : 0)}</T>
              <T size={11} color={C.text2}>kayıt</T>
            </View>
            <Tap haptic="light" onPress={() => { tapSuccess(); setThanked(true); }} disabled={thanked} style={[styles.stat, thanked && { backgroundColor: C.greenBg }]}>
              <Icon name={thanked ? 'check' : 'cup'} size={20} color={thanked ? C.green : C.urgent} />
              <T w="b" size={13} color={thanked ? C.green : C.text}>{thanked ? 'Teşekkür' : 'Teşekkür et'}</T>
              <T size={11} color={C.text2}>{thanked ? 'gönderildi' : 'bir çay ısmarla'}</T>
            </Tap>
          </View>

          <Tap onPress={() => navigation.navigate('Tabs', { screen: 'Kampus', params: { tab: 'calisma' } })} style={styles.studyCta}>
            <View style={styles.studyIcon}><Icon name="book" size={20} color="#0A5A7A" /></View>
            <View style={{ flex: 1 }}>
              <T w="b" size={15} color="#062F40">Bu dersten çalışma arkadaşı bul</T>
              <T size={13} color="#0A4A63">{n.course} çalışanlar şu an kütüphanede</T>
            </View>
            <Icon name="chevRight" size={14} color="#062F40" strokeWidth={3} />
          </Tap>

          {similar.length ? (
            <View style={{ gap: 10 }}>
              <T w="b" size={18}>Benzer notlar</T>
              {similar.map((s) => (
                <Tap key={s.id} onPress={() => { tapLight(); navigation.push('NotDetay', { id: s.id }); }} style={styles.similar}>
                  <PaperThumb note={s} width={46} height={60} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <T w="b" size={14} numberOfLines={2}>{s.title}</T>
                    <T size={12} color={C.text2}>{s.code} · {s.author} · ♥ {s.likes}</T>
                  </View>
                </Tap>
              ))}
            </View>
          ) : null}

          <Tap style={{ alignSelf: 'center', minHeight: 44, justifyContent: 'center' }}>
            <T w="s" size={14} color={C.text2}>Telif veya uygunsuz içerik bildir</T>
          </Tap>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <PrimaryButton title={saved ? 'Kaydedildi · çevrimdışı açılır' : 'Kaydet ve indir'} color={saved ? C.green : C.primary} onPress={() => { tapSuccess(); setSaved(true); track('not_kaydet', { not: n.id }); }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingBottom: 22, gap: 10 },
  stack: { width: 210, height: 220 },
  pages: { backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  pill: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  author: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 18, padding: 12 },
  master: { backgroundColor: C.sun, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  stat: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 12, alignItems: 'center', gap: 2 },
  studyCta: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#BDEBFF', borderRadius: 18, padding: 14 },
  studyIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  similar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderRadius: 16, padding: 10 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, backgroundColor: 'rgba(244,243,250,0.97)' },
});
