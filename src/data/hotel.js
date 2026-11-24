export const locales = ['tr', 'en', 'de'];
export const languageTags = { tr: 'tr-TR', en: 'en', de: 'de' };
export const local = (values, locale) => values[locales.indexOf(locale)] ?? values[0];

export const hotel = {
  name: 'Lale Hotel Kaş',
  url: 'https://lalehotelkas.com',
  logo: '/assets/brand/lale-hotel-kas.png',
  address: 'Andifli Mahallesi, Hükümet Caddesi No: 19, Kaş / Antalya',
  phone: '+90 242 836 10 74',
  tel: '+902428361074',
  email: 'info@lalehotelkas.com',
  googleProfile: 'https://www.google.com/maps?cid=17649994864911914682',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=Lale+Hotel+Ka%C5%9F%2C+H%C3%BCk%C3%BCmet+Caddesi+19%2C+Ka%C5%9F',
  googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d478.6109420764867!2d29.64385648282516!3d36.19823064843468!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf4f160d0e28b16ba!2sLale%20Hotel%20Ka%C5%9F!5e0!3m2!1sen!2str!4v1649762019800!5m2!1sen!2str',
  instagram: 'https://www.instagram.com/lalebutikhotel/',
  tripadvisor: 'https://www.tripadvisor.com.tr/Hotel_Review-g297965-d12502186-Reviews-Lale_Hotel-Kas_Turkish_Mediterranean_Coast.html',
  whatsapp: 'https://wa.me/905332153595',
  hero: 'kas-kiyi-drone',
  exterior: 'otel-dis-cephe',
  breakfast: 'kahvalti-bufe-yeni',
  boat: 'kas-tekne-turu-1350x625',
};

export const breakfastShowcase = [hotel.breakfast, 'kahvalti-teras-masasi', 'kahvalti-sofra'];

export const hotelPhotography = [
  { group: 'view', name: hotel.hero, label: ['Kaş kıyısının havadan görünümü', 'Aerial view of the Kaş coast', 'Luftaufnahme der Küste von Kaş'] },
  { group: 'view', name: 'meis-balkon-yeni', label: ['Balkondan Meis manzarası', 'Meis seen from the balcony', 'Blick vom Balkon auf Meis'] },
  { group: 'hotel', name: 'otel-bahce-terrasi', label: ['Otelin bahçe terası', 'The hotel’s garden terrace', 'Die Gartenterrasse des Hotels'] },
  { group: 'hotel', name: hotel.exterior, label: ['Bahçeden Lale Hotel Kaş’ın dış cephesi', 'The hotel exterior seen from the garden', 'Die Hotelfassade vom Garten aus'] },
  { group: 'hotel', name: 'otel-bahce-oturma', label: ['Bahçedeki oturma alanı', 'Seating in the garden', 'Sitzbereich im Garten'] },
  { group: 'breakfast', name: hotel.breakfast, label: ['Açık büfe kahvaltı', 'Breakfast buffet', 'Frühstücksbuffet'] },
  { group: 'breakfast', name: 'kahvalti-salonu', label: ['Kahvaltı salonu', 'Breakfast room', 'Frühstücksraum'] },
  { group: 'breakfast', name: 'kahvalti-teras-masasi', label: ['Terasta kahvaltı masası', 'Breakfast table on the terrace', 'Frühstückstisch auf der Terrasse'] },
  { group: 'breakfast', name: 'kahvalti-sofra', label: ['Kahvaltı sofrası', 'Breakfast spread', 'Gedeckter Frühstückstisch'] },
  { group: 'breakfast', name: 'kahvalti-hamur-isleri', label: ['Büfedeki hamur işleri', 'Pastries at the buffet', 'Gebäck am Buffet'] },
  { group: 'breakfast', name: 'kahvalti-bahce-servisi', label: ["Bahçede kahvaltı servisi", "Breakfast service in the garden", "Frühstück im Garten"] },
  { group: 'breakfast', name: 'kahvalti-taze-sebzeler', label: ["Büfede taze sebzeler ve peynir", "Fresh vegetables and cheese at the buffet", "Frisches Gemüse und Käse am Buffet"] },
  { group: 'breakfast', name: 'kahvalti-receller', label: ["Büfedeki reçel ve zeytin kaseleri", "Bowls of preserves and olives at the buffet", "Konfitüren und Oliven am Buffet"] },
  { group: 'breakfast', name: 'kahvalti-pankek', label: ["Kahvaltı sofrasında pankek", "Pancakes at the breakfast table", "Pfannkuchen auf dem Frühstückstisch"] },
  { group: 'breakfast', name: 'kahvalti-teras-detay', label: ["Begonvillerin yanında kurulan kahvaltı sofrası", "Breakfast table beside bougainvillea", "Frühstückstisch neben den Bougainvilleen"] },
  { group: 'hotel', name: 'otel-bahce-masalari', label: ["Otel bahçesindeki açık hava masaları", "Outdoor tables in the hotel garden", "Tische im Freien im Hotelgarten"] },
  { group: 'hotel', name: 'otel-teras-gecisi', label: ["Otelin terasına açılan bahçe yolu", "Garden path leading to the hotel terrace", "Gartenweg zur Hotelterrasse"] },
  { group: 'view', name: 'kas-balkon-kiyi', label: ["Kaş kıyısına bakan balkon", "Balcony looking out over the Kaş coast", "Balkon mit Blick auf die Küste von Kaş"] },
  { group: 'hotel', name: 'otel-dis-cephe-aksam', label: ["Lale Hotel Kaş’ın aydınlatılmış dış cephesi", "Lale Hotel Kaş lit up in the evening", "Beleuchtete Fassade des Lale Hotels Kaş"] },
  { group: 'hotel', name: 'otel-bahceden-aksam', label: ["Akşam bahçeden görünen otel binası", "The hotel building seen from the garden in the evening", "Blick vom Garten auf das Hotel am Abend"] },
  { group: 'hotel', name: 'otel-begonvilli-giris', label: ["Begonvillerle çevrili otel girişi", "Hotel entrance framed by bougainvillea", "Hoteleingang zwischen Bougainvilleen"] },
  { group: 'hotel', name: 'otel-bahce-yolu-aksam', label: ["Akşam aydınlatılan bahçe yolu", "The garden path lit up in the evening", "Beleuchteter Gartenweg am Abend"] },
  { group: 'hotel', name: 'otel-giris-kapisi', label: ["Bahçeye açılan otel giriş kapısı", "Hotel entrance opening onto the garden", "Hoteleingang zum Garten"] },
  { group: 'hotel', name: 'otel-lobi-genis', label: ["Lale Hotel lobisinin genel görünümü", "Wide view of the Lale Hotel lobby", "Gesamtansicht der Lobby des Lale Hotels"] },
  { group: 'hotel', name: 'otel-lobi-gecisi', label: ["Lobideki taş döşeli geçiş", "Tiled passage through the lobby", "Gepflasterter Durchgang in der Lobby"] },
  { group: 'hotel', name: 'otel-ic-oturma-alani', label: ["Cam kenarındaki kapalı oturma alanı", "Indoor seating area by the windows", "Sitzbereich am Fenster"] },
  { group: 'hotel', name: 'otel-ic-mekan', label: ["Otelin iç mekânından bir görünüm", "A view inside the hotel", "Blick in das Hotelinnere"] },
];

// Approximate distances from the property's Booking.com, Setur and Bookeder listings.
export const hotelNearby = [
  { label: ['Küçük Çakıl Plajı', 'Küçük Çakıl Beach', 'Küçük-Çakıl-Strand'], distance: ['100 m', '100 m', '100 m'], destination: 'Küçük Çakıl Plajı, Kaş' },
  { label: ['Kaş Limanı', 'Kaş harbour', 'Hafen von Kaş'], distance: ['400 m', '400 m', '400 m'], destination: 'Kaş Limanı, Kaş' },
  { label: ['Kaş merkez', 'Kaş town centre', 'Ortszentrum von Kaş'], distance: ['500 m', '500 m', '500 m'], destination: 'Kaş Merkez, Kaş' },
  { label: ['Büyük Çakıl Plajı', 'Büyük Çakıl Beach', 'Büyük-Çakıl-Strand'], distance: ['1,3 km', '1.3 km', '1,3 km'], destination: 'Büyük Çakıl Plajı, Kaş' },
];

export const hotelHighlights = [
  {
    photo: 'otel-bahce-terrasi',
    title: ['Bahçe terası', 'Garden terrace', 'Gartenterrasse'],
    text: ['Otelin giriş katındaki taş döşeli terasta açık hava masaları var.', 'The tiled terrace at the hotel entrance has outdoor tables.', 'Auf der gepflasterten Terrasse am Hoteleingang stehen Tische im Freien.'],
  },
  {
    photo: 'otel-bahce-oturma',
    title: ['Begonvillerin altında', 'Under the bougainvillea', 'Unter den Bougainvilleen'],
    text: ['Bahçede, masalardan ayrı bir oturma köşesi bulunuyor.', 'The garden has a seating area separate from the tables.', 'Im Garten gibt es neben den Tischen eine eigene Sitzecke.'],
  },
  {
    photo: 'meis-balkon-yeni',
    title: ['Meis’e bakan balkonlar', 'Balconies overlooking Meis', 'Balkone mit Blick auf Meis'],
    text: ['Deniz ve Adalar Manzaralı oda kategorisinin balkonları Akdeniz’e açılıyor.', 'The balconies in the Sea and Islands View category look out over the Mediterranean.', 'Die Balkone der Zimmer mit Meer- und Inselblick liegen zum Mittelmeer.'],
  },

];

export const hotelSpaces = {
  entrance: ['otel-dis-cephe-aksam', 'otel-bahceden-aksam', 'otel-begonvilli-giris', 'otel-bahce-yolu-aksam', 'otel-giris-kapisi'],
  lobby: ['otel-lobi-genis', 'otel-lobi-gecisi', 'otel-ic-oturma-alani', 'otel-ic-mekan'],
  garden: ['otel-bahce-terrasi', 'otel-bahce-oturma', 'otel-bahce-masalari', 'otel-teras-gecisi'],
};

export const rooms = [
  {
    id: 'sea-islands',
    slug: ['deniz-ve-adalar-manzarali', 'sea-and-islands-view', 'meer-und-inselblick'],
    title: ['Deniz ve Adalar Manzaralı', 'Sea and Islands View', 'Zimmer mit Meer- und Inselblick'],
    description: ['Balkonunuzdan Akdeniz’e ve Meis Adası’na bakabilirsiniz.', 'The balcony looks out over the Mediterranean towards Meis.', 'Vom Balkon aus blicken Sie auf das Mittelmeer und die Insel Meis.'],
    size: '24–28', maxGuests: 3, basePrice: 4800,
    feature: ['Deniz manzaralı balkon', 'Sea-view balcony', 'Balkon mit Meerblick'],
    photos: ['1_1', 2, 4, 5].map(number => 'balkon-deniz-ve-adalar-manzarali-' + number),
  },
  {
    id: 'triple-city',
    slug: ['uc-kisilik-sehir-manzarali', 'triple-city-view', 'dreibettzimmer-stadtblick'],
    title: ['Üç Kişilik Şehir Manzaralı', 'Triple Room with City View', 'Dreibettzimmer mit Stadtblick'],
    description: ['Kaş’a bakan balkonlu, üç kişilik oda.', 'A room for three with a balcony overlooking Kaş.', 'Zimmer für drei Personen mit Balkon und Blick auf Kaş.'],
    size: '28–30', maxGuests: 3, basePrice: 4200,
    feature: ['Şehir manzaralı balkon', 'City-view balcony', 'Balkon mit Stadtblick'],
    photos: ['3-kisilik-oda'],
  },
  {
    id: 'double-city',
    slug: ['cift-kisilik-sehir-manzarali', 'double-city-view', 'doppelzimmer-stadtblick'],
    title: ['Çift Kişilik Şehir Manzaralı', 'Double Room with City View', 'Doppelzimmer mit Stadtblick'],
    description: ['Şehir ve dağ manzaralı balkon. İlave yatakla üç kişiye kadar konaklama mümkün.', 'A balcony with town and mountain views. An extra bed can accommodate a third guest.', 'Balkon mit Blick auf den Ort und die Berge. Mit Zustellbett für bis zu drei Personen.'],
    size: '20–27', maxGuests: 3, basePrice: 3600,
    feature: ['İlave yatakla en fazla 3 kişi', 'Up to 3 guests with an extra bed', 'Mit Zustellbett bis zu 3 Personen'],
    photos: [1, 2, 3, 4].map(number => 'kismi-deniz-manzarali-ve-balkonlu-' + number),
  },
  {
    id: 'sea-attic',
    slug: ['deniz-manzarali-cati-kati', 'sea-view-attic', 'dachzimmer-meerblick'],
    title: ['Deniz Manzaralı Çatı Katı', 'Sea View Attic Room', 'Dachzimmer mit Meerblick'],
    description: ['Otelin çatı katında denize bakan 30 m² oda.', 'A 30 m² top-floor room overlooking the sea.', '30 m² großes Zimmer im Dachgeschoss mit Meerblick.'],
    size: '30', maxGuests: 3, basePrice: 5200,
    feature: ['Çatı katı · deniz manzarası', 'Top floor · sea view', 'Dachgeschoss · Meerblick'],
    photos: [1, 3, 5].map(number => 'deniz-manzarali-cati-kat-' + number),
  },
  {
    id: 'mountain-attic',
    slug: ['dag-manzarali-cati-kati', 'mountain-view-attic', 'dachzimmer-bergblick'],
    title: ['Dağ Manzaralı Çatı Katı', 'Mountain View Attic Room', 'Dachzimmer mit Bergblick'],
    description: ['Dağa bakan 15 ve 20 m² oda seçenekleri iki veya üç kişiliktir.', 'The 15 and 20 m² mountain-view rooms sleep two or three guests.', 'Die 15 und 20 m² großen Zimmer mit Bergblick bieten Platz für zwei oder drei Personen.'],
    size: '15 / 20', maxGuests: 3, basePrice: 3200,
    feature: ['Odaya göre 2 veya 3 kişi', '2 or 3 guests, depending on room', 'Je nach Zimmer 2 oder 3 Personen'],
    photos: [3, 2, 5].map(number => 'dag-manzarali-cat-kat-' + number),
  },
];

export const posts = [
  {
    id: 'coast',
    slug: ['kucukcakil-ve-kas-limani', 'kucukcakil-and-kas-harbour', 'kucukcakil-und-der-hafen-von-kas'],
    title: ['Küçükçakıl’dan Kaş Limanı’na', 'From Küçükçakıl to Kaş harbour', 'Von Küçükçakıl zum Hafen von Kaş'],
    category: ['Kıyı', 'Coast', 'Küste'],
    image: 'meis-balkon-yeni',
    intro: ['Kaş merkezinde denizle çarşıyı birleştiren kısa bir yürüyüş.', 'A short walk between the waterfront and the old town.', 'Ein kurzer Spaziergang zwischen Meer und Altstadt.'],
    body: [
      ['Küçükçakıl kıyısından Hükümet Caddesi boyunca limana doğru yürüyebilirsiniz. Denize girmeyi planlıyorsanız küçük çakıl taşlı giriş için deniz ayakkabısı işinize yarayabilir.', 'From the Küçükçakıl waterfront, follow Hükümet Caddesi towards the harbour. If you plan to swim, water shoes can help on the pebbly shore.', 'Von der Küste in Küçükçakıl führt die Hükümet Caddesi zum Hafen. Für den Einstieg ins Wasser am Kiesstrand können Badeschuhe hilfreich sein.'],
      ['Limanda tekneleri izlemek için bir mola verin. Dönüş yolunda Uzun Çarşı’nın ara sokaklarına sapıp yürüyüşü merkezde tamamlayabilirsiniz.', 'Pause at the harbour to watch the boats. On the way back, take a detour through the lanes around Uzun Çarşı.', 'Am Hafen lohnt sich eine Pause mit Blick auf die Boote. Auf dem Rückweg können Sie durch die Gassen rund um den Uzun Çarşı bummeln.'],
    ],
  },
  {
    id: 'kekova',
    slug: ['kekova-tekne-rotasi', 'kekova-by-boat', 'kekova-mit-dem-boot'],
    title: ['Tekneyle Kekova', 'Kekova by boat', 'Kekova mit dem Boot'],
    category: ['Tekne', 'Boat trips', 'Bootsausflüge'],
    image: hotel.boat,
    intro: ['Kekova ve Kaleköy için tekne gezisi planlarken bilmeniz gerekenler.', 'What to check when planning a boat trip to Kekova and Kaleköy.', 'Was Sie bei einer Bootstour nach Kekova und Kaleköy beachten sollten.'],
    body: [
      ['Kekova çevresinde güzergâh ve yüzme durakları tura göre değişir. Batık kenti tekneden izleyebilir, Kaleköy’e uğrayan bir rota seçebilirsiniz.', 'Routes and swimming stops around Kekova vary by operator. You can see the sunken ruins from the boat and look for an itinerary that includes Kaleköy.', 'Routen und Badestopps rund um Kekova unterscheiden sich je nach Anbieter. Die versunkenen Ruinen sind vom Boot aus zu sehen. Manche Touren halten auch in Kaleköy.'],
      ['Kalkış limanını, tur süresini ve hava durumunu hareketten önce tur sağlayıcısıyla teyit edin.', 'Confirm the departure harbour, trip duration and weather conditions with the operator before setting off.', 'Klären Sie Abfahrtshafen, Dauer und Wetterbedingungen vorab mit dem Anbieter.'],
    ],
  },
];

export const activities = [
  { post: 'coast' },
  { post: 'kekova' },
  { title: ['Dalış', 'Diving', 'Tauchen'], image: 'canyon7-kapak', description: ['Kaş’ta dalış merkezlerinden seviyenize uygun bir rota ve ekipman bilgisi isteyebilirsiniz.', 'Ask a local dive centre about routes and equipment suited to your experience.', 'Tauchschulen in Kaş beraten Sie zu Routen und Ausrüstung für Ihr Erfahrungsniveau.'] },
  { title: ['Yamaç paraşütü', 'Paragliding', 'Gleitschirmfliegen'], image: 'yamac-parasutu-kapak', description: ['Uçuş saatleri rüzgâra bağlıdır. Koşulları ve buluşma yerini sağlayıcıyla teyit edin.', 'Flights depend on the wind. Confirm conditions and the meeting point with your operator.', 'Die Flüge sind windabhängig. Klären Sie Bedingungen und Treffpunkt mit dem Anbieter.'] },
  { title: ['Likya Yolu', 'Lycian Way', 'Lykischer Weg'], image: 'dsc-3251-3-kopya_1', description: ['Kaş çevresinde etap seçerken mesafeyi, su noktalarını ve dönüş ulaşımını birlikte planlayın.', 'When choosing a stage near Kaş, plan the distance, water stops and return transport together.', 'Berücksichtigen Sie bei Etappen rund um Kaş die Strecke, Wasserstellen und die Rückfahrt.'] },
];
