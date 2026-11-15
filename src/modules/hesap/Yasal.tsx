import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../core/theme';
import { NavBack, T } from '../../components/ui';
import type { ScreenProps } from '../../core/navigation';

/**
 * Legal texts. DRAFTS written for the pilot — must be reviewed by a KVKK lawyer before going live
 * (veri sorumlusu unvanı, adres, VERBİS kaydı, yurt dışı aktarım bilgisi eklenecek).
 */
const DOCS: Record<'kvkk' | 'kosullar' | 'topluluk', { title: string; body: [string, string][] }> = {
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    body: [
      ['Veri sorumlusu', '[ŞİRKET UNVANI], [ADRES]. İletişim: [KVKK E-POSTA].'],
      ['Hangi verileri işliyoruz', 'Telefon numarası, öğrenci e-posta adresi, ad ve profil bilgileri, kampüs/bölüm, oluşturduğun ve katıldığın masalar, mesajlar, puanlar ve şikayetler, yaklaşık konum (izin verirsen), cihaz bildirim anahtarı ve anonim kullanım istatistikleri.'],
      ['Kimlik doğrulama', 'Cinsiyete özel masalar için isteğe bağlıdır. Kimlik görüntüsü ve yüz görüntüsü yetkili doğrulama hizmet sağlayıcısında, açık rızanla ve yalnızca karşılaştırma için işlenir; doğrulama sonrası silinir. Orti yalnızca “doğrulandı, cinsiyet, 18 yaş üstü” sonucunu saklar.'],
      ['Amaçlar', 'Hesabın oluşturulması ve güvenliği, oyuncu eşleştirme, masa ve sohbet hizmeti, sahte hesap ve kötüye kullanımın önlenmesi, şikayetlerin incelenmesi, hizmetin iyileştirilmesi.'],
      ['Hukuki sebepler', 'Sözleşmenin kurulması ve ifası (KVKK m.5/2-c), meşru menfaat (m.5/2-f), hukuki yükümlülük (m.5/2-ç); biyometrik veri ve isteğe bağlı bildirimler için açık rıza (m.6, m.5/1).'],
      ['Aktarım', 'Barındırma, SMS ve bildirim hizmet sağlayıcılarına, hizmetin gerektirdiği ölçüde. Yurt dışı aktarım varsa: [ÜLKE/DAYANAK].'],
      ['Saklama süresi', 'Hesabın açık olduğu sürece; silindiğinde 30 gün içinde silinir. Şikayet kayıtları ilgili mevzuattaki süreler boyunca anonimleştirilerek tutulur.'],
      ['Hakların (m.11)', 'Verilerine erişme, düzeltme, silme, işlemeye itiraz ve aktarılan kişileri öğrenme haklarını Ayarlar › Verilerimi indir / Hesabımı sil üzerinden ya da [KVKK E-POSTA] adresine yazarak kullanabilirsin.'],
    ],
  },
  kosullar: {
    title: 'Kullanım Koşulları',
    body: [
      ['Kimler kullanabilir', '18 yaşını doldurmuş, gerçek kimliğiyle kayıt olan kullanıcılar.'],
      ['Masalar ve mekanlar', 'Orti oyuncuları buluşturur; mekanların hizmetinden, fiyatlarından ve kurallarından mekanlar sorumludur. Kampanyalar “Reklam” etiketiyle gösterilir.'],
      ['Gelmeme ve güven skoru', 'Katıldığın masaya gelmemen veya son anda iptal etmen güven skorunu düşürür; tekrarlanırsa masa açma ve katılma kısıtlanır.'],
      ['İçerik', 'Paylaştığın ders notlarının sana ait olduğunu veya paylaşma iznin olduğunu kabul edersin. Telif ihlali bildirilen içerik kaldırılır.'],
      ['Hesabın sonlandırılması', 'Topluluk Kuralları’nın ihlalinde hesap uyarılabilir, askıya alınabilir veya kapatılabilir.'],
    ],
  },
  topluluk: {
    title: 'Topluluk Kuralları',
    body: [
      ['Saygı', 'Hakaret, aşağılama, nefret söylemi ve ayrımcılık yok.'],
      ['Güvenlik', 'Taciz, tehdit, ısrarlı ve istenmeyen iletişim anında hesap kapatma sebebidir. Acil durumda önce 112’yi ara.'],
      ['Dürüst oyun', 'Hile, sahte profil ve başkası adına hesap yok.'],
      ['Sözüne sadık ol', 'Katıldığın masaya git; gelemiyorsan en az 1 saat önce haber ver.'],
      ['Kadın masaları', 'Yalnızca kimliği doğrulanmış kadın oyuncular içindir; bu kuralı aşmaya çalışmak kalıcı yasak sebebidir.'],
    ],
  },
};

export default function Yasal({ navigation, route }: ScreenProps<'Yasal'>) {
  const insets = useSafeAreaInsets();
  const d = DOCS[route.params.doc];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }} contentContainerStyle={{ paddingTop: insets.top + 4, paddingHorizontal: 20, paddingBottom: insets.bottom + 40, gap: 16 }}>
      <View style={{ marginLeft: -8 }}><NavBack label="Geri" onPress={() => navigation.goBack()} /></View>
      <T w="x" size={28} style={{ letterSpacing: -0.6 }} accessibilityRole="header">{d.title}</T>
      <View style={{ backgroundColor: C.warnBg, borderRadius: 12, padding: 12 }}>
        <T w="s" size={13} color={C.warnText}>Taslak metin — yayından önce hukuk incelemesi gerekir.</T>
      </View>
      {d.body.map(([h, p]) => (
        <View key={h} style={{ gap: 4 }}>
          <T w="b" size={17}>{h}</T>
          <T size={15} color={C.text3} style={{ lineHeight: 22 }}>{p}</T>
        </View>
      ))}
    </ScrollView>
  );
}
