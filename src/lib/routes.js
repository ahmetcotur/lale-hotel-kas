import { hotel, locales, local, posts, rooms } from '../data/hotel.js';

export const basePath = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');
export const assetUrl = path => basePath + (path.startsWith('/') ? path : '/' + path);

export const routes = {
  home: ['', '', ''],
  rooms: ['odalar', 'rooms', 'zimmer'],
  about: ['hakkimizda', 'about', 'ueber-uns'],
  gallery: ['galeri', 'gallery', 'galerie'],
  guide: ['kas-rehberi', 'kas-guide', 'kas-reisefuehrer'],
  blog: ['blog', 'blog', 'blog'],
  contact: ['iletisim', 'contact', 'kontakt'],
  booking: ['rezervasyon', 'booking', 'buchung'],
  privacy: ['gizlilik-politikasi', 'privacy-policy', 'datenschutz'],
  cookies: ['cerez-politikasi', 'cookie-policy', 'cookie-richtlinie'],
  kvkk: ['kvkk', 'personal-data', 'personenbezogene-daten'],
  cancellation: ['iptal-ve-iade-kosullari', 'cancellation-and-refunds', 'stornierung-und-erstattung'],
};

export const titles = {
  home: [hotel.name, hotel.name, hotel.name],
  rooms: ['Odalar', 'Rooms', 'Zimmer'],
  about: ['Otelimiz', 'Our hotel', 'Unser Hotel'],
  gallery: ['Galeri', 'Gallery', 'Galerie'],
  guide: ['Kaş Rehberi', 'Kaş Guide', 'Kaş-Reiseführer'],
  blog: ['Kaş Günlüğü', 'Kaş Journal', 'Kaş-Journal'],
  contact: ['İletişim', 'Contact', 'Kontakt'],
  booking: ['Rezervasyon', 'Booking', 'Buchung'],
  privacy: ['Gizlilik Politikası', 'Privacy Policy', 'Datenschutzhinweise'],
  cookies: ['Çerez Politikası', 'Cookie Policy', 'Cookie-Hinweise'],
  kvkk: ['Kişisel Veriler (KVKK)', 'Personal data (KVKK)', 'Personenbezogene Daten (KVKK)'],
  cancellation: ['İptal ve İade', 'Cancellation and refunds', 'Stornierung und Erstattung'],
  missing: ['Sayfa bulunamadı', 'Page not found', 'Seite nicht gefunden'],
};

export function pathFor(locale, page, item) {
  const base = page === 'room' ? 'rooms' : page === 'post' ? 'blog' : page;
  const parts = [locale, local(routes[base] ?? routes.home, locale), item && local(item.slug, locale)];
  return basePath + '/' + parts.filter(Boolean).join('/') + '/';
}

export const redirects = Object.fromEntries([
  ['/', '/tr/'],
  ['/index.html', '/tr/'],
  ...Object.entries({
    odalar: 'rooms', hakkimizda: 'about', galeri: 'gallery', 'kas-rehberi': 'guide',
    blog: 'blog', iletisim: 'contact', rezervasyon: 'booking', 'cerez-politikasi': 'cookies',
    'gizlilik-politikasi': 'privacy', kvkk: 'kvkk', 'iptal-ve-iade-kosullari': 'cancellation',
  }).flatMap(([slug, page]) => ['/' + slug, '/' + slug + '.html'].map(from => [from, pathFor('tr', page)])),
  ...rooms.flatMap(room => {
    const slug = room.id === 'sea-islands' ? 'deniz-adalar-manzarali' : room.slug[0];
    return ['/oda-' + slug, '/oda-' + slug + '.html'].map(from => [from, pathFor('tr', 'room', room)]);
  }),
]);

export function matchRoute(path) {
  const stripped = basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
  const normalized = '/' + stripped.split('/').filter(Boolean).join('/');
  if (redirects[normalized]) return matchRoute(redirects[normalized]);
  const [, language, section = '', slug, ...extra] = normalized.split('/');
  const locale = locales.includes(language) ? language : 'tr';
  if (!locales.includes(language) || extra.length) return { locale, page: 'missing' };
  const [page] = Object.entries(routes).find(([, slugs]) => local(slugs, locale) === section) ?? [];
  if (!page) return { locale, page: 'missing' };
  if (!slug) return { locale, page };
  const list = page === 'rooms' ? rooms : page === 'blog' ? posts : [];
  const item = list.find(entry => local(entry.slug, locale) === slug);
  return item ? { locale, page: page === 'rooms' ? 'room' : 'post', item } : { locale, page: 'missing' };
}

export const canonicalPaths = locales.flatMap(locale => {
  const rawPath = (page, item) => {
    const base = page === 'room' ? 'rooms' : page === 'post' ? 'blog' : page;
    const parts = [locale, local(routes[base] ?? routes.home, locale), item && local(item.slug, locale)];
    return '/' + parts.filter(Boolean).join('/') + '/';
  };
  return [
    ...Object.keys(routes).map(page => rawPath(page)),
    ...rooms.map(item => rawPath('room', item)),
    ...posts.map(item => rawPath('post', item)),
  ];
});
