import React, { useEffect, useRef, useState } from 'react';
import { Check, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import { hotel, local, rooms } from '../data/hotel.js';
import { allowedRange, formatDay, nightsBetween, roomOptionsFor, roomSlotsFor } from '../lib/booking.js';
import { track } from '../lib/analytics.js';
import { pathFor, titles } from '../lib/routes.js';
import { BookingSearch, bookingLabels, guestCountText, nightCountText } from '../components/BookingSearch.jsx';
import { PageHeading, Photo } from '../components/HotelUI.jsx';

const steps = [
  ['Tarih ve misafir', 'Dates and guests', 'Reisedaten und Gäste'],
  ['Oda seçimi', 'Choose a room', 'Zimmerauswahl'],
  ['Misafir ve ödeme', 'Guest & payment', 'Gast & Zahlung'],
];

const formatTry = (amount, locale) =>
  new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : locale === 'de' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);

export function BookingPage({ locale, stay, setStay, searchOnArrival }) {
  const t = value => local(value, locale);
  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [guest, setGuest] = useState({ name: '', email: '', phone: '', note: '', cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '', accepted: false });
  const [formError, setFormError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  const heading = useRef(null);
  const firstRender = useRef(true);
  const autoSearched = useRef(false);
  const selectedRooms = roomSlotsFor(stay).map((_, index) => rooms.find(entry => entry.id === stay.roomIds[index]));
  const canContinue = slots.length > 0 && slots.every(({ rooms: eligible }, index) => eligible.some(room => room.id === stay.roomIds[index]));
  const roomLabel = ['Oda', 'Room', 'Zimmer'];
  const nights = nightsBetween(stay.checkin, stay.checkout);

  const subtotal = selectedRooms.reduce((sum, room) => sum + (room ? room.basePrice * Math.max(1, nights) : 0), 0);
  const discount = Math.round(subtotal * 0.15);
  const total = subtotal - discount;

  useEffect(() => {
    if (firstRender.current && step === 0) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start' });
  }, [step, confirmed]);

  function search() {
    if (!allowedRange(stay.checkin, stay.checkout)) return;
    const next = roomOptionsFor(stay);
    setSlots(next);
    setConfirmed(null);
    track('search', { search_term: 'room_catalog' });
    setStay({
      ...stay,
      roomIds: next.map(({ rooms: eligible }, index) => {
        const selected = stay.roomIds[index];
        return eligible.some(entry => entry.id === selected) ? selected : '';
      }),
    });
    setStep(1);
  }

  useEffect(() => {
    if (!searchOnArrival || autoSearched.current || !allowedRange(stay.checkin, stay.checkout)) return;
    autoSearched.current = true;
    search();
  }, [searchOnArrival, stay]);

  function completeBooking(event) {
    event.preventDefault();
    setFormError('');
    if (!guest.name.trim() || !guest.email.trim() || !guest.phone.trim()) {
      setFormError(t(['Lütfen ad soyad, e-posta ve telefon alanlarını doldurun.', 'Please enter your full name, email, and phone number.', 'Bitte geben Sie Ihren Namen, Ihre E-Mail-Adresse und Telefonnummer an.']));
      return;
    }
    if (paymentMethod === 'card') {
      const digits = guest.cardNumber.replace(/\s+/g, '');
      if (!guest.cardName.trim() || digits.length < 12 || !guest.cardExpiry.trim() || guest.cardCvc.trim().length < 3) {
        setFormError(t(['Lütfen geçerli kart bilgilerinizi girin.', 'Please enter valid card details.', 'Bitte geben Sie gültige Kartendaten ein.']));
        return;
      }
    }
    if (!guest.accepted) {
      setFormError(t(['Devam etmek için KVKK ve iptal koşullarını onaylayın.', 'Please accept the privacy and cancellation terms to continue.', 'Bitte akzeptieren Sie die Datenschutz- und Stornierungsbedingungen.']));
      return;
    }

    const code = 'LALE-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
    track('purchase', {
      transaction_id: code,
      currency: 'TRY',
      value: total,
      items: selectedRooms.filter(Boolean).map(room => ({ item_id: room.id, item_name: t(room.title), price: room.basePrice })),
    });
    setConfirmed({
      code,
      guestName: guest.name.trim(),
      guestEmail: guest.email.trim(),
      paymentMethod,
      total,
      checkin: stay.checkin,
      checkout: stay.checkout,
      nights,
      rooms: selectedRooms.filter(Boolean).map(room => t(room.title)),
    });
  }

  return (
    <>
      <PageHeading title={t(titles.booking)} />
      <div className="wrap booking-page">
        <ol className="booking-steps" aria-label={t(['Rezervasyon adımları', 'Booking steps', 'Buchungsschritte'])}>
          {steps.map((entry, index) => (
            <li key={entry[0]} aria-current={!confirmed && step === index ? 'step' : undefined} className={confirmed || index < step ? 'step-done' : undefined}>
              <span>{confirmed || index < step ? <Check size={15} aria-hidden="true" /> : index + 1}</span>
              {t(entry)}
            </li>
          ))}
        </ol>

        <div className="booking-layout">
          <section className="booking-stage">
            {confirmed ? (
              <div className="booking-confirmed" role="status">
                <h2 ref={heading} tabIndex="-1">{t(['Rezervasyonunuz Onaylandı', 'Reservation Confirmed', 'Buchung bestätigt'])}</h2>
                <p>{t(['Doğrudan rezervasyonunuz oluşturuldu. Rezervasyon özetiniz aşağıdadır:', 'Your direct reservation has been created. Summary:', 'Ihre Direktbuchung wurde erstellt. Zusammenfassung:'])}</p>
                <p><strong>{t(['Rezervasyon Kodu', 'Booking Code', 'Buchungscode'])}:</strong> {confirmed.code}</p>
                <p><strong>{t(['Misafir', 'Guest', 'Gast'])}:</strong> {confirmed.guestName} ({confirmed.guestEmail})</p>
                <p><strong>{t(['Tarihler', 'Dates', 'Daten'])}:</strong> {formatDay(confirmed.checkin, locale)} – {formatDay(confirmed.checkout, locale)} ({nightCountText(confirmed.nights, locale)})</p>
                <p><strong>{t(['Seçilen Odalar', 'Rooms', 'Zimmer'])}:</strong> {confirmed.rooms.join(', ')}</p>
                <p><strong>{t(['Toplam Tutar (%15 Doğrudan İndirimli)', 'Total Amount (15% Direct Discount)', 'Gesamtbetrag (15% Direktrabatt)'])}:</strong> {formatTry(confirmed.total, locale)}</p>
                <p className="small muted">{t(['Sorularınız için:', 'For questions:', 'Bei Fragen:'])} {hotel.phone} · {hotel.email}</p>
                <div>
                  <button type="button" className="button" onClick={() => { setConfirmed(null); setStep(0); }}>
                    {t(['Yeni rezervasyon yap', 'Make another booking', 'Neue Buchung vornehmen'])}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 ref={heading} tabIndex="-1">
                  {step === 1 && slots.length === 2 ? t(['İki oda seçin', 'Choose two rooms', 'Zwei Zimmer auswählen']) : t(steps[step])}
                </h2>

                {step === 0 && <BookingSearch value={stay} onChange={setStay} onSearch={search} locale={locale} />}

                {step === 1 && (
                  <>
                    <p>{t(['Doğrudan site içi rezervasyona özel %15 indirim tüm oda fiyatlarına uygulanır.', 'A 15% direct-booking discount applies to all room rates on our website.', '15 % Direktrabatt gelten für alle Zimmerpreise bei Buchung über unsere Website.'])}</p>
                    <div className="room-results">
                      {slots.map(({ guests, rooms: eligible }, index) => (
                        <fieldset className="room-choices" key={index}>
                          <legend>{slots.length > 1 ? (index + 1) + '. ' + t(roomLabel) : t(roomLabel)} <span>· {guests} {t(['misafir', 'guests', 'Gäste'])}</span></legend>
                          {eligible.map(entry => (
                            <label className="room-choice" key={entry.id}>
                              <input
                                type="radio"
                                name={'room-' + index}
                                value={entry.id}
                                checked={entry.id === stay.roomIds[index]}
                                onChange={() => {
                                  setStay({ ...stay, roomIds: slots.map((_, position) => (index === position ? entry.id : stay.roomIds[position] ?? '')) });
                                }}
                              />
                              <Photo name={entry.photos[0]} alt="" sizes="112px" />
                              <span>
                                <strong>{t(entry.title)}</strong>
                                <small>{entry.size} m² · {entry.maxGuests} {t(['kişiye kadar', 'guests maximum', 'Gäste maximal'])}</small>
                              </span>
                              <span className="room-choice-price">
                                {formatTry(entry.basePrice, locale)}
                                <small>/ {t(['gece', 'night', 'Nacht'])}</small>
                              </span>
                            </label>
                          ))}
                        </fieldset>
                      ))}
                    </div>
                    {!canContinue && (
                      <p className="small muted" id="room-help">
                        {slots.length === 2
                          ? t(['Her iki oda için de bir tür seçin.', 'Choose a category for both rooms.', 'Wählen Sie für beide Zimmer eine Kategorie.'])
                          : t(['Devam etmek için bir oda seçin.', 'Select a room to continue.', 'Wählen Sie ein Zimmer aus, um fortzufahren.'])}
                      </p>
                    )}
                    {canContinue && (
                      <div className="booking-handoff">
                        <button
                          type="button"
                          className="button"
                          onClick={() => {
                            track('begin_checkout', { currency: 'TRY', value: total });
                            setStep(2);
                          }}
                        >
                          {t(['Misafir ve ödeme bilgilerine geç', 'Continue to guest & payment', 'Weiter zu Gast & Zahlung'])}
                        </button>
                      </div>
                    )}
                    <button type="button" className="button button-outline back-button" onClick={() => setStep(0)}>
                      {t(['Tarih ve misafiri düzenle', 'Edit dates and guests', 'Reisedaten und Gäste ändern'])}
                    </button>
                  </>
                )}

                {step === 2 && (
                  <form className="guest-form" onSubmit={completeBooking} noValidate>
                    <label>
                      {t(['Ad soyad', 'Full name', 'Vollständiger Name'])}
                      <input name="guestName" value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} required autoComplete="name" />
                    </label>
                    <label>
                      {t(['E-posta', 'Email', 'E-Mail'])}
                      <input name="guestEmail" type="email" value={guest.email} onChange={e => setGuest({ ...guest, email: e.target.value })} required autoComplete="email" />
                    </label>
                    <label>
                      {t(['Telefon', 'Phone', 'Telefon'])}
                      <input name="guestPhone" type="tel" value={guest.phone} onChange={e => setGuest({ ...guest, phone: e.target.value })} required autoComplete="tel" />
                    </label>
                    <label>
                      {t(['Özel not (opsiyonel)', 'Special requests (optional)', 'Besondere Wünsche (optional)'])}
                      <input name="guestNote" value={guest.note} onChange={e => setGuest({ ...guest, note: e.target.value })} />
                    </label>

                    <div className="payment-methods" role="radiogroup" aria-label={t(['Ödeme yöntemi', 'Payment method', 'Zahlungsart'])}>
                      <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <CreditCard size={17} aria-hidden="true" />
                        <span>{t(['Kart ile Online Ödeme', 'Pay Online by Card', 'Online per Karte zahlen'])}</span>
                      </label>
                      <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="hotel" checked={paymentMethod === 'hotel'} onChange={() => setPaymentMethod('hotel')} />
                        <ShieldCheck size={17} aria-hidden="true" />
                        <span>{t(['Otelde Ödeme / Ön Rezervasyon', 'Pay at Hotel', 'Zahlung im Hotel'])}</span>
                      </label>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="card-fields">
                        <label className="card-full">
                          {t(['Kart üzerindeki isim', 'Cardholder name', 'Karteninhaber'])}
                          <input name="cardName" value={guest.cardName} onChange={e => setGuest({ ...guest, cardName: e.target.value })} autoComplete="cc-name" />
                        </label>
                        <label className="card-full">
                          {t(['Kart numarası', 'Card number', 'Kartennummer'])}
                          <input name="cardNumber" inputMode="numeric" placeholder="4543 •••• •••• ••••" value={guest.cardNumber} onChange={e => setGuest({ ...guest, cardNumber: e.target.value })} autoComplete="cc-number" />
                        </label>
                        <label>
                          {t(['Son kullanma (AA/YY)', 'Expiry (MM/YY)', 'Gültig bis (MM/JJ)'])}
                          <input name="cardExpiry" placeholder="08/28" value={guest.cardExpiry} onChange={e => setGuest({ ...guest, cardExpiry: e.target.value })} autoComplete="cc-exp" />
                        </label>
                        <label>
                          CVV
                          <input name="cardCvc" inputMode="numeric" placeholder="•••" maxLength="4" value={guest.cardCvc} onChange={e => setGuest({ ...guest, cardCvc: e.target.value })} autoComplete="cc-csc" />
                        </label>
                      </div>
                    )}

                    <label className="terms-check">
                      <input type="checkbox" checked={guest.accepted} onChange={e => setGuest({ ...guest, accepted: e.target.checked })} />
                      <span className="small">
                        {t(['KVKK ve iptal/iade koşullarını okudum, onaylıyorum.', 'I have read and accept the privacy and cancellation terms.', 'Ich habe die Datenschutz- und Stornierungsbedingungen gelesen und akzeptiert.'])}{' '}
                        <a className="text-link" href={pathFor(locale, 'cancellation')} target="_blank" rel="noreferrer">
                          {t(titles.cancellation)}
                        </a>
                      </span>
                    </label>

                    {formError && <p className="field-error" role="alert">{formError}</p>}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button type="submit" className="button">
                        <Lock size={15} aria-hidden="true" />
                        {paymentMethod === 'card'
                          ? t(['Ödemeyi ve Rezervasyonu Tamamla', 'Complete Payment & Booking', 'Zahlung & Buchung abschließen'])
                          : t(['Rezervasyonu Onayla', 'Confirm Reservation', 'Buchung bestätigen'])}
                      </button>
                      <button type="button" className="button button-outline" onClick={() => setStep(1)}>
                        {t(['Oda seçimine dön', 'Back to rooms', 'Zurück zur Zimmerauswahl'])}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </section>

          <aside className="stay-summary" aria-label={t(['Rezervasyon özeti', 'Booking summary', 'Buchungsübersicht'])}>
            <h2>{t(['Özet', 'Summary', 'Übersicht'])}</h2>
            <dl>
              <div>
                <dt>{t(bookingLabels.dates)}</dt>
                <dd>{stay.checkin ? formatDay(stay.checkin, locale) : '—'}{stay.checkout && ' – ' + formatDay(stay.checkout, locale)}{nights > 0 && ' · ' + nightCountText(nights, locale)}</dd>
              </div>
              <div>
                <dt>{t(bookingLabels.guests)}</dt>
                <dd>{guestCountText(stay, locale)}</dd>
              </div>
              <div>
                <dt>{selectedRooms.length === 2 ? t(['Odalar', 'Rooms', 'Zimmer']) : t(roomLabel)}</dt>
                <dd>{selectedRooms.map((room, index) => <span className="summary-room" key={index}>{selectedRooms.length > 1 && (index + 1) + '. '}{room ? t(room.title) : '—'}</span>)}</dd>
              </div>
            </dl>
            {subtotal > 0 && (
              <div className="summary-total">
                <div className="summary-total-row">
                  <span>{t(['Konaklama', 'Stay subtotal', 'Zwischensumme'])}</span>
                  <span>{formatTry(subtotal, locale)}</span>
                </div>
                <div className="summary-total-row">
                  <span>{t(['Doğrudan İndirim (%15)', 'Direct Discount (15%)', 'Direktrabatt (15%)'])}</span>
                  <span>−{formatTry(discount, locale)}</span>
                </div>
                <div className="summary-total-row summary-total-final">
                  <span>{t(['Toplam (Kahvaltı Dahil)', 'Total (Breakfast Incl.)', 'Gesamt (inkl. Frühstück)'])}</span>
                  <span>{formatTry(total, locale)}</span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
