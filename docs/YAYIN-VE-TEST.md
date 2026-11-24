# Lale Hotel Kaş · test ve yayın kaydı

## Yerel çalışma

```sh
npm ci
npm run dev
```

Üretim çıktısı ve tarayıcı testi için iki terminal kullanın.

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4175
```

```sh
npm run test:site
```

Test Chrome’u macOS’ta standart konumdan kullanır. Farklı bir konum için `CHROME_BIN` verilebilir. Playwright tarayıcısı kullanan ortamlarda `npx playwright-core install chromium` çalıştırılabilir. WebKit için tarayıcıyı `npx playwright-core install webkit` ile kurup `QA_BROWSER=webkit npm run test:site` çalıştırın. Varsayılan önizleme adresini `PREVIEW_URL`, ekran görüntüsü konumunu `QA_ARTIFACTS` ile değiştirebilirsiniz.

Geliştirme sunucusunda `/__editor` yolu üç dilli günlük taslağı, inceleme tarihi, tarayıcıda kayıt ve JSON dışa aktarımı sağlar. Editör derlenmiş siteye girmez. Yayınlanmış günlük metinleri `src/data/hotel.js` içinde editoryal incelemeden sonra güncellenir.

## Doğrulama

| Kontrol | Sonuç |
|---|---|
| Üretim derlemesi | Vite derlemesi ve 57 statik HTML sayfası başarılı |
| Rotalar ve görseller | 57 rota × 4 genişlik × 2 tarayıcı motoru, 456 sayfa açılışı. 320, 390, 900 ve 1440 px. Yatay taşma, kırık görsel ve kaynak hatası yok. WebP → JPEG → erişilebilir açıklama zinciri istekler engellenerek doğrulandı |
| Rezervasyon | TR 1440 px, EN 390 px, DE 320 px. Tarihten misafir paneline geçiş, kapasite sınırı, tek veya iki oda seçimi ve resmî HMS bağlantısına tarih ve kişi bilgilerinin aktarımı |
| Klavye | Takvim odağı ve ok tuşları, Escape ile takvim/misafir paneli, menü ve galeri; galeride sağ/sol gezinme |
| Erişilebilirlik | Ana sayfa, oda listesi, oda detayı, galeri, iletişim ve takvim açık rezervasyon ekranında masaüstü ve mobil axe-core WCAG A/AA taramalarında ihlal yok |
| SEO | Her rotada bir H1, canonical, dört hreflang ve geçerli JSON-LD ayrıştırması. Dahili bağlantılar kayıtlı rotalarla eşleşiyor. Sitemap XML dosyaları `xmllint` ile ayrıştırıldı |
| 301 ve 404 | Yerel üretim önizlemesinde eski oda listesi 301, bilinmeyen İngilizce URL yerelleştirilmiş 404 |
| JavaScript kapalı | Almanca oda sayfasının ana içeriği statik HTML’den okunuyor |
| Yerel performans | 390 px, DPR 2 ve azaltılmış hareket ayarında örnek yerel yükleme. LCP 68 ms, CLS 0,028, kaynak aktarımı yaklaşık 485 KB. Ağ kısıtlaması ve gerçek kullanıcı verisi kullanılmadı |
| Yerel kaynaklar | Varsayılan yapılandırmada ilk açılış istekleri yerel. Azaltılmış hareket modunda GSAP paketi indirilmedi |
| Güvenlik | `npm audit --omit=dev` sıfır bilinen açık. Ödeme verileri otelin rezervasyon ekranında işlenir. Bu site tarih, kişi sayısı, oda tercihleri ve girilen çocuk yaşını sekme oturumunda tutar |
| Analitik | Sahte test kimliği ve ağ isteği engelleme ile ret, izin, sayfa olayı ve izin geri çekme doğrulandı. Üretim paketinde kimlik yok |
| Günlük ve iletişim | Kategori/arama, yazı detayı, yerel TR/EN/DE taslak kaydetme ve JSON indirme, e-posta taslağı |

Bu kayıt Chromium ve WebKit laboratuvar testlerini kapsar. Saha Core Web Vitals, gerçek Search Console verileri, harici schema doğrulaması ve HMS/POS üzerinden ödeme veya rezervasyon yazma testi yapılmadı.

## Eski URL envanteri ve geçiş

Resmî TR, EN ve DE giriş sayfaları, ana menü fragment’ları ve canlı sitemap incelendi. Mevcut sitemap’te ana sayfa ve üç çerez politikası URL’si var. Yerel eski React ve HTML prototip rotaları da eşleştirildi. Search Console’dan indeks ve en çok bağlantı alan URL dışa aktarımı erişim sağlandığında bu envanterle birleştirilmeli.

| Önceki yol | Hedef |
|---|---|
| `/`, `/index.html` | `/tr/` |
| `/en`, `/de` | `/en/`, `/de/` |
| `/cerez-politikasi`, `/en/cookie-policy`, `/de/cookie-richtlinie` | İlgili dilde sonu eğik çizgili politika rotası |
| `/odalar`, `/hakkimizda`, `/kas-rehberi`, `/blog`, `/iletisim`, `/rezervasyon` ve `.html` karşılıkları | İlgili `/tr/…/` rotaları |
| `/oda-*.html` ve uzantısız oda adresleri | İlgili `/tr/odalar/…/` oda detayları |

Tam tablo derlemede `dist/_redirects` dosyasına yazılır. Yayın altyapısında 301 ve 404 işlemlerinin HTTPS, parametre ve fragment senaryolarıyla tekrar kontrol edilmesi gerekir. Önemli eski bölüm fragment’ları üç dilde korundu. Eski yorum fragment’ları, doğrulanmış ve gösterim izinli yorum kaynağı gelene kadar bekliyor.

## Canlıya geçmeden önce

- Ana rehberdeki adres ve telefonun işletme teyidini, fotoğraf kullanım iznini, güncel drone ve dış cephe dosyalarını, WhatsApp ve sosyal hesap doğrulamasını tamamlayın. Şu an açılışta resmî galerideki balkon fotoğrafı var. 200 × 45 PNG, resmî sitedeki dosyayla aynı SHA-1 değerine sahip.
- İptal, iade, kişisel veri ve çerez açıklamalarını işletmenin onaylı politika metinleriyle güncelleyin. Mevcut açıklamalar `noindex`.
- Resmî HMS sayfasına check-in, check-out ve kişi sayısı taşınır. Oda türleri HMS ekranında yeniden seçilir. Yerel sitede canlı stok göstermek veya oda seçimlerini de taşımak için yetkili HMS erişimi ve oda kimliği eşlemesi gerekir.
- İletişim formu yerel e-posta uygulamasına bir taslak açar. Tarayıcı üzerinden teslimat istenirse onaylı sunucu ve e-posta sağlayıcısı gerekir.
- Analitik tercihi onaylandığında `VITE_GA4_ID` ile GA4’ü etkinleştirin. İzin verilince Google etiketi yüklenir, reklam sinyalleri varsayılan olarak kapalıdır ve HMS’ye geçiş ayrı olay olarak ölçülür. Canlı satın alma olayı, HMS/POS doğrulaması sonrasına aittir. Search Console, GTM ve Bing doğrulaması için işletme erişimi gerekir.
- Yayın ve domain geçişi işletme onayına bağlıdır.

Kaynaklar: [Resmî site](https://lalehotelkas.com/), [mevcut sitemap](https://lalehotelkas.com/sitemap.xml), [Google Consent Mode](https://developers.google.com/tag-platform/security/guides/consent)
