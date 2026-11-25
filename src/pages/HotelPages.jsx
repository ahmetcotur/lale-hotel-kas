import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Mail, Pause, Phone, Play, Search } from 'lucide-react';
import { breakfastShowcase, hotel, hotelHighlights, hotelNearby, hotelPhotography, hotelSpaces, local, rooms, posts, activities } from '../data/hotel.js';
import { analyticsId, track } from '../lib/analytics.js';
import { pathFor, titles } from '../lib/routes.js';
import { HotelMap, HotelProfileLinks, PageHeading, Photo, PhotoGallery, GuestReviewsPrompt } from '../components/HotelUI.jsx';
import { BookingSearch } from '../components/BookingSearch.jsx';

const story = [
  'Lale Hotel’in hikâyesi 1970’lerde başladı. Ailemizin Kaş’ta kurduğu otel, 2017’de baştan sona yenilendi. Bugün misafirlerimizi yine Küçükçakıl’da, Hükümet Caddesi’ndeki aynı adreste ağırlıyoruz.',
  'The story of Lale Hotel began in the 1970s. Our family’s hotel was fully renovated in 2017. We still welcome guests at the same address on Hükümet Caddesi in Küçükçakıl.',
  'Die Geschichte des Lale Hotels begann in den 1970er-Jahren. 2017 wurde unser Familienhotel umfassend renoviert. Wir empfangen Sie weiterhin an derselben Adresse in der Hükümet Caddesi in Küçükçakıl.',
];

const breakfast = ['Açık büfe kahvaltı', 'Breakfast buffet', 'Frühstücksbuffet'];
const photoLabel = (name, locale) => local(hotelPhotography.find(photo => photo.name === name).label, locale);
const roomCTA = ['Odayı inceleyin', 'View room', 'Zimmer ansehen'];

function BreakfastPhotos({ locale }) {
  return <div className="breakfast-photos">
    {breakfastShowcase.map((name, index) => <Photo key={name} name={name} alt={photoLabel(name, locale)}
      sizes={index === 0 ? '(min-width: 850px) 52vw, 92vw' : '(min-width: 850px) 26vw, 46vw'} />)}
  </div>;
}

function HotelExterior({ locale, priority = false }) {
  const label = photoLabel(hotel.exterior, locale);
  return <figure className="photo-figure hotel-exterior">
    <Photo name={hotel.exterior} alt={label} priority={priority} className="editorial-photo" sizes="(min-width: 850px) 420px, (min-width: 470px) 420px, 92vw" />
    <figcaption>{local(['Lale Hotel Kaş · Bahçeden görünüm', 'Lale Hotel Kaş · View from the garden', 'Lale Hotel Kaş · Blick vom Garten'], locale)}</figcaption>
  </figure>;
}

function HotelSpaceGallery({ names, locale, heading }) {
  const label = local(heading, locale);
  return <section className="hotel-space-gallery">
    <h3>{label}</h3>
    <PhotoGallery grid locale={locale} label={label} photos={names.map(name => ({ name, label: photoLabel(name, locale) }))} />
  </section>;
}

function Link({ locale, page, item, fragment, children, className = 'text-link' }) {
  return <a className={className} href={pathFor(locale, page, item) + (fragment ? '#' + fragment : '')}>{children ?? local(titles[page], locale)}</a>;
}

function RoomCard({ room, locale, heading: Heading = 'h3' }) {
  return (
    <article className="room-card" data-room-card>
      <a className="room-card-link" href={pathFor(locale, 'room', room)}>
        <div className="card-photo">
          <Photo name={room.photos[0]} alt="" sizes="(min-width: 900px) 34vw, (min-width: 650px) 50vw, 95vw" />
        </div>
        <div className="room-card-body">
          <Heading>{local(room.title, locale)}</Heading>
          <p>{room.size} m² <span aria-hidden="true">·</span> {room.maxGuests} {local(['kişiye kadar', 'guests maximum', 'Gäste maximal'], locale)}</p>
          <span className="room-card-action">{local(roomCTA, locale)}</span>
        </div>
      </a>
    </article>
  );
}

function FeaturedRooms({ locale }) {
  const rail = useRef(null);
  const direction = useRef(1);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const title = local(titles.rooms, locale);
  const featured = [rooms[0], rooms[3], rooms[1], rooms[2], rooms[4]];

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  function move(amount, auto = false) {
    const list = rail.current;
    const { scrollLeft, scrollWidth, clientWidth, children } = list;
    const end = scrollWidth - clientWidth;
    const step = children[1].offsetLeft - children[0].offsetLeft;
    if (end < 2 || !step) return;
    if (!auto) setPlaying(false);
    const target = scrollLeft + step * amount;
    list.scrollTo({ left: Math.max(0, Math.min(target, end)), behavior: reducedMotion ? 'instant' : 'smooth' });
    if (auto) direction.current = target >= end - 2 ? -1 : target <= 2 ? 1 : amount;
  }

  useEffect(() => {
    if (!playing || reducedMotion || interacting) return;
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry.isIntersecting) timer = setInterval(() => {
        if (!document.hidden) move(direction.current, true);
      }, 5600);
    }, { threshold: .25 });
    let timer;
    observer.observe(rail.current);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, [playing, reducedMotion, interacting]);

  return <section id={local(['odalarimiz', 'our-rooms', 'unsere-zimmer'], locale)} className="section section-sand home-rooms">
    <div className="wrap">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="room-rail-controls">
          <Link locale={locale} page="rooms">{local(['Tüm odalar', 'All rooms', 'Alle Zimmer'], locale)}</Link>
          {!reducedMotion && <button type="button" className="icon-button" onClick={() => setPlaying(!playing)} aria-label={playing ? local(['Kaydırmayı durdur', 'Pause carousel', 'Karussell anhalten'], locale) : local(['Kaydırmayı başlat', 'Play carousel', 'Karussell starten'], locale)}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>}
          <button type="button" className="icon-button" onClick={() => move(-1)} aria-label={local(['Önceki oda', 'Previous room', 'Vorheriges Zimmer'], locale)}><ChevronLeft size={19} aria-hidden="true" /></button>
          <button type="button" className="icon-button" onClick={() => move(1)} aria-label={local(['Sonraki oda', 'Next room', 'Nächstes Zimmer'], locale)}><ChevronRight size={19} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="room-rail" ref={rail} onPointerDown={() => setPlaying(false)} onPointerEnter={event => {
        if (event.pointerType === 'mouse') setInteracting(true);
      }} onPointerLeave={() => setInteracting(false)} onFocus={() => setPlaying(false)} aria-label={title}>
        {featured.map(room => <RoomCard room={room} locale={locale} key={room.id} />)}
      </div>
    </div>
  </section>;
}

export function HomePage({ locale, stay, setStay, onSearch }) {
  return (
    <>
      <section id={local(['ana-sayfa', 'home', 'startseite'], locale)} className="hero">
        <Photo name={hotel.hero} alt={photoLabel(hotel.hero, locale)} priority className="hero-image" />
        <div className="wrap hero-content">
          <p className="eyebrow">Küçükçakıl · Kaş</p>
          <h1>{local(['Kaş’ta, Meis’e karşı.', 'In Kaş, looking out to Meis.', 'In Kaş, mit Blick auf Meis.'], locale)}</h1>
          <Link locale={locale} page="rooms" className="button button-light">{local(['Odaları keşfedin', 'Explore rooms', 'Zimmer entdecken'], locale)}</Link>
        </div>
      </section>
      <div className="wrap home-search">
        <BookingSearch locale={locale} value={stay} onChange={setStay} onSearch={onSearch} />
        <p className="availability-note">{local(['Güncel oda fiyatı ve müsaitlik otelin rezervasyon ekranında gösterilir.', 'The hotel booking system shows live rates and availability.', 'Aktuelle Preise und Verfügbarkeit sehen Sie im Hotelbuchungssystem.'], locale)}</p>
      </div>

      <section id={local(['hakkimizda', 'about-us', 'uber-uns'], locale)} className="wrap section home-hotel">
        <div className="home-story">
          <div>
            <span className="eyebrow">Lale Hotel Kaş</span>
            <h2>{local(['Küçükçakıl’da bir aile oteli', 'A family hotel in Küçükçakıl', 'Ein Familienhotel in Küçükçakıl'], locale)}</h2>
            <p>{local(story, locale)}</p>
            <p>{local(['Sabah açık büfe kahvaltıdan sonra Küçük Çakıl’a yüzmeye inebilir, akşam yemeği için liman çevresine yürüyebilirsiniz. Otelde ücretsiz Wi-Fi ve özel otopark bulunuyor.', 'After the breakfast buffet, head down to Küçük Çakıl for a swim. In the evening, walk to the harbour for dinner. The hotel offers free Wi-Fi and private parking.', 'Nach dem Frühstücksbuffet können Sie zum Baden nach Küçük Çakıl hinuntergehen. Abends erreichen Sie die Restaurants am Hafen zu Fuß. Das Hotel bietet kostenloses WLAN und einen Privatparkplatz.'], locale)}</p>
            <div className="home-hotel-links">
              <Link locale={locale} page="about" />
              <Link locale={locale} page="gallery">{local(['Otel fotoğrafları', 'Hotel photos', 'Hotelfotos'], locale)}</Link>
            </div>
          </div>
          <HotelExterior locale={locale} />
        </div>
        <div className="home-nearby">
          <h3>{local(['Otele ne kadar yakın?', 'How far from the hotel?', 'Wie weit ist es vom Hotel?'], locale)}</h3>
          <ul>
            {hotelNearby.map(({ label, distance, destination }) => {
              const route = new URLSearchParams({ api: '1', origin: hotel.name + ', Hükümet Caddesi 19, Kaş', destination, travelmode: 'walking' });
              return <li key={destination}>
                <a href={'https://www.google.com/maps/dir/?' + route} target="_blank" rel="noreferrer">
                  <span className="nearby-distance">≈ {local(distance, locale)}</span>
                  <span>{local(label, locale)}</span>
                </a>
              </li>;
            })}
          </ul>
          <p className="small muted">{local(['Mesafeler yaklaşıktır. Yürüyüş rotası için konumu seçin.', 'Distances are approximate. Select a place for walking directions.', 'Die Entfernungen sind Richtwerte. Wählen Sie ein Ziel für die Route zu Fuß.'], locale)}</p>
        </div>

      </section>

      <FeaturedRooms locale={locale} />

      <section className="wrap section split-section home-breakfast">
        <div className="breakfast-copy">
          <h2>{local(breakfast, locale)}</h2>
          <p>{local(['Otelimizde kahvaltı açık büfe olarak servis edilir.', 'Breakfast is served buffet-style at the hotel.', 'Im Hotel servieren wir das Frühstück als Buffet.'], locale)}</p>
          <Link locale={locale} page="gallery" fragment="breakfast">{local(['Kahvaltı fotoğrafları', 'Breakfast photos', 'Frühstücksfotos'], locale)}</Link>
        </div>
        <BreakfastPhotos locale={locale} />
      </section>

      <section className="wrap section home-spaces">
        <h2>{local(['Bahçe, teras ve manzara', 'Garden, terrace and sea views', 'Garten, Terrasse und Meerblick'], locale)}</h2>
        <div className="home-hotel-photos">
          {hotelHighlights.map(({ photo, title, text }) => <figure className="photo-figure" key={photo}>
            <Photo name={photo} alt={photoLabel(photo, locale)} className="editorial-photo" sizes="(min-width: 850px) 30vw, (min-width: 601px) 45vw, 92vw" />
            <figcaption>
              <h3>{local(title, locale)}</h3>
              <p>{local(text, locale)}</p>
            </figcaption>
          </figure>)}
        </div>
        <section id={local(['kas-aksamlari', 'evenings-in-kas', 'abende-in-kas'], locale)} className="hotel-evening">
          <figure className="photo-figure hotel-exterior">
            <Photo name="otel-dis-cephe-aksam" alt={photoLabel('otel-dis-cephe-aksam', locale)} className="editorial-photo" sizes="(min-width: 470px) 420px, 92vw" />
            <figcaption>{local(['Lale Hotel Kaş · Akşam', 'Lale Hotel Kaş · Evening', 'Lale Hotel Kaş · Am Abend'], locale)}</figcaption>
          </figure>
          <div>
            <h2>{local(['Kaş akşamları', 'Evenings in Kaş', 'Abende in Kaş'], locale)}</h2>
            <p>{local([
              'Akşam serinliğinde Hükümet Caddesi’nden limana yürüyüp Kaş’ın taş sokaklarına karışabilirsiniz. Dönüşte, begonvillerin arasından geçen bahçe yolu sizi Lale Hotel’in aydınlanan cephesine getirir.',
              'In the cool of the evening, follow Hükümet Caddesi down to the harbour and wander through the stone-paved streets of Kaş. On your way back, the garden path winds past bougainvillea to the lit-up facade of Lale Hotel.',
              'In der Abendkühle führt die Hükümet Caddesi hinunter zum Hafen und in die gepflasterten Gassen von Kaş. Auf dem Rückweg gelangen Sie durch den Garten, vorbei an Bougainvilleen, zur beleuchteten Fassade des Lale Hotels.',
            ], locale)}</p>
          </div>
        </section>
      </section>

      <section id={local(['aktiviteler', 'activities', 'aktivitaten'], locale)} className="section home-guide">
        <div className="wrap section-heading"><h2>{local(titles.guide, locale)}</h2><Link locale={locale} page="guide">{local(['Rehberi açın', 'Open the guide', 'Reiseführer öffnen'], locale)}</Link></div>
        <div className="wrap guide-preview">{posts.map(post => <PostCard key={post.id} post={post} locale={locale} />)}</div>
      </section>

      <GuestReviewsPrompt locale={locale} />

      <section id={local(['iletisim', 'contact-us', 'kontaktiere-uns'], locale)} className="wrap section location-strip">
        <div><h2>{local(['Küçükçakıl’da buluşalım', 'Find us in Küçükçakıl', 'So finden Sie uns in Küçükçakıl'], locale)}</h2><p>{hotel.address}</p></div>
        <HotelProfileLinks locale={locale} directions />
      </section>
    </>
  );
}

export function RoomsPage({ locale }) {
  return (
    <>
      <PageHeading title={local(titles.rooms, locale)} description={local(['Denize, Kaş sokaklarına ve dağlara bakan beş oda kategorisi.', 'Five room categories with views of the sea, the streets of Kaş or the mountains.', 'Fünf Zimmerkategorien mit Blick auf das Meer, die Gassen von Kaş oder die Berge.'], locale)} />
      <section className="wrap section section-topless"><div className="card-grid" data-room-grid>{rooms.map(room => <RoomCard room={room} locale={locale} key={room.id} heading="h2" />)}</div></section>
    </>
  );
}

export function RoomPage({ locale, item: room }) {
  const title = local(room.title, locale);
  return (
    <>
      <PageHeading title={title}><Link locale={locale} page="rooms" /></PageHeading>
      <section className="wrap room-detail section section-topless">
        <PhotoGallery locale={locale} label={title} photos={room.photos.map(name => ({ name }))} />
        <aside className="room-facts">
          <p>{local(room.description, locale)}</p>
          <dl>
            <div><dt>{local(['Oda alanı', 'Room size', 'Zimmergröße'], locale)}</dt><dd>{room.size} m²</dd></div>
            <div><dt>{local(['Kapasite', 'Capacity', 'Belegung'], locale)}</dt><dd>{room.maxGuests} {local(['kişiye kadar', 'guests maximum', 'Gäste maximal'], locale)}</dd></div>
            <div><dt>{local(['Özellik', 'Feature', 'Merkmal'], locale)}</dt><dd>{local(room.feature, locale)}</dd></div>
          </dl>
          <a className="button" href={pathFor(locale, 'booking') + '?room=' + room.id}>{local(titles.booking, locale)}</a>
          <p className="small muted">{local(['Güncel fiyatlar ve müsaitlik otelin rezervasyon ekranında gösterilir.', 'See live rates and availability in the hotel’s booking system.', 'Preise und Verfügbarkeit sehen Sie im Hotelbuchungssystem.'], locale)}</p>
        </aside>
      </section>
      <section className="section section-sand"><div className="wrap"><div className="section-heading"><h2>{local(['Diğer odalar', 'Other rooms', 'Weitere Zimmer'], locale)}</h2></div><div className="card-grid" data-room-grid>{rooms.filter(entry => entry !== room).slice(0, 3).map(entry => <RoomCard key={entry.id} locale={locale} room={entry} />)}</div></div></section>
    </>
  );
}

export function AboutPage({ locale }) {
  return (
    <>
      <PageHeading title={local(titles.about, locale)} />
      <section className="wrap section section-topless split-section">
        <HotelExterior locale={locale} priority />
        <div><h2>{local(['Küçükçakıl’daki adresiniz', 'Our address in Küçükçakıl', 'Unsere Adresse in Küçükçakıl'], locale)}</h2><p>{local(story, locale)}</p><Link locale={locale} page="contact" /></div>
      </section>
      <div className="wrap section section-topless">
        <HotelSpaceGallery names={hotelSpaces.entrance} locale={locale}
          heading={['Dış cephe ve giriş', 'Exterior and entrance', 'Fassade und Eingang']} />
      </div>
      <section className="wrap section section-topless split-section">
        <div>
          <h2>{local(breakfast, locale)}</h2>
          <p>{local(['Kahvaltı açık büfe servis edilir. Kahvaltının konaklama ücretine dahil olup olmadığını otelden öğrenebilirsiniz.', 'Breakfast is served as a buffet. Ask the hotel whether it is included in your room rate.', 'Das Frühstück wird als Buffet serviert. Ob es im Zimmerpreis enthalten ist, erfahren Sie beim Hotel.'], locale)}</p>
          <Link locale={locale} page="gallery" fragment="breakfast">{local(['Kahvaltı galerisini aç', 'View the breakfast gallery', 'Frühstücksgalerie ansehen'], locale)}</Link>
        </div>
        <BreakfastPhotos locale={locale} />
      </section>
      <div className="wrap section section-topless">
        <HotelSpaceGallery names={hotelSpaces.lobby} locale={locale}
          heading={['Lobi ve oturma alanı', 'Lobby and seating area', 'Lobby und Sitzbereich']} />
      </div>
      <section className="section section-sand">
        <div className="wrap split-section">
          <div>
            <h2>{local(['Bahçe ve teras', 'Garden and terrace', 'Garten und Terrasse'], locale)}</h2>
            <p>{local(['Otelin bahçe terasında begonvillerin arasında açık hava masaları ve oturma alanları bulunuyor. Balkon çekimleri ise Kaş kıyısını ve karşıdaki Meis Adası’nı gösteriyor.', 'The hotel’s garden terrace has outdoor tables and seating among the bougainvillea. Our balcony photos show the Kaş coast and the island of Meis across the water.', 'Auf der Gartenterrasse stehen Tische und Sitzplätze zwischen Bougainvilleen. Die Balkonfotos zeigen die Küste von Kaş und die gegenüberliegende Insel Meis.'], locale)}</p>
            <Link locale={locale} page="gallery" />
          </div>
          <HotelSpaceGallery names={hotelSpaces.garden} locale={locale}
            heading={['Bahçeden kareler', 'Garden photos', 'Fotos vom Garten']} />
        </div>
      </section>
    </>
  );
}

export function GalleryPage({ locale }) {
  const photosFor = group => hotelPhotography.filter(photo => photo.group === group).map(photo => ({
    name: photo.name, label: local(photo.label, locale),
  }));
  const roomPhotos = rooms.flatMap(room => room.photos.map(name => ({ name, label: local(room.title, locale) })));
  const breakfastPhotos = photosFor('breakfast');
  const terrace = breakfastPhotos.findIndex(photo => photo.name === 'kahvalti-bahce-servisi');
  const [gardenBreakfast] = breakfastPhotos.splice(terrace, 1);
  breakfastPhotos.splice(1, 0, gardenBreakfast);
  const groups = [
    { key: 'view', heading: ['Kaş kıyısı ve Meis manzarası', 'The Kaş coast and views of Meis', 'Die Küste von Kaş und der Blick auf Meis'], photos: photosFor('view') },
    { key: 'hotel', heading: ['Dış cephe, bahçe ve lobi', 'Exterior, garden and lobby', 'Fassade, Garten und Lobby'], photos: photosFor('hotel') },
    { key: 'breakfast', heading: breakfast, photos: breakfastPhotos },
    { key: 'rooms', heading: titles.rooms, photos: roomPhotos },
  ];
  return <>
    <PageHeading title={local(titles.gallery, locale)} description={local(['Kaş kıyısının drone kareleri, Lale Hotel’in bahçesi, açık büfe kahvaltısı ve odaları.', 'Aerial views of the Kaş coast, plus photos of Lale Hotel’s garden, breakfast buffet and rooms.', 'Luftaufnahmen der Küste von Kaş sowie Fotos vom Garten, Frühstücksbuffet und den Zimmern des Lale Hotels.'], locale)} />
    <div className="wrap section section-topless gallery-sections">
      {groups.map(group => <section className="gallery-section" id={group.key} data-gallery={group.key} key={group.key}>
        <h2>{local(group.heading, locale)}</h2>
        <PhotoGallery grid featured={group.key === 'breakfast'} locale={locale} label={local(group.heading, locale)} photos={group.photos} />
      </section>)}
    </div>
  </>;
}

function PostCard({ locale, post }) {
  return <article className="journal-card"><a className="card-photo" href={pathFor(locale, 'post', post)} aria-label={local(post.title, locale)}><Photo name={post.image} alt="" sizes="(min-width: 700px) 45vw, 94vw" /></a><p className="eyebrow">{local(post.category, locale)}</p><h2><Link locale={locale} page="post" item={post} className="title-link">{local(post.title, locale)}</Link></h2><p>{local(post.intro, locale)}</p></article>;
}

export function GuidePage({ locale }) {
  return <><PageHeading title={local(titles.guide, locale)} description={local(['Kıyıda kısa bir yürüyüşten Likya Yolu’na, Kaş’ta gezilecek yerler.', 'From a stroll along the waterfront to a stage of the Lycian Way.', 'Vom Spaziergang am Wasser bis zur Etappe auf dem Lykischen Weg.'], locale)} /><section className="wrap section section-topless activity-list">{activities.map(activity => {
    const post = posts.find(entry => entry.id === activity.post);
    const label = local(post?.title ?? activity.title, locale);
    return <article className="activity" key={activity.post ?? activity.image}><Photo name={post?.image ?? activity.image} alt={label} sizes="(min-width: 700px) 30vw, 90vw" /><div><h2>{label}</h2><p>{local(post?.intro ?? activity.description, locale)}</p>{post && <Link locale={locale} page="post" item={post}>{local(['Rehberi okuyun', 'Read the guide', 'Reiseführer lesen'], locale)}</Link>}</div></article>;
  })}<Link locale={locale} page="blog" /></section></>;
}

export function BlogPage({ locale }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const visible = posts.filter(post => (!category || post.category[0] === category) && [local(post.title, locale), local(post.intro, locale), local(post.category, locale)].join(' ').toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)));
  return <><PageHeading title={local(titles.blog, locale)} /><section className="wrap section section-topless"><div className="journal-toolbar">
    <label className="journal-search"><Search size={18} aria-hidden="true" /><span className="sr-only">{local(['Yazı ara', 'Search articles', 'Beiträge suchen'], locale)}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={local(['Yazı ara', 'Search articles', 'Beiträge suchen'], locale)} /></label>
    <button type="button" className="choice" aria-pressed={!category} onClick={() => setCategory(null)}>{local(['Tümü', 'All', 'Alle'], locale)}</button>
    {posts.map(post => <button type="button" className="choice" aria-pressed={category === post.category[0]} onClick={() => setCategory(post.category[0])} key={post.id}>{local(post.category, locale)}</button>)}
  </div><div className="journal-grid">{visible.map(post => <PostCard post={post} locale={locale} key={post.id} />)}</div>{!visible.length && <p role="status">{local(['Sonuç bulunamadı.', 'No articles found.', 'Keine Beiträge gefunden.'], locale)}</p>}</section></>;
}

export function PostPage({ locale, item }) {
  return <article><PageHeading title={local(item.title, locale)} description={local(item.intro, locale)}><Link locale={locale} page="blog" /></PageHeading><div className="wrap"><Photo name={item.image} alt={local(item.title, locale)} priority className="article-photo" /></div><div className="prose section">{item.body.map((paragraph, index) => <p key={index}>{local(paragraph, locale)}</p>)}<Link locale={locale} page="guide" /></div></article>;
}

export function ContactPage({ locale }) {
  const [sent, setSent] = useState(false);
  function sendMail(event) {
    event.preventDefault();
    track('contact_submit', { contact_method: 'form' });
    setSent(true);
  }
  return <><PageHeading title={local(titles.contact, locale)} /><section className="wrap section section-topless contact-grid">
    <div className="contact-facts">
      <h2>{hotel.name}</h2>
      <p><MapPin aria-hidden="true" size={18} /> {hotel.address}</p>
      <p><Phone aria-hidden="true" size={18} /> <a href={'tel:' + hotel.tel}>{hotel.phone}</a></p>
      <p><Mail aria-hidden="true" size={18} /> <a href={'mailto:' + hotel.email}>{hotel.email}</a></p>
      <HotelProfileLinks locale={locale} directions />
    </div>
    <form className="surface-form" onSubmit={sendMail} onChange={() => sent && setSent(false)}>
      <h2>{local(['Bize Yazın', 'Send us a message', 'Schreiben Sie uns'], locale)}</h2>
      <label>{local(['Ad soyad', 'Full name', 'Vollständiger Name'], locale)}<input name="name" autoComplete="name" required maxLength="100" /></label>
      <label>{local(['E-posta', 'Email', 'E-Mail'], locale)}<input name="email" type="email" autoComplete="email" required maxLength="150" /></label>
      <label>{local(['Mesaj', 'Message', 'Nachricht'], locale)}<textarea name="message" rows="5" required maxLength="1500" /></label>
      <button className="button" type="submit">{local(['Mesaj Gönder', 'Send Message', 'Nachricht senden'], locale)}</button>
      {sent && <p className="small" role="status">{local(['Mesajınız alındı. En kısa sürede dönüş yapılacaktır; acil durumlar için WhatsApp veya telefon üzerinden doğrudan ulaşabilirsiniz.', 'Your message has been received. We will reply shortly; for urgent inquiries, reach us directly by phone or WhatsApp.', 'Ihre Nachricht wurde empfangen. Wir melden uns in Kürze; in dringenden Fällen erreichen Sie uns direkt telefonisch oder per WhatsApp.'], locale)}</p>}
    </form>
  </section><HotelMap locale={locale} /><GuestReviewsPrompt locale={locale} /></>;
}

const policies = {
  privacy: ['Rezervasyon için seçtiğiniz tarihler ve misafir bilgileri otelin resmi rezervasyon sistemine aktarılır. İletişim formu mesajınızı otelin resmi e-posta adresine iletmek üzere hazırlanır.', 'Your selected dates and guest details are passed to the hotel’s official booking system. The contact form prepares your message for the hotel’s official email address.', 'Gewählte Reisedaten und Gästeangaben werden an das offizielle Buchungssystem des Hotels übergeben. Das Kontaktformular leitet Ihre Nachricht an die offizielle E-Mail-Adresse des Hotels weiter.'],
  cookies: ['Seçtiğiniz tarihler, oda ve misafir sayıları bu sekmenin oturum depolamasında tutulur.', 'Selected dates, room and guest counts are retained in this tab’s session storage.', 'Gewählte Reisedaten, Zimmer und Gästezahlen werden im Sitzungsspeicher dieses Tabs gehalten.'],
  kvkk: ['Otelin kişisel veri süreçleri ve başvuru kanalları hakkında bilgi almak için aşağıdaki adrese yazabilirsiniz.', 'For details about the hotel’s handling of personal data and how to exercise your rights, use the email address below.', 'Fragen zur Datenverarbeitung des Hotels und zu Ihren Rechten können Sie per E-Mail stellen.'],
  cancellation: ['İptal, ön ödeme ve iade koşulları seçtiğiniz fiyat planına göre otelin rezervasyon ekranında gösterilir. Sorularınız için otelle iletişime geçebilirsiniz.', 'Cancellation, prepayment and refund terms for your selected rate are shown in the hotel’s booking system. Contact the hotel with any questions.', 'Storno-, Vorauszahlungs- und Erstattungsbedingungen für Ihren Tarif finden Sie im Buchungssystem des Hotels. Bei Fragen wenden Sie sich an das Hotel.'],
};

export function PolicyPage({ locale, page }) {
  return <><PageHeading title={local(titles[page], locale)} /><div className="prose section section-topless"><p>{local(page === 'cookies' && analyticsId ? [
    'Rezervasyon seçimleri bu sekmede tutulur. Site kullanımını ölçen isteğe bağlı analiz çerezlerini aşağıdaki tercihlerden açıp kapatabilirsiniz.',
    'Booking selections are kept in this tab. You can enable or disable optional analytics cookies in the preferences below.',
    'Buchungsauswahlen bleiben in diesem Tab gespeichert. Optionale Analyse-Cookies können Sie unten aktivieren oder deaktivieren.',
  ] : policies[page], locale)}</p><a className="text-link" href={'mailto:' + hotel.email}>{hotel.email}</a></div></>;
}
