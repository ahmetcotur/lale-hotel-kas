import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Navigation, Star, X } from 'lucide-react';
import { hotel, local, locales } from '../data/hotel.js';
import sizes from '../data/photoSizes.json';
import responsivePhotos from '../data/responsivePhotos.json';
import googleReviews from '../data/googleReviews.json';
import { assetUrl, pathFor, titles } from '../lib/routes.js';

export function Photo({ name, alt, priority = false, sizes: displaySizes = '100vw', className }) {
  const [format, setFormat] = useState('webp');
  const image = useRef(null);
  function recover(failedImage) {
    setFormat(format === 'webp' && !failedImage.currentSrc.endsWith('.jpg') ? 'jpeg' : 'unavailable');
  }
  useEffect(() => {
    if (image.current?.complete && !image.current.naturalWidth) recover(image.current);
  }, [format]);
  const [width, height] = sizes[name];
  const base = assetUrl('/assets/photos/' + name);
  const source = responsivePhotos.includes(name)
    ? base + '-720.webp 720w, ' + base + '.webp ' + width + 'w'
    : base + '.webp';
  if (format === 'unavailable') {
    return <span className={className ? className + ' photo-fallback' : 'photo-fallback'} style={{ aspectRatio: width + ' / ' + height }}
      role={alt ? 'img' : undefined} aria-label={alt || undefined}>{alt}</span>;
  }
  return (
    <picture className={className}>
      {format === 'webp' && <source type="image/webp" srcSet={source} sizes={displaySizes} />}
      <img key={format} ref={image} src={assetUrl('/assets/hotel/' + name + '.jpg')} alt={alt} width={width} height={height}
        loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? undefined : 'async'} onError={event => recover(event.currentTarget)} />
    </picture>
  );
}

export function PageHeading({ title, description, children }) {
  return <header className="page-intro wrap">{children}<h1>{title}</h1>{description && <p>{description}</p>}</header>;
}

export function SiteHeader({ locale, page, item }) {
  const drawer = useRef(null);
  const toggle = useRef(null);
  const language = useRef(null);
  const nav = ['rooms', 'about', 'gallery', 'guide', 'contact'];
  const home = pathFor(locale, 'home');
  const booking = pathFor(locale, 'booking');
  const languageLabel = local(['Dil', 'Language', 'Sprache'], locale);
  const menuLabel = local(['Menü', 'Menu', 'Menü'], locale);
  useEffect(() => {
    const closeOnOutside = event => {
      if (!language.current?.contains(event.target)) language.current?.removeAttribute('open');
    };
    document.addEventListener('pointerdown', closeOnOutside);
    return () => document.removeEventListener('pointerdown', closeOnOutside);
  }, []);
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="brand" href={home}><img src={assetUrl(hotel.logo)} width="200" height="45" alt={hotel.name} /></a>
        <nav className="desktop-nav" aria-label={menuLabel}>
          {nav.map(key => <a key={key} href={pathFor(locale, key)} aria-current={page === key || (key === 'rooms' && page === 'room') ? 'page' : undefined}>{local(titles[key], locale)}</a>)}
        </nav>
        <div className="header-actions">
          <details ref={language} className="language-picker" onKeyDown={event => {
            if (event.key === 'Escape') {
              language.current.removeAttribute('open');
              language.current.querySelector('summary').focus();
            }
          }}>
            <summary aria-label={languageLabel + ' · ' + locale.toUpperCase()}>{locale.toUpperCase()} <ChevronDown size={15} aria-hidden="true" /></summary>
            <div className="language-options">
              {locales.map((code, index) => <a key={code} href={pathFor(code, page === 'missing' ? 'home' : page, item)} lang={code} hrefLang={code} aria-current={code === locale ? 'true' : undefined}>{['Türkçe', 'English', 'Deutsch'][index]}</a>)}
            </div>
          </details>
          <a href={booking} className="button header-book">{local(titles.booking, locale)}</a>
          <button ref={toggle} type="button" className="icon-button mobile-menu" aria-label={menuLabel} aria-haspopup="dialog" onClick={() => drawer.current.showModal()}><Menu aria-hidden="true" /></button>
        </div>
      </div>
      <dialog ref={drawer} className="mobile-drawer" aria-label={menuLabel} onClose={() => toggle.current.focus()} onClick={event => {
        if (event.target === drawer.current) drawer.current.close();
      }}>
        <div className="drawer-inner">
          <div className="drawer-top"><img src={assetUrl(hotel.logo)} width="200" height="45" alt={hotel.name} /><button type="button" className="icon-button" aria-label={local(['Kapat', 'Close', 'Schließen'], locale)} onClick={() => drawer.current.close()}><X aria-hidden="true" /></button></div>
          <nav>{['home', ...nav, 'blog', 'booking'].map(key => <a href={pathFor(locale, key)} key={key}>{local(titles[key], locale)}</a>)}</nav>
        </div>
      </dialog>
    </header>
  );
}

export function HotelProfileLinks({ locale, directions = false }) {
  const links = [
    [hotel.instagram, 'Instagram', 'instagram'],
    [hotel.whatsapp, 'WhatsApp', 'whatsapp'],
    [hotel.googleProfile, local(['Google profili', 'Google profile', 'Google-Profil'], locale), 'google'],
    [hotel.tripadvisor, 'Tripadvisor', 'tripadvisor'],
  ];
  return <div className="hotel-profile-links">
    {links.map(([href, label, icon]) => <a className="hotel-social-icon" href={href} key={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      <img src={assetUrl('/assets/brand/social/' + icon + '.svg')} alt="" width="22" height="22" />
    </a>)}
    {directions && <a className="text-link" href={hotel.directions} target="_blank" rel="noreferrer">
      <Navigation size={16} strokeWidth={1.7} aria-hidden="true" />{local(['Yol tarifi', 'Directions', 'Anfahrt'], locale)}
    </a>}
  </div>;
}

export function HotelMap({ locale }) {
  const [enabled, setEnabled] = useState(false);
  const title = local(['Lale Hotel Kaş konumu', 'Lale Hotel Kaş location', 'Standort von Lale Hotel Kaş'], locale);
  return <section className="wrap section section-topless hotel-map-section">
    <h2>{local(['Konum ve yol tarifi', 'Location and directions', 'Lage und Anfahrt'], locale)}</h2>
    <p>{hotel.address}</p>
    <div className="hotel-map">
      {enabled
        ? <iframe src={hotel.googleMapEmbed} title={title} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        : <div className="hotel-map-prompt">
          <Navigation size={28} aria-hidden="true" />
          <button className="button" type="button" onClick={() => setEnabled(true)}>{local(['Google Haritalar’ı yükle', 'Load Google Maps', 'Google Maps laden'], locale)}</button>
        </div>}
    </div>
    <a className="text-link" href={hotel.directions} target="_blank" rel="noreferrer">{local(['Yol tarifi al', 'Get directions', 'Route planen'], locale)}</a>
  </section>;
}

export function SiteFooter({ locale, page }) {
  const [showBooking, setShowBooking] = useState(page !== 'home');
  useEffect(() => {
    if (page !== 'home' || !('IntersectionObserver' in window)) return;
    const search = document.querySelector('.home-search');
    const observer = new IntersectionObserver(([entry]) => {
      setShowBooking(entry.boundingClientRect.bottom < (entry.rootBounds?.top ?? 0));
    }, { rootMargin: '-64px 0px 0px' });
    if (search) observer.observe(search);
    return () => observer.disconnect();
  }, [page]);
  return (
    <>
      {page !== 'booking' && showBooking && <div className="mobile-booking"><a href={pathFor(locale, 'booking')} className="button">{local(titles.booking, locale)}</a></div>}
      <footer className="site-footer" id="site-footer">
        <div className="wrap footer-grid">
          <div><a href={pathFor(locale, 'home')}><img src={assetUrl(hotel.logo)} width="200" height="45" alt={hotel.name} /></a><p>{hotel.address}</p><a href={'tel:' + hotel.tel}>{hotel.phone}</a><br /><a href={'mailto:' + hotel.email}>{hotel.email}</a></div>
          <nav aria-label={local(['Otel', 'Hotel', 'Hotel'], locale)}>{['rooms', 'about', 'gallery', 'guide', 'blog', 'contact'].map(key => <a href={pathFor(locale, key)} key={key}>{local(titles[key], locale)}</a>)}</nav>
          <nav aria-label={local(['Politikalar', 'Policies', 'Hinweise'], locale)}>{['privacy', 'cookies', 'kvkk', 'cancellation'].map(key => <a href={pathFor(locale, key)} key={key}>{local(titles[key], locale)}</a>)}</nav>
        </div>
        <div className="wrap footer-bottom"><span>© Lale Hotel Kaş</span><HotelProfileLinks locale={locale} /></div>
      </footer>
    </>
  );
}

export function PhotoGallery({ photos, locale, label, grid = false, featured = false }) {
  const [active, setActive] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const move = amount => setActive(index => (index + amount + photos.length) % photos.length);
  const photoLabel = index => photos[index].label ?? label;
  const open = (event, index) => {
    trigger.current = event.currentTarget;
    setActive(index);
    setOpenLightbox(true);
    dialog.current.showModal();
  };
  const prev = local(['Önceki fotoğraf', 'Previous photo', 'Vorheriges Foto'], locale);
  const next = local(['Sonraki fotoğraf', 'Next photo', 'Nächstes Foto'], locale);
  const close = local(['Kapat', 'Close', 'Schließen'], locale);
  return (
    <div className="photo-gallery">
      <div className={grid ? 'photo-grid' : 'photo-main'}>
        {(grid ? photos : [photos[active]]).map((photo, index) => (
          <button type="button" key={photo.name} onClick={event => open(event, grid ? index : active)} className="photo-open" aria-label={photoLabel(grid ? index : active) + ' · ' + local(['Fotoğrafı büyüt', 'Enlarge photo', 'Foto vergrößern'], locale)}>
            <Photo name={photo.name} alt={photoLabel(grid ? index : active)} priority={!grid} sizes={featured
              ? (index < 2 ? '(min-width: 900px) 45vw, 92vw' : '(min-width: 900px) 23vw, 45vw')
              : grid ? '(min-width: 900px) 34vw, 45vw' : '(min-width: 900px) 65vw, 95vw'} />
          </button>
        ))}
      </div>
      {!grid && photos.length > 1 && <div className="photo-thumbs">
        {photos.map((photo, index) => <button key={photo.name} type="button" aria-pressed={active === index} aria-label={local(['Fotoğraf', 'Photo', 'Foto'], locale) + ' ' + (index + 1)} onClick={() => setActive(index)}><Photo name={photo.name} alt="" sizes="96px" /></button>)}
      </div>}
      <dialog ref={dialog} className="lightbox" aria-label={label} onClose={() => { setOpenLightbox(false); trigger.current?.focus(); }} onClick={event => {
        if (event.target === dialog.current) dialog.current.close();
      }} onKeyDown={event => {
        if (photos.length < 2) return;
        if (event.key === 'ArrowLeft') move(-1);
        if (event.key === 'ArrowRight') move(1);
      }}>
        <div className="lightbox-inner">
          <button type="button" className="icon-button lightbox-close" aria-label={close} onClick={() => dialog.current.close()}><X aria-hidden="true" /></button>
          {openLightbox && <Photo key={photos[active].name} name={photos[active].name} alt={photoLabel(active)} priority />}
          <div className="lightbox-controls">
            {photos.length > 1 && <button type="button" className="icon-button" aria-label={prev} onClick={() => move(-1)}><ChevronLeft aria-hidden="true" /></button>}
            <span aria-live="polite">{photoLabel(active)} · {active + 1}/{photos.length}</span>
            {photos.length > 1 && <button type="button" className="icon-button" aria-label={next} onClick={() => move(1)}><ChevronRight aria-hidden="true" /></button>}
          </div>
        </div>
      </dialog>
    </div>
  );
}

export function GuestReviewsPrompt({ locale }) {
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState('');
  const [guestName, setGuestName] = useState('');
  const railRef = useRef(null);

  const fiveStarReviews = (googleReviews.reviews ?? [])
    .filter(entry => entry && entry.rating === 5 && entry.text?.trim())
    .slice(0, 10);

  function scrollRail(direction) {
    const rail = railRef.current;
    if (!rail) return;
    const step = Math.max(280, Math.round(rail.clientWidth * 0.72));
    rail.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  function handlePrivateFeedback(event) {
    event.preventDefault();
    if (!note.trim()) return;
    setSent(true);
    setNote('');
    setGuestName('');
  }

  return (
    <section className="wrap section reviews-section">
      <div className="reviews-invite">
        <div>
          <span className="eyebrow">{local(['Misafir Notları', 'Guest Notes', 'Gästestimmen'], locale)}</span>
          <h2>{local(['Deneyiminizi paylaşır mısınız?', 'Would you share your stay?', 'Möchten Sie Ihre Eindrücke teilen?'], locale)}</h2>
          <p>{local([
            'Lale Hotel’de geçirdiğiniz günler başka gezginlere de yol göstersin. Dilerseniz Google ya da Tripadvisor üzerinden birkaç satır bırakabilirsiniz.',
            'Help fellow travellers discover Küçükçakıl. If you enjoyed your mornings with us, a few lines on Google or Tripadvisor mean the world to our family.',
            'Helfen Sie anderen Reisenden, Küçükçakıl zu entdecken. Wenn Ihnen Ihr Aufenthalt gefallen hat, freuen wir uns über ein paar Zeilen auf Google oder Tripadvisor.',
          ], locale)}</p>
        </div>
        <div className="reviews-actions">
          <a className="review-platform-btn" href={hotel.googleProfile} target="_blank" rel="noreferrer">
            <img src={assetUrl('/assets/brand/social/google.svg')} alt="" width="22" height="22" />
            <span>
              <strong>{local(['Google’da Yorum Bırak', 'Review on Google', 'Auf Google bewerten'], locale)}</strong>
              <small><Star size={12} aria-hidden="true" /> {local(['Google Haritalar profilimiz', 'Our Google Maps profile', 'Unser Google-Maps-Profil'], locale)}</small>
            </span>
          </a>
          <a className="review-platform-btn" href={hotel.tripadvisor} target="_blank" rel="noreferrer">
            <img src={assetUrl('/assets/brand/social/tripadvisor.svg')} alt="" width="22" height="22" />
            <span>
              <strong>{local(['Tripadvisor’da Değerlendir', 'Review on Tripadvisor', 'Auf Tripadvisor bewerten'], locale)}</strong>
              <small><Star size={12} aria-hidden="true" /> {local(['Tripadvisor misafir sayfası', 'Tripadvisor guest page', 'Tripadvisor-Gästeseite'], locale)}</small>
            </span>
          </a>
        </div>
      </div>

      {fiveStarReviews.length > 0 && (
        <div className="google-reviews-wrap">
          <div className="google-reviews-head">
            <div className="google-reviews-meta-bar">
              <img src={assetUrl('/assets/brand/social/google.svg')} alt="Google" width="22" height="22" />
              <div>
                <div className="google-reviews-title-row">
                  <h3>{local(['Son 5 Yıldızlı Google Yorumları', 'Latest 5-Star Google Reviews', 'Neueste 5-Sterne-Google-Bewertungen'], locale)}</h3>
                  {typeof googleReviews.rating === 'number' && typeof googleReviews.reviewCount === 'number' && (
                    <span className="google-rating-pill">
                      <Star size={13} fill="currentColor" aria-hidden="true" />
                      {googleReviews.rating.toFixed(1)} / 5 · {googleReviews.reviewCount}{' '}
                      {local(['Google yorumu', 'Google reviews', 'Google-Bewertungen'], locale)}
                    </span>
                  )}
                </div>
                <p className="small muted">{local([
                  'Google Haritalar üzerindeki en güncel 10 beş yıldızlı misafir yorumu.',
                  'The 10 most recent five-star guest reviews from Google Maps.',
                  'Die 10 aktuellsten 5-Sterne-Gästebewertungen von Google Maps.',
                ], locale)}</p>
              </div>
            </div>
            <div className="google-reviews-controls">
              <button
                type="button"
                className="icon-button"
                aria-label={local(['Önceki yorum', 'Previous review', 'Vorherige Bewertung'], locale)}
                onClick={() => scrollRail(-1)}
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-button"
                aria-label={local(['Sonraki yorum', 'Next review', 'Nächste Bewertung'], locale)}
                onClick={() => scrollRail(1)}
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div ref={railRef} className="google-reviews-rail" role="list">
            {fiveStarReviews.map(entry => (
              <article key={entry.id} className="google-review-card" role="listitem">
                <div className="google-review-stars" role="img" aria-label={local(['5 üzerinden 5 yıldız', '5 out of 5 stars', '5 von 5 Sternen'], locale)}>
                  {[0, 1, 2, 3, 4].map(idx => (
                    <Star key={idx} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="google-review-text">{entry.text}</p>
                <footer className="google-review-meta">
                  <div>
                    <strong>{entry.author}</strong>
                    {(entry.relativeTime || entry.date) && (
                      <small>{entry.relativeTime || entry.date}</small>
                    )}
                  </div>
                  <a
                    className="text-link small"
                    href={entry.url || googleReviews.profileUrl || hotel.googleProfile}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Google
                  </a>
                </footer>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="between-us">
        <div className="between-us-copy">
          <h3><Heart size={20} aria-hidden="true" /> {local(['Aramızda kalsın…', 'Just between us…', 'Unter uns gesagt…'], locale)}</h3>
          <p>{local([
            'Eğer konaklamanızda gözümüzden kaçan küçük bir detay, eksik hissettiğiniz bir dokunuş ya da “şöyle olsa daha güzel olurdu” dediğiniz bir şey olduysa; herkesin gördüğü yorumlardan önce doğrudan bize fısıldamanızı çok isteriz. Her notu ailece okuyor, bir sonraki sabahı daha iyi hazırlamak için saklıyoruz.',
            'If there was a small detail we missed during your stay, or something you felt could be warmer or better, we would truly love to hear it privately before anywhere else. We read every note as a family and keep it close for tomorrow’s morning.',
            'Wenn uns während Ihres Aufenthalts ein kleines Detail entgangen ist oder Sie sich etwas noch herzlicher gewünscht hätten, flüstern Sie es uns gern ganz direkt zu. Wir lesen jede Nachricht als Familie und nehmen sie uns für den nächsten Morgen zu Herzen.',
          ], locale)}</p>
        </div>

        <form className="between-us-form" onSubmit={handlePrivateFeedback}>
          <label>
            <span className="sr-only">{local(['İsminiz (isteğe bağlı)', 'Your name (optional)', 'Ihr Name (optional)'], locale)}</span>
            <input
              type="text"
              value={guestName}
              onChange={e => { setGuestName(e.target.value); if (sent) setSent(false); }}
              placeholder={local(['İsminiz (isteğe bağlı)', 'Your name (optional)', 'Ihr Name (optional)'], locale)}
              maxLength="80"
            />
          </label>
          <label>
            <span className="sr-only">{local(['Bize iletmek istediğiniz not', 'Your private note to us', 'Ihre persönliche Nachricht an uns'], locale)}</span>
            <textarea
              rows="3"
              required
              value={note}
              onChange={e => { setNote(e.target.value); if (sent) setSent(false); }}
              placeholder={local(['Küçük bir not, bir öneri veya bir tebessüm…', 'A quiet note, a suggestion, or a kind thought…', 'Eine kleine Notiz, ein Wunsch oder ein Gedanke…'], locale)}
              maxLength="1000"
            />
          </label>
          <div className="between-us-submit">
            <button type="submit" className="button button-outline">
              {local(['Sessizce Bize İlet', 'Send Privately', 'Vertraulich senden'], locale)}
            </button>
            {sent && (
              <p className="small" role="status">
                {local(['Teşekkür ederiz, notunuz doğrudan ailemize ulaştı.', 'Thank you — your note has reached our family directly.', 'Vielen Dank — Ihre Nachricht ist direkt bei unserer Familie angekommen.'], locale)}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
