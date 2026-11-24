const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const DB_PATH = path.join(__dirname, '../../data/lale_hotel.sqlite');

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    dbInstance = new DatabaseSync(DB_PATH);
    initTables(dbInstance);
    seedInitialData(dbInstance);
  }
  return dbInstance;
}

function initTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name_tr TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_de TEXT NOT NULL,
      view_tr TEXT,
      view_en TEXT,
      view_de TEXT,
      description_tr TEXT,
      description_en TEXT,
      description_de TEXT,
      base_price REAL NOT NULL,
      capacity_adults INTEGER DEFAULT 2,
      capacity_children INTEGER DEFAULT 1,
      size_m2 INTEGER DEFAULT 25,
      bed_type TEXT DEFAULT '1 Çift Kişilik Yatak',
      main_image TEXT NOT NULL,
      gallery_images TEXT,
      amenities TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_code TEXT UNIQUE NOT NULL,
      room_id INTEGER NOT NULL REFERENCES rooms(id),
      checkin TEXT NOT NULL,
      checkout TEXT NOT NULL,
      nights INTEGER NOT NULL,
      adults INTEGER NOT NULL,
      children INTEGER DEFAULT 0,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      guest_phone TEXT NOT NULL,
      guest_note TEXT,
      arrival_time TEXT DEFAULT '14:00',
      total_price REAL NOT NULL,
      discount_applied REAL DEFAULT 0,
      promo_code TEXT,
      payment_method TEXT DEFAULT 'credit_card',
      payment_status TEXT DEFAULT 'pending',
      reservation_status TEXT DEFAULT 'confirmed',
      hms_status TEXT DEFAULT 'pending_sync',
      hms_reservation_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      title_tr TEXT NOT NULL,
      title_en TEXT NOT NULL,
      title_de TEXT NOT NULL,
      excerpt_tr TEXT,
      excerpt_en TEXT,
      excerpt_de TEXT,
      content_tr TEXT,
      content_en TEXT,
      content_de TEXT,
      cover_image TEXT,
      read_time_min INTEGER DEFAULT 5,
      is_published INTEGER DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_percent REAL NOT NULL,
      valid_from TEXT,
      valid_to TEXT,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS hms_sync_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

function seedInitialData(db) {
  const roomCountStmt = db.prepare('SELECT COUNT(*) as count FROM rooms');
  const { count } = roomCountStmt.get();

  if (count === 0) {
    const insertRoom = db.prepare(`
      INSERT INTO rooms (
        slug, name_tr, name_en, name_de,
        view_tr, view_en, view_de,
        description_tr, description_en, description_de,
        base_price, capacity_adults, capacity_children, size_m2, bed_type,
        main_image, gallery_images, amenities, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const initialRooms = [
      [
        'deniz-adalar-manzarali',
        'Deniz & Adalar Manzaralı Oda',
        'Sea & Islands View Room',
        'Zimmer mit Meer- und Inselblick',
        'Balkon · Panoramik Deniz ve Meis Adası Manzarası',
        'Balcony · Panoramic Sea and Meis Island View',
        'Balkon · Panoramablick auf das Meer und die Insel Kastelorizo',
        'Geniş özel balkonunuzdan Meis Adası ve Akdeniz mavisini izleyebileceğiniz, butik zarafetle tasarlanmış en popüler odamız.',
        'Our signature room featuring a private balcony overlooking Kastelorizo Island and the crystal-clear Mediterranean.',
        'Unser Signature-Zimmer mit privatem Balkon und Blick auf die Insel Kastelorizo und das Mittelmeer.',
        4800, 2, 1, 28, '1 Büyük Çift Kişilik (King)',
        'assets/hotel/balkon-deniz-ve-adalar-manzarali-1_1.jpg',
        JSON.stringify([
          'assets/hotel/balkon-deniz-ve-adalar-manzarali-1_1.jpg',
          'assets/hotel/deniz-ve-adalar-manzarali-balkonlu-oda-4.jpg',
          'assets/hotel/deniz-ve-adalar-manzarali-balkonlu-oda-5.jpg'
        ]),
        JSON.stringify(['Özel Balkon', 'Deniz Manzarası', 'Klima', 'Hızlı Wi-Fi', 'Minibar', 'Kasa', 'Nespresso Makinesi', 'Lüks Buklet Malzemeleri'])
      ],
      [
        'deniz-manzarali-cati-kati',
        'Deniz Manzaralı Çatı Katı',
        'Sea View Penthouse Suite',
        'Penthouse-Suite mit Meerblick',
        'Çatı Katı · Geniş Teras & Sonsuz Akdeniz Ufku',
        'Penthouse · Spacious Terrace & Endless Horizon',
        'Penthouse · Große Terrasse & Unendlicher Horizont',
        'Otelin en üst katında, eşsiz Akdeniz ve gün batımı manzarasına hâkim, ferah ve romantik çatı katı süiti.',
        'Located on the top floor with an expansive private terrace overlooking the breathtaking Mediterranean sunsets.',
        'In der obersten Etage gelegen mit einer großzügigen privaten Terrasse und Blick auf die atemberaubenden Sonnenuntergänge.',
        5200, 2, 0, 32, '1 Geniş King Yatak',
        'assets/hotel/deniz-manzarali-cat-kat-4.jpg',
        JSON.stringify([
          'assets/hotel/deniz-manzarali-cat-kat-4.jpg',
          'assets/hotel/deniz-manzarali-cat-kat-2.jpg'
        ]),
        JSON.stringify(['Özel Teras', 'Panoramik Manzara', 'Şezlong Alanı', 'Klima', 'Hızlı Wi-Fi', 'Premium Ses Sistemi', 'Kasa', 'Lüks Banyo'])
      ],
      [
        'cift-kisilik-sehir-manzarali',
        'Çift Kişilik Şehir Manzaralı Oda',
        'Double City View Room',
        'Doppelzimmer mit Stadtblick',
        'Balkon · Tarihi Kaş Sokakları ve Begonviller',
        'Balcony · Historic Kaş Streets & Bougainvilleas',
        'Balkon · Historische Gassen von Kaş & Bougainvillea',
        'Kaş’ın begonvilli sokaklarına bakan ferah balkonu ve sakin iç mekânı ile huzurlu bir dinlenme köşesi.',
        'Cozy and elegant room overlooking the charming streets and bougainvilleas of Kaş town.',
        'Gemütliches Zimmer mit Blick auf die malerischen Gassen und Bougainvilleen von Kaş.',
        3600, 2, 0, 24, '1 Çift Kişilik Yatak',
        'assets/hotel/cift-kisilik-sehir-manzarali-oda-1.jpg',
        JSON.stringify([
          'assets/hotel/cift-kisilik-sehir-manzarali-oda-1.jpg',
          'assets/hotel/cift-kisilik-sehir-manzarali-oda-2.jpg'
        ]),
        JSON.stringify(['Balkon', 'Şehir Manzarası', 'Klima', 'Hızlı Wi-Fi', 'Minibar', 'Kasa', 'Saç Kurutma'])
      ],
      [
        'uc-kisilik-sehir-manzarali',
        'Üç Kişilik Şehir Manzaralı Oda',
        'Triple City View Room',
        'Dreibettzimmer mit Stadtblick',
        'Geniş Balkon · Aile ve Küçük Gruplar İçin İdeal',
        'Spacious Balcony · Ideal for Families & Small Groups',
        'Großer Balkon · Ideal für Familien & kleine Gruppen',
        'Bir çift ve bir tek kişilik konforlu yataklarıyla aileler veya arkadaş grupları için ferah konaklama alternatifi.',
        'Spacious accommodation with one double and one single bed, perfect for small families or friend getaways.',
        'Geräumiges Zimmer mit einem Doppel- und einem Einzelbett, perfekt für Familien oder kleine Gruppen.',
        4200, 3, 1, 30, '1 Çift + 1 Tek Kişilik Yatak',
        'assets/hotel/uc-kisilik-sehir-manzarali-oda-1.jpg',
        JSON.stringify([
          'assets/hotel/uc-kisilik-sehir-manzarali-oda-1.jpg',
          'assets/hotel/uc-kisilik-sehir-manzarali-oda-3.jpg'
        ]),
        JSON.stringify(['Geniş Alan', 'Balkon', 'Klima', 'Hızlı Wi-Fi', 'Minibar', 'Kasa', 'Oturma Alanı'])
      ],
      [
        'dag-manzarali-cati-kati',
        'Dağ Manzaralı Çatı Katı',
        'Mountain View Penthouse',
        'Penthouse mit Bergblick',
        'Çatı Katı · Toros Dağları ve Likya Doğa Manzarası',
        'Penthouse · Taurus Mountains & Lycian Nature View',
        'Penthouse · Taurusgebirge & Lykische Naturkulisse',
        'Kaş’ın görkemli Toros dağlarının silüetine bakan, sessiz, dingin ve kendine özgü çatı katı odası.',
        'Peaceful penthouse room facing the dramatic silhouette of the Taurus mountains.',
        'Ruhiges Penthouse-Zimmer mit Blick auf das majestätische Panorama des Taurusgebirges.',
        3900, 2, 0, 26, '1 Çift Kişilik Yatak',
        'assets/hotel/dag-manzarali-cat-kat-3.jpg',
        JSON.stringify([
          'assets/hotel/dag-manzarali-cat-kat-3.jpg',
          'assets/hotel/dag-manzarali-cat-kat-1.jpg'
        ]),
        JSON.stringify(['Dağ Manzarası', 'Sessiz Konum', 'Klima', 'Hızlı Wi-Fi', 'Minibar', 'Kasa', 'Çalışma Masası'])
      ]
    ];

    for (const room of initialRooms) {
      insertRoom.run(...room);
    }
  }

  // Seed Blog Posts if empty
  const blogCountStmt = db.prepare('SELECT COUNT(*) as count FROM blog_posts');
  const { count: blogCount } = blogCountStmt.get();

  if (blogCount === 0) {
    const insertBlog = db.prepare(`
      INSERT INTO blog_posts (
        slug, category, title_tr, title_en, title_de,
        excerpt_tr, excerpt_en, excerpt_de,
        content_tr, content_en, content_de,
        cover_image, read_time_min, is_published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `);

    const now = new Date().toISOString();
    const initialBlogs = [
      [
        'kas-ve-kucukcakil-gezi-rehberi',
        'guide',
        'Kaş ve Küçükçakıl Gezi Rehberi: Akdeniz’in Kalbinde Bir Kaçış',
        'Kaş & Küçükçakıl Travel Guide: An Escape to the Heart of the Mediterranean',
        'Kaş & Küçükçakıl Reiseführer: Ein Ausflug ins Herz des Mittelmeers',
        'Küçükçakıl Koyu’nun soğuk kaynak sularından Kaş’ın begonvilli sokaklarına unutulmaz bir rota.',
        'From the fresh spring waters of Küçükçakıl Bay to the bougainvillea-covered streets of Kaş.',
        'Von den erfrischenden Quellwassern der Küçükçakıl-Bucht bis zu den Bougainvillea-Gassen von Kaş.',
        '<p>Kaş, Akdeniz’in bozulmamış doğasını ve samimi kasaba ruhunu en saf hâliyle koruyan nadir rotalardan biridir. Lale Hotel Kaş, merkezdeki sakin konumuyla Küçükçakıl Koyu’na sadece birkaç adım mesafededir.</p><h3>Küçükçakıl Deneyimi</h3><p>Denizin altından kaynayan tatlı su kaynakları sayesinde Küçükçakıl, Kaş’ın en serinletici ve kristal berraklığındaki sularına ev sahipliği yapar. Sabah erken saatlerde sakin bir yüzme seansı, günün tüm yorgunluğunu unutturur.</p>',
        '<p>Kaş remains one of the most authentic and pristine Mediterranean towns. Lale Hotel Kaş is positioned in a peaceful central neighborhood just steps from Küçükçakıl Bay.</p>',
        '<p>Kaş ist eines der reinsten Reiseziele im Mittelmeerraum. Das Lale Hotel Kaş liegt ruhig und dennoch zentral, nur wenige Schritte von der Bucht Küçükçakıl entfernt.</p>',
        'assets/hotel/balkon-deniz-ve-adalar-manzarali-1_1.jpg',
        5,
        now
      ],
      [
        'kasin-en-guzel-koylari-ve-plajlari',
        'beaches',
        'Kaş’ın En Güzel Koyları: Kaputaş’tan Limanağzı’na',
        'Best Beaches of Kaş: From Kaputaş to Limanağzı',
        'Die schönsten Buchten von Kaş: Von Kaputaş bis Limanağzı',
        'Turkuazın her tonunu görebileceğiniz Kaş plajları ve koyları hakkında kapsamlı rehber.',
        'Comprehensive guide to the turquoise bays and beaches around Kaş.',
        'Umfassender Reiseführer zu den türkisblauen Buchten rund um Kaş.',
        '<p>Kaş coğrafyası, Türkiye’nin en etkileyici plajlarına ev sahipliği yapar. Kanyon ağzında parıldayan Kaputaş Plajı, teknelerle ulaşılan Limanağzı ve otelimize yürüme mesafesindeki Küçükçakıl, listenin başında gelir.</p>',
        '<p>From the world-renowned Kaputaş Beach framed by a natural canyon to boat-only Limanağzı bays, explore the coastline of Kaş.</p>',
        '<p>Erleben Sie die weltberühmte Kaputaş-Bucht und versteckte Naturparadiese an der lykischen Küste.</p>',
        'assets/hotel/deniz-ve-adalar-manzarali-balkonlu-oda-4.jpg',
        6,
        now
      ],
      [
        'kas-gastronomi-ve-meyhane-kulturu',
        'gastronomy',
        'Kaş Gastronomi Rehberi: Akdeniz Mezeleri ve Deniz Mahsulleri',
        'Kaş Gastronomy Guide: Mediterranean Mezes & Fresh Seafood',
        'Gastronomieführer Kaş: Mediterrane Meze & Frischer Fisch',
        'Lokal zeytinyağlılar, taze balıklar ve begonviller altındaki Kaş akşamları.',
        'Local olive oil specialties, fresh catches, and dining under the bougainvilleas.',
        'Lokale Olivenölspezialitäten, fangfrischer Fisch und unvergessliche Abende in Kaş.',
        '<p>Akdeniz mutfağının Ege esintileriyle harmanlandığı Kaş akşamları, damaklarda unutulmaz tatlar bırakır. Yerel üreticilerden temin edilen zeytinyağları, taze otlar ve günlük balıklar Kaş sofralarının vazgeçilmezidir.</p>',
        '<p>Kaş evening dining combines authentic Aegean and Mediterranean flavors, renowned for wild herbs and daily catches.</p>',
        '<p>Die Abende in Kaş bieten unvergleichliche kulinarische Erlebnisse mit mediterranen Aromen und fangfrischem Fisch.</p>',
        'assets/hotel/deniz-manzarali-cat-kat-4.jpg',
        4,
        now
      ]
    ];

    for (const blog of initialBlogs) {
      insertBlog.run(...blog);
    }
  }

  // Seed Promotions if empty
  const promoCountStmt = db.prepare('SELECT COUNT(*) as count FROM promotions');
  const { count: promoCount } = promoCountStmt.get();

  if (promoCount === 0) {
    const insertPromo = db.prepare('INSERT INTO promotions (code, discount_percent, valid_from, valid_to, is_active) VALUES (?, ?, ?, ?, 1)');
    insertPromo.run('LALE10', 10, '2025-01-01', '2027-12-31');
    insertPromo.run('DIRECT15', 15, '2025-01-01', '2027-12-31');
    insertPromo.run('ERKENREZ', 12, '2025-01-01', '2027-12-31');
  }

  // Seed Settings if empty
  const settingsCountStmt = db.prepare('SELECT COUNT(*) as count FROM settings');
  const { count: settingsCount } = settingsCountStmt.get();

  if (settingsCount === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('hotel_name', 'Lale Hotel Kaş');
    insertSetting.run('hotel_phone', '+90 (242) 836 12 34');
    insertSetting.run('hotel_whatsapp', '+905321234567');
    insertSetting.run('hotel_email', 'info@lalehotelkas.com');
    insertSetting.run('hotel_address', 'Andifli Mah. Küçükçakıl Mevkii, Kaş / Antalya');
    insertSetting.run('hms_api_enabled', 'true');
    insertSetting.run('hms_provider', 'HMS Otel Yönetim Sistemi (REST API)');
    insertSetting.run('pos_provider', 'iyzico / Sanal POS 3D Secure');
  }
}

module.exports = {
  getDb
};
