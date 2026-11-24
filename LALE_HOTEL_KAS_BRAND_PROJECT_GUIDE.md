# LALE HOTEL KAŞ — PROJECT CONTEXT & BRAND GUIDELINES
> Codex / tasarım ve geliştirme ekibi için ana proje bağlamı  
> Sürüm: 1.0 · Tarih: 24 Kasım 2026  
> Resmî site: https://lalehotelkas.com  
> **Bu dosya bir uygulama spesifikasyonudur.** `Doğrulandı`, `Müşteri talebi`, `Tasarım önerisi`, `Doğrulanacak` ayrımları kritiktir.

---

## 0. CODEX İÇİN BAŞLANGIÇ TALİMATI

Lale Hotel Kaş'ın mevcut web sitesini, özgün marka kimliğini koruyarak **modern, zarif, görsel açıdan güçlü, yüksek performanslı, üç dilli ve doğrudan rezervasyon odaklı** bir butik otel platformuna dönüştür.

**Öncelik sırası:** (1) marka uyumu ve iyi UI/UX, (2) eksiksiz çalışan iç sayfalar, (3) uçtan uca rezervasyon kullanıcı yolculuğu, (4) performans ve erişilebilirlik, (5) SEO/GEO ve analitik, (6) HMS/ödeme entegrasyonlarına hazır mimari.

- **Tek sayfalı vitrin demo yapma.** Bütün menü ve oda detayları çalışan sayfalara açılsın.
- Özel takvim, tarih aralığı, misafir sayacı ve ilgili kontroller **markaya özel HTML/CSS/JS arayüz bileşenleri** olmalı; varsayılan tarayıcı `select` ve `date` kontrollerine dayanan kaba bir UI istemiyoruz.
- GSAP + ScrollTrigger ile **rafine, ölçülü, performans dostu** animasyonlar kullan. Her bölümün aynı fade-up animasyonuna sahip olduğu şablon tasarımdan kaçın.
- Görseller kesinlikle kırık çıkmamalı. **Yerel asset / optimize edilmiş dosya / fallback** yaklaşımını kullan; rastgele harici image URL'lerine bağlı kalma.
- Demo modunda sahte fiyat, gerçek müsaitlik, ödeme alındı veya rezervasyon tamamlandı iddiası üretme. HMS API ve POS bağlanana kadar açıkça `Demo` durumlarını kullan.
- Kullanıcıdan gelen mevcut logo **değiştirilmeden** kullanılmalı. Logo `IMG_1726.png` olarak sağlandı; dosyayı projeye kopyalayıp anlaşılır adlandır.
- Kod yeniden kullanılabilir bileşenlere ayrılmalı; her sayfada yinelenen büyük gömülü CSS/JS blokları yerine ortak tasarım sistemi kurulmalı.
- Mevcut canlı sitenin SEO değeri korunmalı; URL envanteri + 301 planı olmadan yayına çıkılmamalı.

---

## 1. PROJE KİMLİĞİ

| Alan | Değer | Durum |
|---|---|---|
| Marka | **Lale Hotel Kaş** | Doğrulandı |
| Domain | **lalehotelkas.com** | Doğrulandı |
| Yer | Kaş, Antalya, Türkiye | Doğrulandı |
| Adres | Andifli Mahallesi, Hükümet Caddesi No: 19, Kaş / Antalya | Mevcut sitede yazıyor; finalde teyit |
| Sabit telefon | +90 242 836 10 74 | Mevcut sitede |
| E-posta | info@lalehotelkas.com | Mevcut sitede |
| Diğer iletişimler | 0533 215 3595 / 0532 500 6704 | Mevcut sitede; öncelik/WhatsApp teyit |
| Oda sayısı | 18 | Mevcut sitede |
| Oda büyüklükleri | Genel olarak 15–30 m² | Mevcut sitede |
| Hikâye | 1970'lere uzanan geçmiş; 2017'de kapsamlı yenileme | Mevcut sitede |
| Diller | Türkçe, İngilizce, Almanca | Müşteri talebi + mevcut site |
| PMS / HMS | HMS Otel Yönetim Sistemi — REST API entegrasyonu isteniyor | Müşteri talebi, API erişimi henüz alınmadı |
| Ödeme | Banka sanal POS / iyzico / alternatif PSP, mümkün olan taksitler | Değerlendirilecek |
| Birincil iş hedefi | Web sitesi üzerinden doğrudan rezervasyon ve satış | Müşteri talebi |

**Kaynak:** https://lalehotelkas.com/ , https://lalehotelkas.com/en , https://lalehotelkas.com/de  
**Dikkat:** Adres ve iletişim ifadeleri dil sürümlerinde farklı yazılmış. Nihai yapılandırılmış veri ve footer öncesinde işletmeyle tek bir kanonik iletişim seti onaylanmalı.

### Markanın öyküsü
1970'lere dayanan, aile kökleri bulunan, 2017'de yenilenmiş bir Kaş oteli. Eski sitedeki anlatımda misafire “ikinci ev” hissi ön planda. Bunu çağdaş ve doğal bir anlatıyla güncelle: **samimi misafirperverlik + Kaş'ın ruhu + deniz/ada manzarası + yalın konfor**. Tarihî veya ailevi iddiaları genişletip yeni olgular uydurma.

### Güvenlik / sosyal medya notu
Mevcut sitede geçmişte `@lalehotelkas` Instagram hesabının ele geçirilmesi ve sahte ödeme talepleri hakkında bir uyarı yer alıyor. Bu **kritik bir güven konusudur**: güncel doğru sosyal hesap ve duyurunun geçerliliği otelle teyit edilmeden eski hesabı resmî sosyal bağlantı olarak koyma. Resmî ödeme kanallarını şeffaf biçimde göster.

---

## 2. LOGO ve RENK SİSTEMİ

### Orijinal logo
- Kullanıcının ilettiği şeffaf PNG: `IMG_1726.png` (200 × 45 px).
- Lale sembolü ve marka yazı karakteri korunmalı; yeni logo çizme / rastgele logo ikame etme.
- Logo PNG'sinden ölçülen **baskın opak pembe/fuşya RGB (238, 23, 126) = `#EE177E`**.
- Koyu zeminde bu logo yeterli kontrast vermiyorsa onaylı bir açık renk varyantı üretilmeli; kontrolsüz renklendirme yapılmamalı.
- Logonun yüksek çözünürlüklü / vektörel hali otelden talep edilecek. Mevcut PNG küçük olduğu için aşırı büyütülmemeli.

### Önerilen tasarım paleti (logo ana rengi sabit; diğerleri kreatif öneri)

| Token | HEX | Kullanım |
|---|---|---|
| `--brand-primary` | `#EE177E` | Logo fuşyası, seçili durumlar, ana CTA |
| `--brand-primary-hover` | `#C91068` | CTA hover, koyu vurgu |
| `--brand-primary-soft` | `#FCE7F1` | Seçili tarih aralığı, yumuşak yüzey |
| `--ink` | `#252B30` | Başlıklar, ana metin |
| `--text-muted` | `#667077` | Yardımcı metin |
| `--background` | `#FAF8F5` | Ana kırık beyaz |
| `--surface` | `#FFFFFF` | Kart / form / modal |
| `--sand` | `#EDE4D8` | Sıcak taş ve kum yüzeyleri |
| `--sea` | `#285C65` | İkincil Akdeniz vurgusu; ölçülü kullan |
| `--border` | `#E8E3DF` | Çizgiler / alan kenarları |
| `--success` | `#22765E` | Doğrulanmış başarılı işlem |
| `--error` | `#B84C54` | Hata / validasyon |

```css
:root {
  --brand-primary: #EE177E;
  --brand-primary-hover: #C91068;
  --brand-primary-soft: #FCE7F1;
  --ink: #252B30;
  --text-muted: #667077;
  --background: #FAF8F5;
  --surface: #FFFFFF;
  --sand: #EDE4D8;
  --sea: #285C65;
  --border: #E8E3DF;
  --success: #22765E;
  --error: #B84C54;
  --radius-card: 18px;
  --radius-control: 12px;
  --radius-pill: 999px;
}
```

**Renk kullanım ilkesi:** Fuşyayı ana sayfanın her yerine yayma. Geniş alanlarda beyaz/kırık beyaz, sıcak kum rengi ve gerçek fotoğraflar baskın olsun. Fuşya marka imzası ve rezervasyon eylemlerini vurgulasın. `#285C65` tasarıma yardımcı deniz tonu; **ikinci ana marka rengi değildir**.

### Tipografi — öneri
- Editorial / gösterişli başlık: **Cormorant Garamond** veya **DM Serif Display**.
- Arayüz, navigasyon, formlar: **Manrope** veya **Inter**.
- En fazla iki font ailesi, kontrollü ağırlıklar ve `font-display: swap`.
- H1 zarif ve büyük olabilir; form alanları, kart başlıkları ve küçük ekranlar asla kaba veya dev boyutlu olmamalı.
- Türkçe karakter, Almanca umlaut ve çok dilli metin taşmaları kontrol edilmeli.

---

## 3. MARKA DİLİ (BRAND VOICE & TONE OF VOICE)

### Marka konumlandırması
**Kaş'ın merkezinde, yerel hikâyesi olan, sıcak misafirperverliği çağdaş konforla birleştiren butik konaklama deneyimi.**

### Kişilik
- **Zarif:** sakin, kaliteli, incelikli
- **Samimi:** aile işletmesi sıcaklığını hissettiren, fakat aşırı laubali olmayan
- **Yerel:** Kaş'ı bilen ve misafire doğru rehberlik eden
- **Davetkâr:** deneyimi anlatan, sert satış dili kullanmayan
- **Güvenilir:** oda özellikleri, ücretler, şartlar ve ödeme konusunda şeffaf

### Dil kuralları
- Türkçe ana dilde **“siz”** hitabı; sıcak ama ölçülü.
- Kısa, akıcı, somut ve duyusal cümleler.
- Akdeniz ışığı, ada/Meis manzarası, sabah kahvaltısı, Kaş sokakları, deniz ve dinginlik gibi **doğrulanmış deneyimleri** kullan.
- “Türkiye'nin en iyi oteli”, “garantili en ucuz fiyat”, “lüks 5 yıldızlı” gibi kanıtsız iddialar **yasak**.
- “Unutulmaz deneyim”, “eşsiz tatil”, “mükemmel konfor” gibi klişeleri aşırı kullanma.
- Odaya özel deniz manzarası yalnızca o oda tipinin doğrulanmış özelliğiyse yazılmalı.
- Ücret, kahvaltı dahil olma durumu, iptal şartı, giriş/çıkış saatleri gibi operasyonel bilgileri doğrulamadan uydurma.

### Örnek metinler — taslak / kesin işletme iddiası değil

**TR Hero:** “Kaş'ın ritminde, kendinize ait bir mola.”  
**TR Hero destek:** “Akdeniz'in ışığı, Kaş'ın sokakları ve ev sıcaklığında bir konaklama deneyimi.”  
**TR CTA:** “Odaları Keşfedin” / “Müsaitliği Kontrol Et” / “Rezervasyona Devam Et”  
**TR Hikâye:** “Geçmişten gelen misafirperverliği, bugünün yalın konforuyla buluşturuyoruz.”  
**TR Form mikro metni:** “Tarihlerinizi seçin, size uygun odaları gösterelim.”

**EN Hero:** “A slower stay in the heart of Kaş.”  
**EN CTA:** “Explore Rooms” / “Check Availability” / “Continue Booking”

**DE Hero:** “Eine kleine Auszeit im Herzen von Kaş.”  
**DE CTA:** “Zimmer entdecken” / “Verfügbarkeit prüfen” / “Buchung fortsetzen”

> Bu metinler kreatif öneridir. İngilizce/Almanca içerikler doğal ve yerel dil beklentisine uygun editoryal kontrolden geçirilmelidir; kelime kelime makine çevirisi gibi olmamalıdır.

### UI metin ilkeleri
- Ana CTA: **Müsaitliği Kontrol Et** → sonuçta **Oda Seç** → **Bilgilerim** → **Ödeme** → **Rezervasyon Onayı**.
- Gerçek HMS kontrol edilmediyse “Müsait” / “Son oda” gösterme.
- Sahte kıtlık, sahte yorum, sahte yıldız puanı ve sahte indirim kullanma.
- Ödeme aşamasında toplam tutar, para birimi, vergi/ücret açıklamaları ve iptal kuralları anlaşılır görünsün.

---

## 4. GÖRSEL KİMLİK ve FOTOĞRAF STRATEJİSİ

**Müşteri talebi:** Asıl otel fotoğrafları flash bellekte. Gerekli düzenlemeler bu materyallerle yapılacak; ilk aşamada mevcut web sitesinden alınan **otelin kendisine ait** görseller geçici kullanılabilir (kullanım hakkı/doğruluk teyit edilerek).

### Fotoğraf işleme
- Kadrajı bozan kablolar, gereksiz masa/sandalye ve küçük dağınıklıklar temizlenebilir.
- Fotoğraflar birbiriyle tutarlı beyaz dengesi, perspektif ve doğal renklerde düzenlenmeli.
- **Odanın gerçek özelliklerini ve fiziki koşullarını değiştirme:** pencere, manzara, yatak ölçüsü, balkon, alan büyüklüğü veya mimari öğe uydurma.
- Orijinal master'ları sakla; export sırasında AVIF/WebP + uygun JPEG fallback, responsive `srcset` ve sabit boyutlar kullan.

### Ana sayfa görsel öncelikleri
1. **Küçükçakıl ve Kaş sahilini gösteren drone** görüntüleri.
2. Gerçek **otel dış görünüşü**.
3. **Odaların ve balkonların gerçek manzaraları**.
4. Oda atmosferi ve detayları.
5. Doğrulanmış kahvaltı/deneyim fotoğrafları.

### Fotoğraf performansı
- Hero görseli `loading="eager"` / `fetchpriority="high"`; gerekirse preload.
- Diğer görseller `loading="lazy"`, `decoding="async"`.
- CLS önlemek için `width/height` veya `aspect-ratio`.
- Lazy load sadece aşağıdaki görsellerde; hero'yu geciktirme.
- Görsel açılmazsa kaliteli placeholder/fallback göster; kırık `img` simgesi bırakma.
- Temsili görseller geliştirme ortamında `DEMO_ASSET` olarak işaretlenmeli; canlıya çıkmamalı.

---

## 5. TASARIM SİSTEMİ ve UX REFERANSI

### Tasarım karakteri
**Editorial Mediterranean Boutique Hospitality**: minimalist ama boş değil; güçlü tipografi + gerçek fotoğraf + dengeli whitespace + katmanlı modern bileşenler.

Yap:
- Full-bleed güçlü hero, iyi kompozisyon
- Zarif navigasyon, mobilde hızlı açılan drawer
- Oda kartlarında dengeli yazı-görsel oranı ve kaydırılabilir galeri
- Hafif asimetrik editorial bölümler
- Dokunma hedefleri en az 44 × 44 px
- İnce kenarlıklar, yumuşak gölgeler, tutarlı spacing
- Rezervasyona kolay erişim (desktop sticky bar / mobile compact CTA)
- Kullanılabilir micro-interactions ve skeleton loading

Yapma:
- Devasa kart başlıkları, ağır yuvarlatılmış her şey, rastgele gradient
- Her yere fuşya dökmek
- Aşırı hareketli hero yüzünden okunmayan yazılar
- Çalışmayan butonlar / boş menüler / sahte form bileşenleri
- Tüm sayfaları aynı sabit şablonla doldurmak

### GSAP
- GSAP + ScrollTrigger ile kontrollü stagger / reveal / hafif parallax / gallery transitions.
- İçerikler JavaScript kapalıyken **görünür** kalmalı; animasyon progressive enhancement.
- `prefers-reduced-motion: reduce` desteği zorunlu.
- Mobilde düşük maliyetli transform/opacity animasyonları; layout thrashing yok.
- Animasyonun ticari hedefi desteklemesi önemli: rezervasyon CTA'sı asla gecikmemeli.

---

## 6. SİTE MİMARİSİ / SAYFALAR

Önerilen yeni URL mimarisi:

```text
/tr/
/tr/odalar/
/tr/odalar/deniz-ve-adalar-manzarali/
/tr/odalar/uc-kisilik-sehir-manzarali/
/tr/odalar/cift-kisilik-sehir-manzarali/
/tr/odalar/deniz-manzarali-cati-kati/
/tr/odalar/dag-manzarali-cati-kati/
/tr/hakkimizda/
/tr/galeri/
/tr/kas-rehberi/
/tr/blog/
/tr/blog/[slug]/
/tr/iletisim/
/tr/rezervasyon/
/tr/gizlilik-politikasi/
/tr/cerez-politikasi/
/tr/kvkk/
/tr/iptal-ve-iade-kosullari/

/en/...  [aynı sayfaların İngilizce yerelleştirilmiş slug'ları]
/de/...  [aynı sayfaların Almanca yerelleştirilmiş slug'ları]
```

**Not:** Mevcut sitenin `/`, `/en`, `/de` yollarını ve indekslenen diğer adreslerini önce envantere al. Yeni yolları seçmeden önce 301 ve canonical planını oluştur.

### Ana sayfa önerilen akış
1. İnce, premium header + logo + dil seçimi + rezervasyon CTA
2. Kaş/Küçükçakıl drone hero; açık, net başlık ve CTA
3. Hero üzerinde veya hemen altında **özel tasarım rezervasyon arama paneli**
4. Kısa marka hikâyesi
5. Oda kategorileri + görsel galeriler
6. Neden doğrudan rezervasyon? (yalnızca gerçekten sağlanan avantajlar)
7. Kahvaltı ve otel olanakları
8. Kaş'ı keşfet / yerel rehber
9. Gerçek, izinli misafir değerlendirmeleri
10. Konum + ulaşım + iletişim
11. Footer / yasal / sosyal / dil bağlantıları

### İç sayfalar
- **Odalar listesi:** fotoğraf, doğru kapasite, doğru boyut, doğrulanmış özellikler, detay CTA, arama koşullarını koruyarak oda seçimi.
- **Oda detayı:** yüksek kaliteli galeri/lightbox, oda özellikleri, müsaitlik, fiyat teklifi, rezervasyon CTA, benzer odalar.
- **Hakkımızda:** özgün tarihçe, 2017 yenilenmesi ve aile misafirperverliği.
- **Kaş rehberi:** Küçükçakıl, koylar, tekne turları, dalış, yamaç paraşütü, Likya Yolu; gerçek bilgi ve özgün içerik.
- **Blog:** kategori, liste, detay, arama, çok dilli editör.
- **İletişim:** doğru telefon, e-posta, harita, yön tarifi, güvenli iletişim formu.
- **Rezervasyon:** baştan sona tamamlanabilir akış; demo modunda simüle edilmiş durumlar net etiketlenir.

---

## 7. ODA ENVANTERİ — MEVCUT SİTEDEN

| Kod | Kategori | Mevcut sitedeki bilgi |
|---|---|---|
| `sea-islands` | Deniz ve Adalar Manzaralı | 6 oda, balkon, 24–28 m², en fazla 3 kişi |
| `triple-city` | Standart Üç Kişilik Şehir Manzaralı | 6 oda, balkon, 28–30 m² |
| `double-city` | Standart Şehir Manzaralı Çift Kişilik | Balkon, şehir/dağ görünümü, ilave yatakla en fazla 3 kişi, 20–27 m² |
| `sea-attic` | Deniz Manzaralı Çatı Kat | 1 oda, en fazla 3 kişi, 30 m² |
| `mountain-attic` | Dağ Manzaralı Çatı Kat | 2 oda, 15 ve 20 m², 2 veya 3 kişilik |

**Önemli veri tutarsızlığı:** Mevcut sitenin kategori metinlerindeki sayılar toplam 18 odayla doğrudan uzlaştırılamıyor (`double-city` oda adedi belirtilmemiş). HMS oda tipi / fiziksel oda sayımı kaynak kabul edilerek operasyonel envanter netleştirilecek. **Sakın eksik adedi kendin uydurma.**

Mevcut sitede görülen genel olanaklar: ücretsiz Wi-Fi, klima, TV, saç kurutucu, kasa, kettle, banyo/WC, bazı odalarda balkon. Her olanağın her odada bulunduğunu otomatik varsayma; **oda-bazlı doğrula**.

---

## 8. REZERVASYON — UÇTAN UCA UX

### Gereken akış
`Tarih + Kişi Seçimi → HMS Müsaitlik → Oda / Fiyat Seçimi → Misafir Bilgileri → İptal ve Ödeme Şartları → Ödeme / Kapora → HMS Rezervasyon Kaydı → Onay ve E-posta`

- Tarih ve misafir bilgileri ekranlar arasında **kaybolmadan** taşınmalı.
- Giriş/çıkış tarihleri, misafirler, seçilen oda ve fiyat her adımda özetlenmeli.
- Üç dilde aynı akış ve tutarlı event isimleri.
- Konaklama için giriş / çıkış **saati seçimi** gerçekten operasyonel olarak desteklenmiyorsa zorunlu adım yapma. Demo için ayrı UI bileşeni olabilir; gerçek rezervasyonda otelin saat politikası kullanılmalı.

### Özel CSS/JS kontrol gereksinimleri
1. **Date-range picker**
   - Tek popover içinde giriş + çıkış, iki ay görünümü (desktop), bir ay (mobil).
   - Aralık boyama, gecelik hesap, klavye/ekran okuyucu desteği.
   - Geçmiş tarih yasak, minimum/max gece konfigürasyonu, blackout destek altyapısı.
   - Müsaitlik API'si ile uygun tarih göstergeleri; API yokken sahte doluluk yok.
2. **Guest selector**
   - Yetişkin `+ / −`; çocuk `+ / −`; gerektiğinde yaş girişleri.
   - Konfigüre edilebilir kapasite limitleri.
   - Mobil touch-friendly; tıklayınca popover; uygun dış-tıklama ve Esc davranışı.
3. **Custom dropdown / select**
   - Dil ve oda gibi alanlarda CSS özelleştirilmiş arayüz; semantik ve erişilebilir.
   - Native `select` altyapısı sadece erişilebilirlik/geri dönüş seçeneği olarak kabul edilebilir.
4. **Rezervasyon özeti**
   - Mobilde compact sticky summary / desktop sticky sidebar.
5. **Form validation**
   - Alan bazlı hata, loading, retry ve başarı durumları.
   - Disabled CTA nedenini açıklayabilen mesaj.

### Demo/live sınırı
- HMS olmadan “gerçek zamanlı müsaitlik” yazma.
- API doğrulanmadan gerçek fiyat / indirim / “son oda” yazma.
- Ödeme bağlantısı olmadan gerçek ödeme alındığı mesajı gösterme.
- `BookingProvider` arayüzü + `MockBookingProvider` ve gelecekte `HmsBookingProvider` olarak tasarla.

---

## 9. HMS REST API ENTEGRASYONU

**Hedef:** HMS ile senkron çalışan doğrudan rezervasyon.

Yapılacaklar:
- HMS sağlayıcısından REST API dokümantasyonu, test erişimi ve yazma izinleri.
- Oda tipleri / rate plan / müsaitlik / toplam fiyat / rezervasyon oluşturma / iptal / değişiklik endpoint değerlendirmesi.
- Webhook desteği, polling stratejisi ve retry kuralları.
- Oda ID eşleme, stok doğrulama, concurrency / idempotency kontrolü.
- Çifte rezervasyon riskine karşı son adımda tekrar doğrulama.
- Erişim anahtarlarını sadece sunucuda tut; loglarda maskele.
- Zaman dilimi `Europe/Istanbul`; para birimi ve vergileri HMS ile tutarlı hesapla.
- Başarısız ödeme vs başarısız HMS rezervasyon yazımı için telafi / uzlaştırma akışı.

**API kapsamı henüz doğrulanmadı; endpoint veya yetenek uydurulmayacak.**

---

## 10. ÖDEME ALTYAPISI

Adaylar: **Banka sanal POS / iyzico / uygun diğer PSP**.

- 3D Secure; sağlayıcının hosted checkout/tokenizasyon modelini tercih et.
- Kart verisi kendi sunucumuzda saklanmayacak.
- Kapora veya tam ödeme; konfigüre edilebilir.
- Taksit ancak konaklama sektöründeki geçerli kural ve sağlayıcı yetenekleri izin veriyorsa.
- Sağlayıcı webhook doğrulaması, idempotency, double-charge koruması.
- İptal, iade, kısmi iade ve mutabakat.
- Ödeme tutarı backend'de yeniden hesaplanıp doğrulanmalı.
- Rezervasyon kesinleşme anı açıkça tanımlanmalı.

---

## 11. SEO / LOCAL SEO / GEO / AEO

### Teknik SEO
- SSR/SSG veya arama motoruna sunulabilen indekslenebilir HTML.
- Tekil `title`, `meta description`, H1, canonical.
- `hreflang` `tr-TR`, `en`, `de` + ihtiyaç uygunsa `x-default`.
- `robots.txt`, `sitemap.xml`, sayfa/oda/blog/image sitemap bölünmesi.
- Eski URL → yeni URL **301 mapping**, 404 denetimi, iç linkler.
- Doğru `og:title`, `og:description`, `og:image`, Twitter Card meta.
- Ana görsellerde anlamsal alt metin; doğal, keyword stuffing olmadan.
- FAQ ve oda sayfalarında kullanıcı sorularını yanıtlayan gerçek metin.
- Blog iç linkleme, breadcrumbs, sayfalama / filtreleme indeks stratejisi.
- GSC, GA4, GTM, Bing Webmaster Tools; consent-aware analitik.
- Core Web Vitals: LCP, INP, CLS.
- Çok dilli gerçek içerik; kopya otomatik sayfa çoğaltma yapılmamalı.

### Structured data (JSON-LD)
- `Hotel` / uygun `LodgingBusiness`
- `HotelRoom` ve doğrulanmış özellikler
- `Offer` yalnızca güncel doğru fiyat/stok varsa
- `PostalAddress`, `GeoCoordinates` (koordinatı doğrula)
- `BreadcrumbList`, `WebSite`, `WebPage`
- `BlogPosting`, `ImageObject`
- `FAQPage` içerikle uyumlu ise; Google rich result garanti değil
- `AggregateRating` yalnızca uygun, doğrulanabilir kaynak/kurallarda

### GEO / AEO
- Kaş, Küçükçakıl, merkezden ulaşım, oda özellikleri, manzara ve aktiviteler hakkında açık ve doğru açıklamalar.
- SSS, yerel rehberler, açık kaynak/işletme bilgileri, tutarlı isim-adres-telefon.
- Yapay zekâ sistemlerinin okuyabileceği HTML, yapılandırılmış veri ve iç linkler.
- `llms.txt` isteğe bağlı deneysel dosyadır; sıralama / görünürlük garantisi değildir.
- “ChatGPT'de kesin önerilme” gibi vaat yok.

### Local SEO
- Google Business Profile tutarlılığı.
- Doğru konum, telefon ve resmî rezervasyon bağlantısı.
- Kaş ve Küçükçakıl odaklı, kullanıcıya faydalı içerik.
- Gerçek misafir yorumları ve platforma uygun yanıt süreçleri.
- Sahte yorum, satın alınmış puan, yanıltıcı değerlendirme yapılmayacak.

---

## 12. İÇERİK / BLOG OTOMASYONU

- Yönetilebilir içerik türleri: `Page`, `Room`, `Media`, `Post`, `Category`, `FAQ`, `Promotion`, `Translation`.
- TR/EN/DE editoryal workflow; çeviri taslakları ve onay akışı.
- Haftalık/günlük planlama destekli blog editörü; **otomatik yayın şart değil, yönetici onayı varsayılan olsun**.
- YZ destekli fikir / taslak / meta önerisi; doğruluk ve dil kontrolü sonrasında yayın.
- Otomatik sitemap ve RSS opsiyonel.
- Oda içeriklerini HMS'den gelen fiyat/stokla karıştırma; CMS pazarlama içeriği, HMS operasyonel fiyat/müsaitlik kaynağıdır.

---

## 13. İTİBAR ve YORUM OPERASYONU

- Google / Booking / Tripadvisor vb. gerçek değerlendirmelerin incelenmesi.
- Kötü yorumlara profesyonel, savunmacı olmayan yanıt süreci.
- İç operasyonel şikâyet takibi (temizlik, kahvaltı, iletişim vb.).
- Gönüllü değerlendirme toplama; olumlu/olumsuz misafir ayrımıyla manipüle etmeme.
- Platform kurallarına uygun yanıt / itiraz.
- Web sitesinde yalnızca gerçek, doğrulanmış ve gösterim izni uygun yorumlar.

---

## 14. ANALİTİK & DÖNÜŞÜM TAKİBİ

Önerilen GA4 event şeması:
- `view_item_list` — oda listesi
- `view_item` — oda detayı
- `search` — tarih/misafir arama
- `select_item` — oda seçimi
- `begin_checkout` — rezervasyon kişisel bilgi aşaması
- `add_payment_info` — ödeme yöntemi aşaması
- `purchase` — yalnızca gerçek rezervasyon/ödeme doğrulandığında
- `generate_lead` — iletişim formu (ayrı lead niteliği)

- GA4 e-commerce `items`, `value`, `currency`, `transaction_id` şemaları tutarlı olmalı.
- Tek rezervasyon için tek `purchase` event, double-count engeli.
- Consent Mode / çerez izinleri yerel hukuka uygun biçimde yapılandırılmalı.
- Sayfa ve dönüşüm funnel raporu: arama → oda → checkout → ödeme → onay.

---

## 15. TEKNİK MİMARİ / ÖNERİ

**Framework seçimi ekip tarafından yapılabilir.** SEO ve performans için öneri:
- Next.js (App Router) + TypeScript
- Tailwind veya token tabanlı CSS / CSS Modules
- GSAP + ScrollTrigger
- Headless CMS ya da güvenli yönetim paneli
- Zod / React Hook Form veya eşdeğer validasyon
- İleride HMS REST API için server-side adapter katmanı
- Fotoğraflar yerel public/assets veya CDN üzerinden, otomatik optimize
- Otel verileri tek kaynaktan; `hotel.ts`, `rooms.ts`, `i18n` sözlükleri
- `api/booking/*` endpoint'lerinde rate limit, log, idempotency

Teknoloji kesin şart değil; ekip Laravel/Inertia/React gibi eşdeğer ve güvenilir mimari kullanabilir. **Önemli olan kullanıcı deneyimi, bakım kolaylığı ve entegrasyona hazırlıktır.**

### Önerilen klasörler
```text
src/
  app/[locale]/
    page.tsx
    rooms/
    booking/
    about/
    guide/
    blog/
    contact/
  components/
    layout/
    booking/
    rooms/
    motion/
    ui/
  lib/
    api/
    booking/
    seo/
    i18n/
  styles/
    tokens.css
  data/
    hotel.ts
    rooms.ts
public/
  assets/
    brand/
    hotel/
    rooms/
    guide/
```

---

## 16. TEST / KABUL KRİTERLERİ

Tasarımın tamamlandı sayılması için:

- [ ] Ana sayfa ve bütün iç sayfalar gerçek gezinmeyle çalışıyor.
- [ ] Logo doğru ve net görünüyor; `#EE177E` uygun vurguda kullanılıyor.
- [ ] Mobil / tablet / desktop kırılma noktaları test edildi.
- [ ] Hiçbir sayfada kırık görsel veya CSS/JS kaynak hatası yok.
- [ ] Hero yüklemesi hızlı; alt görseller lazy-load.
- [ ] Özel tarih aralığı takvimi açılıyor, tarih aralığı seçiliyor, özet güncelleniyor.
- [ ] Misafir +/− seçimi ve limit validasyonu çalışıyor.
- [ ] Rezervasyon verisi adımlar arasında kaybolmuyor.
- [ ] Demo ve canlı PMS/POS durumları kullanıcı için açıkça ayrılıyor.
- [ ] Klavye ile gezinme, Esc, focus, ekran okuyucu etiketleri mevcut.
- [ ] Reduced-motion kullanıcıları gereksiz animasyon görmüyor.
- [ ] TR/EN/DE menü, formlar, meta etiketler ve yönlendirmeler tutarlı.
- [ ] URL/301 listesi ve canonical/hreflang kontrol edildi.
- [ ] Structured data gerçeği yansıtıyor; schema validation yapıldı.
- [ ] Search Console, Analytics ve conversion tracking kurulumu doğrulandı.
- [ ] Ödeme işlemleri güvenli sunucu tarafında; kart bilgisi tutulmuyor.
- [ ] Rezervasyon arama ve bitirme akışı E2E test edildi (mock veya sandbox).
- [ ] Erişilebilirlik, hız, SEO ve güvenlik test raporları üretildi.

---

## 17. YAPILMAYACAKLAR / DİKKAT

- Önceki demoda görsellerin dış servisten yüklenmemesi ve CSS dosyasının tek HTML önizlemesinde eksik kalması sorun olmuştu. **Tekrarlama.**
- “Çok sayfalı” deyip boş/dummy sayfa bırakma.
- Browser-native kaba seçicilerle tasarımı geçiştirme.
- Kart görsellerini gereksiz büyütüp başlıkları taşırma.
- Tanıtım sitesi ile rezervasyon motorunun görsel dilini ayırma; bütün adımlarda **aynı tutarlı tasarım sistemi** olmalı.
- Sahte fiyat, sahte yorum, sahte müsaitlik, hayalî oda olanağı veya uydurma tur/aktivite hizmeti ekleme.
- Var olmayan entegrasyonu “bağlı” diye gösterme.
- Eski sitenin URL'lerini analiz etmeden silme.
- Otelin onayı olmadan gerçek sitede değişiklik yapma.

---

## 18. ÖNCELİKLİ GELİŞTİRME AŞAMALARI

**Faz 1 — Tasarım, marka ve prototip**
Logo / palet / tipografi, ana sayfa, oda kartları, iç sayfalar, GSAP, yerel görseller, tam responsive.

**Faz 2 — Rezervasyon UX**
Özel date-range picker, misafir seçici, oda seçimi, misafir bilgileri, ödeme özeti, demo provider, funnel tracking.

**Faz 3 — Entegrasyon**
HMS API dokümantasyonu ve sandbox, room/rate mapping, ödeme sağlayıcısı, rezervasyon onay/iptal süreçleri.

**Faz 4 — SEO, GEO, CMS**
İndeks migrasyonu, schema, sitemap, 3 dil, blog editörü, içerik otomasyonu, analitik.

**Faz 5 — QA & yayın**
E2E, mobil / cross-browser testleri, SEO/canonical, güvenlik, hız, domain DNS ve yayın kontrolleri.

---

## 19. GÜNCELLEME / DOĞRULAMA LİSTESİ

Aşağıdaki konular otel yönetimi veya HMS belgeleriyle doğrulanacak:
1. Kesin oda tipi, toplam oda ve kişi kapasitesi eşleşmesi.
2. Güncel oda görselleri / görsel kullanım hakları / logo vektörel sürümü.
3. Check-in/check-out saatleri, minimum gece, çocuk politikası.
4. Kahvaltının hangi oda/fiyat planına dahil olduğu.
5. İptal / ön ödeme / kapora / iade şartları.
6. HMS API kapsamı, credential, webhook ve sandbox.
7. Seçilecek PSP, taksit/kurallar/komisyonlar.
8. Mevcut resmî Instagram hesabı ve güvenlik uyarısının güncelliği.
9. Doğru adres, harita konumu, telefon, WhatsApp, e-posta.
10. Eski sitede indekslenen URL'ler ve var olan SEO performansı.

---

## 20. KAYNAKLAR / DOSYALAR

- Canlı Türkçe site: https://lalehotelkas.com/
- Mevcut İngilizce sürüm: https://lalehotelkas.com/en
- Mevcut Almanca sürüm: https://lalehotelkas.com/de
- Önceki demo: `lale-hotel-kas-demo-v3.zip` (yalnızca konsept; referans tasarım olmak zorunda değil)
- Orijinal logo: `IMG_1726.png`
- Asıl otel fotoğrafları: kullanıcıdaki flash bellek, daha sonra projeye eklenecek.

**Codex için son talimat:** Bu belgeyi proje bağlamı kabul et. Önce tasarım sistemini ve sayfa mimarisini kur; çalışır, görsel olarak güçlü ve mobil uyumlu demo üret; her adımda kırık görselleri, CSS yüklenmesini, gerçek navigation'ı ve rezervasyon formu etkileşimlerini kontrol et. Doğrulanmamış ticari/veri/entegrasyon iddialarını canlı gerçek gibi gösterme.
