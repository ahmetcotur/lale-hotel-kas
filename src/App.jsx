import React, { useEffect, useRef, useState } from 'react';
import { languageTags, local, rooms } from './data/hotel.js';
import { matchRoute, pathFor, titles } from './lib/routes.js';
import { emptyStay, readStay } from './lib/booking.js';
import { metadata } from './lib/seo.js';
import { track } from './lib/analytics.js';
import { AnalyticsConsent } from './components/AnalyticsConsent.jsx';
import { PageHeading, SiteFooter, SiteHeader } from './components/HotelUI.jsx';
import { useHotelMotion } from './components/useHotelMotion.js';
import { AboutPage, BlogPage, ContactPage, GalleryPage, GuidePage, HomePage, PolicyPage, PostPage, RoomPage, RoomsPage } from './pages/HotelPages.jsx';
import { BookingPage } from './pages/BookingPage.jsx';

const pages = {
  home: HomePage, rooms: RoomsPage, room: RoomPage, gallery: GalleryPage, about: AboutPage,
  guide: GuidePage, post: PostPage, blog: BlogPage, contact: ContactPage, booking: BookingPage,
  privacy: PolicyPage, cookies: PolicyPage, kvkk: PolicyPage, cancellation: PolicyPage,
};
const storageKey = 'lale-stay-v1';

export function App({ pathname }) {
  const route = matchRoute(pathname);
  const { locale, page, item } = route;
  const [stay, setStayState] = useState(emptyStay);
  const [searchOnArrival, setSearchOnArrival] = useState(false);
  const main = useRef(null);
  useHotelMotion(main, page);

  useEffect(() => {
    document.documentElement.lang = languageTags[locale];
    document.title = metadata(route).title;
    let saved;
    try { saved = JSON.parse(sessionStorage.getItem(storageKey)); } catch {}
    const params = new URLSearchParams(location.search);
    const roomParam = params.get('room');
    const preferredRoom = rooms.find(entry => entry.id === roomParam || entry.slug.includes(roomParam)
      || (entry.id === 'sea-islands' && roomParam === 'deniz-adalar-manzarali'));
    setStayState(readStay({ ...saved, ...(preferredRoom ? { roomIds: [preferredRoom.id] } : {}) }));
    setSearchOnArrival(page === 'booking' && params.get('search') === '1');
  }, [pathname]);

  function setStay(value) {
    setStayState(value);
    try { sessionStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
  }

  const Page = pages[page];
  return <>
    <a href="#main-content" className="skip-link">{local(['İçeriğe geç', 'Skip to content', 'Zum Inhalt springen'], locale)}</a>
    <SiteHeader {...route} />
    <main ref={main} id="main-content" tabIndex="-1">
      {Page ? <Page {...route} searchOnArrival={searchOnArrival} stay={stay} setStay={setStay} onSearch={() => {
        setStay(stay);
        location.assign(pathFor(locale, 'booking') + '?search=1');
      }} /> : <PageHeading title={local(titles.missing, locale)}><a className="text-link" href={pathFor(locale, 'home')}>{local(['Ana sayfa', 'Home', 'Startseite'], locale)}</a></PageHeading>}
    </main>
    <AnalyticsConsent locale={locale} page={page} recordPage={() => {
      if (page === 'rooms') track('view_item_list', { items: rooms.map(room => ({ item_id: room.id, item_name: local(room.title, locale) })) });
      if (page === 'room') track('view_item', { items: [{ item_id: item.id, item_name: local(item.title, locale) }] });
    }} />
    <SiteFooter locale={locale} page={page} />
  </>;
}
