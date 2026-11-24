import { hotel, hotelNearby, languageTags, local, locales } from '../data/hotel.js';
import sizes from '../data/photoSizes.json';
import { pathFor, titles } from './routes.js';

const descriptions = {
  home: ['Kaş’ın Küçükçakıl kıyısında, Meis’e bakan odaları ve açık büfe kahvaltısıyla Lale Hotel.', 'Lale Hotel in Küçükçakıl, Kaş, with rooms overlooking Meis and a breakfast buffet.', 'Das Lale Hotel in Küçükçakıl, Kaş, mit Zimmern mit Blick auf Meis und Frühstücksbuffet.'],
  rooms: ['Deniz, şehir ve dağ manzaralı beş oda kategorisinin fotoğraflarını ve özelliklerini inceleyin.', 'Browse photographs and features for five room categories with sea, town or mountain views.', 'Entdecken Sie fünf Zimmerkategorien mit Meer-, Stadt- oder Bergblick.'],
  about: ['Lale Hotel Kaş’ın 1970’lere uzanan geçmişi ve 2017 yenilemesi.', 'The history of Lale Hotel Kaş, from the 1970s to its renovation in 2017.', 'Die Geschichte des Lale Hotel Kaş seit den 1970er-Jahren und seine Renovierung 2017.'],
  gallery: ['Kaş kıyısından drone manzaraları ve Lale Hotel Kaş’ın bahçe, kahvaltı ve oda fotoğrafları.', 'Aerial views of the Kaş coast and photos of the garden, breakfast and rooms at Lale Hotel Kaş.', 'Luftaufnahmen der Küste von Kaş und Fotos von Garten, Frühstück und Zimmern im Lale Hotel Kaş.'],
  guide: ['Küçükçakıl, Kekova, dalış ve Likya Yolu için kısa Kaş rehberi.', 'A short Kaş guide to Küçükçakıl, Kekova, diving and the Lycian Way.', 'Ein kurzer Kaş-Reiseführer für Küçükçakıl, Kekova, Tauchen und den Lykischen Weg.'],
  blog: ['Kaş’ta kıyı yürüyüşleri ve tekne gezileri için yerel gezi notları.', 'Local notes for coastal walks and boat trips around Kaş.', 'Tipps für Küstenspaziergänge und Bootsausflüge rund um Kaş.'],
  contact: ['Lale Hotel Kaş’ın adresi, telefon numarası ve yol tarifi.', 'Address, phone number and directions for Lale Hotel Kaş.', 'Adresse, Telefonnummer und Anfahrt zum Lale Hotel Kaş.'],
  booking: ['Lale Hotel Kaş için tarih ve misafir sayısını seçip otelin güncel oda müsaitliğini kontrol edin.', 'Choose your dates and guests and check live room availability at Lale Hotel Kaş.', 'Wählen Sie Reisedaten und Gästezahl und prüfen Sie die Zimmerverfügbarkeit im Lale Hotel Kaş.'],
};

const ogLocales = { tr: 'tr_TR', en: 'en_US', de: 'de_DE' };

const hotelAmenities = {
  tr: ['Ücretsiz Wi-Fi', 'Özel Otopark', 'Açık Büfe Kahvaltı', 'Klima', 'Balkon', 'Bahçe Terası'],
  en: ['Free Wi-Fi', 'Private Parking', 'Breakfast Buffet', 'Air Conditioning', 'Balcony', 'Garden Terrace'],
  de: ['Kostenloses WLAN', 'Privatparkplatz', 'Frühstücksbuffet', 'Klimaanlage', 'Balkon', 'Gartenterrasse'],
};

const faqs = {
  tr: [
    ['Lale Hotel Kaş Küçük Çakıl Plajı’na ne kadar uzaklıkta?', 'Otelimiz Andifli Mahallesi, Hükümet Caddesi No: 19 adresinde, Küçük Çakıl Plajı’na yaklaşık 100 metre (2 dakika) yürüme mesafesindedir.'],
    ['Otelde kahvaltı ve otopark dahil mi?', 'Evet, Lale Hotel Kaş’ta sabah açık büfe kahvaltı servisi, ücretsiz Wi-Fi ve misafirlere özel otopark bulunmaktadır.'],
    ['Giriş ve çıkış saatleri nedir?', 'Otelimize giriş (check-in) 14:00 itibarıyla, çıkış (check-out) ise 12:00’ye kadar yapılmaktadır.'],
    ['Kaş Limanı ve merkeze yürüyerek gidilebilir mi?', 'Evet, Kaş Limanı yaklaşık 400 metre, Kaş merkez ve Uzun Çarşı ise yaklaşık 500 metre yürüme mesafesindedir.'],
    ['Lale Hotel Kaş’a doğrudan online rezervasyon ve satış yapılıyor mu?', 'Evet, web sitemizdeki Rezervasyon sayfasından tarih, oda ve misafir bilgilerini seçerek doğrudan site üzerinden online rezervasyon ve satın alma işlemi yapabilirsiniz.'],
  ],
  en: [
    ['How far is Lale Hotel Kaş from Küçük Çakıl Beach?', 'Located at Hükümet Caddesi No: 19 in Andifli, Kaş, the hotel is approximately 100 metres (a 2-minute walk) from Küçük Çakıl Beach.'],
    ['Does Lale Hotel Kaş offer breakfast and parking?', 'Yes, Lale Hotel Kaş serves a breakfast buffet and provides free Wi-Fi and private guest parking.'],
    ['What are the check-in and check-out times?', 'Check-in starts at 14:00 and check-out is until 12:00.'],
    ['Can I walk to Kaş harbour and town centre?', 'Yes, Kaş harbour is approximately 400 metres away and Kaş town centre is about 500 metres on foot.'],
    ['Can I book directly online at Lale Hotel Kaş?', 'Yes, you can select your dates, rooms, and guest details directly on our Booking page to complete an online reservation.'],
  ],
  de: [
    ['Wie weit ist das Lale Hotel Kaş vom Strand Küçük Çakıl entfernt?', 'Unser Hotel liegt in der Hükümet Caddesi Nr. 19 in Andifli, Kaş, etwa 100 Meter (2 Gehminuten) vom Strand Küçük Çakıl entfernt.'],
    ['Bietet das Hotel Frühstück und Parkplätze an?', 'Ja, im Lale Hotel Kaş erwarten Sie ein Frühstücksbuffet, kostenloses WLAN und ein hoteleigener Privatparkplatz.'],
    ['Wann sind Check-in und Check-out?', 'Der Check-in ist ab 14:00 Uhr und der Check-out bis 12:00 Uhr möglich.'],
    ['Sind der Hafen und das Ortszentrum von Kaş zu Fuß erreichbar?', 'Ja, der Hafen von Kaş ist etwa 400 Meter und das Ortszentrum rund 500 Meter zu Fuß entfernt.'],
    ['Kann ich direkt online beim Lale Hotel Kaş buchen?', 'Ja, auf unserer Buchungsseite können Sie Reisedaten, Zimmer und Gästedaten direkt auswählen und Ihre Buchung online abschließen.'],
  ],
};

export function metadata({ locale, page, item }) {
  const label = local(item?.title ?? titles[page], locale);
  const url = hotel.url + pathFor(locale, page, item);
  const title = page === 'home' ? hotel.name + ' · Küçükçakıl' : label + ' | ' + hotel.name;
  const description = local(item?.description ?? item?.intro ?? descriptions[page] ?? [label + ' · ' + hotel.name], locale);
  const photo = item?.photos?.[0] ?? item?.image ?? (page === 'about' ? hotel.exterior : hotel.hero);
  const image = hotel.url + '/assets/hotel/' + photo + '.jpg';
  const [imageWidth, imageHeight] = sizes[photo] ?? [1920, 1278];

  const schema = [{
    '@type': 'Hotel',
    '@id': hotel.url + '/#hotel',
    name: hotel.name,
    url: hotel.url,
    telephone: hotel.phone,
    email: hotel.email,
    priceRange: '$$',
    checkinTime: '14:00',
    checkoutTime: '12:00',
    hasMap: hotel.googleProfile,
    sameAs: [hotel.googleProfile, hotel.instagram, hotel.tripadvisor],
    image: hotel.url + '/assets/hotel/' + hotel.hero + '.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Andifli Mahallesi, Hükümet Caddesi No: 19',
      addressLocality: 'Kaş',
      addressRegion: 'Antalya',
      postalCode: '07580',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 36.19823,
      longitude: 29.64385,
    },
    amenityFeature: (hotelAmenities[locale] ?? hotelAmenities.tr).map(name => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: hotel.url + pathFor(locale, 'booking'),
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'LodgingReservation',
        name: hotel.name,
      },
    },
    makesOffer: {
      '@type': 'Offer',
      url: hotel.url + pathFor(locale, 'booking'),
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
  }, {
    '@type': 'WebSite',
    '@id': hotel.url + '/#website',
    url: hotel.url,
    name: hotel.name,
    inLanguage: locales.map(code => languageTags[code]),
  }, {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    description,
    inLanguage: languageTags[locale],
    isPartOf: { '@id': hotel.url + '/#website' },
    primaryImageOfPage: { '@id': image + '#image' },
  }, {
    '@type': 'ImageObject',
    '@id': image + '#image',
    contentUrl: image,
    width: imageWidth,
    height: imageHeight,
  }];

  if (item && page === 'room') {
    const numericSize = Number.parseInt(String(item.size).match(/\d+/)?.[0] ?? '24', 10);
    schema.push({
      '@type': 'HotelRoom',
      name: label,
      description,
      image,
      url,
      containedInPlace: { '@id': hotel.url + '/#hotel' },
      occupancy: { '@type': 'QuantitativeValue', maxValue: item.maxGuests },
      floorSize: { '@type': 'QuantitativeValue', value: numericSize, unitCode: 'MTK' },
    });
  }

  if (item && page === 'post') {
    schema.push({
      '@type': 'BlogPosting',
      headline: label,
      image,
      description,
      url,
      inLanguage: languageTags[locale],
      publisher: { '@id': hotel.url + '/#hotel' },
      mainEntityOfPage: { '@id': url },
    });
  }

  if (page === 'home' || page === 'contact') {
    schema.push({
      '@type': 'FAQPage',
      mainEntity: (faqs[locale] ?? faqs.tr).map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  if (page !== 'home' && page !== 'missing') {
    const paths = [{ label: hotel.name, url: hotel.url + pathFor(locale, 'home') }];
    if (item) {
      const parent = page === 'room' ? 'rooms' : 'blog';
      paths.push({ label: local(titles[parent], locale), url: hotel.url + pathFor(locale, parent) });
    }
    paths.push({ label, url });
    schema.push({
      '@type': 'BreadcrumbList',
      itemListElement: paths.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.label,
        item: entry.url,
      })),
    });
  }

  return {
    title,
    description,
    url,
    image,
    imageWidth,
    imageHeight,
    imageAlt: title,
    siteName: hotel.name,
    ogLocale: ogLocales[locale] ?? 'tr_TR',
    ogLocaleAlternates: locales.filter(code => code !== locale).map(code => ogLocales[code]),
    schema: { '@context': 'https://schema.org', '@graph': schema },
    index: !['booking', 'missing', 'privacy', 'cookies', 'kvkk', 'cancellation'].includes(page),
    links: locales.map(code => [languageTags[code], hotel.url + pathFor(code, page, item)]).concat([['x-default', hotel.url + pathFor('tr', page, item)]]),
  };
}
