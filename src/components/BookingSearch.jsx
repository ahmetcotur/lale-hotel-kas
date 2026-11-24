import React, { useEffect, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, Users } from 'lucide-react';
import { local } from '../data/hotel.js';
import { allowedDate, allowedRange, asDate, dateKey, formatDay, limits, nightsBetween, roomCountFor, shiftDay, todayInKas } from '../lib/booking.js';

export const bookingLabels = {
  dates: ['Giriş ve çıkış', 'Check-in and check-out', 'An- und Abreise'],
  guests: ['Misafirler', 'Guests', 'Gäste'],
  adults: ['Yetişkin', 'Adults', 'Erwachsene'],
  children: ['Çocuk', 'Children', 'Kinder'],
  night: ['gece', 'nights', 'Nächte'],
  search: ['Müsaitliği kontrol et', 'Check availability', 'Verfügbarkeit prüfen'],
  done: ['Tamam', 'Done', 'Fertig'],
};

export function guestCountText({ adults, children }, locale) {
  const adultLabel = adults === 1 ? ['yetişkin', 'adult', 'erwachsene Person'] : ['yetişkin', 'adults', 'Erwachsene'];
  const childLabel = children === 1 ? ['çocuk', 'child', 'Kind'] : ['çocuk', 'children', 'Kinder'];
  return adults + ' ' + local(adultLabel, locale) + (children ? ' · ' + children + ' ' + local(childLabel, locale) : '');
}

export function nightCountText(nights, locale) {
  return nights + ' ' + local(nights === 1 ? ['gece', 'night', 'Nacht'] : bookingLabels.night, locale);
}

const monthStart = key => key.slice(0, 7) + '-01';
function shiftMonth(key, amount) {
  const date = asDate(monthStart(key));
  date.setUTCMonth(date.getUTCMonth() + amount);
  return dateKey(date);
}

export function BookingSearch({ locale, value, onChange, onSearch, loading = false }) {
  const t = text => local(text, locale);
  const [panel, setPanel] = useState('');
  const [error, setError] = useState('');
  const [today, setToday] = useState('');
  const [month, setMonth] = useState('');
  const [focusDay, setFocusDay] = useState('');
  const focusCalendar = useRef(false);
  const root = useRef(null);
  const dateTrigger = useRef(null);
  const guestTrigger = useRef(null);
  const selectingEnd = Boolean(value.checkin && !value.checkout);
  const dateText = value.checkin ? formatDay(value.checkin, locale) + ' – ' + (value.checkout ? formatDay(value.checkout, locale) : '…') : t(['Tarih seçin', 'Choose dates', 'Datum wählen']);
  const guestText = guestCountText(value, locale);

  function toggle(next) {
    setError('');
    if (panel === next) {
      setPanel('');
      return;
    }
    if (next === 'dates') {
      const current = todayInKas();
      const initial = value.checkin || current;
      setToday(current);
      setMonth(monthStart(initial));
      setFocusDay(initial);
      focusCalendar.current = true;
    }
    setPanel(next);
  }

  useEffect(() => {
    function outside(event) {
      if (!root.current?.contains(event.target)) setPanel('');
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => {
    if (panel !== 'dates' || !focusCalendar.current) return;
    focusCalendar.current = false;
    root.current?.querySelector('[data-date="' + focusDay + '"]')?.focus();
  }, [focusDay, month, panel]);

  function choose(key) {
    if (!selectingEnd || key <= value.checkin) {
      onChange({ ...value, checkin: key, checkout: '' });
      return;
    }
    if (!allowedRange(value.checkin, key, today)) return;
    onChange({ ...value, checkout: key });
    guestTrigger.current.focus();
    setPanel('guests');
  }

  function calendarKey(event, key) {
    const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -((asDate(key).getUTCDay() + 6) % 7), End: 6 - ((asDate(key).getUTCDay() + 6) % 7) }[event.key];
    if (offset === undefined && !['PageUp', 'PageDown'].includes(event.key)) return;
    event.preventDefault();
    let target = offset === undefined ? shiftMonth(key, event.key === 'PageUp' ? -1 : 1) : shiftDay(key, offset);
    const last = shiftDay(today, limits.horizon);
    if (target < today) target = today;
    if (target > last) target = last;
    focusCalendar.current = true;
    if (target === focusDay) {
      root.current?.querySelector('[data-date="' + target + '"]')?.focus();
      focusCalendar.current = false;
      return;
    }
    if (monthStart(target) !== monthStart(key)) setMonth(monthStart(target));
    setFocusDay(target);
  }

  function changeGuests(field, amount) {
    const updated = { ...value, [field]: value[field] + amount };
    if (field === 'children') updated.ages = Array.from({ length: updated.children }, (_, index) => value.ages[index] ?? '');
    onChange({ ...updated, roomIds: updated.roomIds.slice(0, roomCountFor(updated)) });
  }

  function renderMonth(key, index) {
    const dayOffset = (asDate(key).getUTCDay() + 6) % 7;
    const days = nightsBetween(key, shiftMonth(key, 1));
    const monthTitle = formatDay(key, locale, { month: 'long', year: 'numeric' });
    return <div className={'calendar-month calendar-month-' + index} key={key}>
      <h3>{monthTitle}</h3>
      <div className="calendar-grid">
        {Array.from({ length: 7 }, (_, day) => <span className="weekday" key={day} aria-hidden="true">{formatDay(shiftDay('2024-01-01', day), locale, { weekday: 'short' })}</span>)}
        {Array.from({ length: dayOffset }, (_, day) => <span key={'blank-' + day} />)}
        {Array.from({ length: days }, (_, day) => {
          const date = shiftDay(key, day);
          const valid = allowedDate(date, today) && (selectingEnd && date > value.checkin ? allowedRange(value.checkin, date, today) : !limits.blackout.includes(date));
          const selected = date === value.checkin || date === value.checkout;
          const inRange = date > value.checkin && date < value.checkout;
          const tabStop = monthStart(focusDay) === key ? date === focusDay : date === (key < today ? today : key);
          return <button type="button" key={date} data-date={date} tabIndex={tabStop ? 0 : -1} aria-disabled={!valid} aria-pressed={selected}
            aria-current={date === today ? 'date' : undefined} aria-label={formatDay(date, locale, { dateStyle: 'full' })}
            className={inRange ? 'in-range' : undefined} onClick={() => valid && choose(date)} onKeyDown={event => calendarKey(event, date)}>{day + 1}</button>;
        })}
      </div>
    </div>;
  }

  function submit() {
    if (!allowedRange(value.checkin, value.checkout)) {
      if (panel !== 'dates') toggle('dates');
      else root.current?.querySelector('[data-date="' + focusDay + '"]')?.focus();
      setError(t(['Giriş ve çıkış tarihlerini seçin.', 'Choose check-in and check-out dates.', 'Wählen Sie An- und Abreise.']));
      return;
    }
    setPanel('');
    setError('');
    onSearch();
  }

  return (
    <div className="booking-search" ref={root} onKeyDown={event => {
      if (event.key === 'Escape' && panel) {
        event.stopPropagation();
        (panel === 'dates' ? dateTrigger : guestTrigger).current.focus();
        setPanel('');
      }
    }}>
      <div className="search-field dates-field">
        <button ref={dateTrigger} type="button" className="search-control" aria-expanded={panel === 'dates'} aria-describedby={error ? 'search-error' : undefined} onClick={() => toggle('dates')}><CalendarDays size={20} aria-hidden="true" /><span><small>{t(bookingLabels.dates)}</small><strong>{dateText}</strong></span><ChevronDown size={16} aria-hidden="true" /></button>
        {panel === 'dates' && <div className="search-panel calendar-panel" role="group" aria-label={t(bookingLabels.dates)}>
          <div className="calendar-heading">
            <button type="button" className="icon-button" aria-label={t(['Önceki ay', 'Previous month', 'Vorheriger Monat'])} disabled={month <= monthStart(today)} onClick={() => setMonth(shiftMonth(month, -1))}><ChevronLeft aria-hidden="true" /></button>
            <p aria-live="polite">{selectingEnd ? t(['Çıkış tarihini seçin', 'Choose check-out', 'Abreise wählen']) : t(['Giriş tarihini seçin', 'Choose check-in', 'Anreise wählen'])}</p>
            <button type="button" className="icon-button" aria-label={t(['Sonraki ay', 'Next month', 'Nächster Monat'])} disabled={month >= monthStart(shiftDay(today, limits.horizon))} onClick={() => setMonth(shiftMonth(month, 1))}><ChevronRight aria-hidden="true" /></button>
          </div>
          <div className="calendar-months">{renderMonth(month, 0)}{renderMonth(shiftMonth(month, 1), 1)}</div>
          <p className="calendar-note">{value.checkout ? nightCountText(nightsBetween(value.checkin, value.checkout), locale) : limits.minNights + '–' + limits.maxNights + ' ' + t(bookingLabels.night)}</p>
        </div>}
      </div>
      <div className="search-field guests-field">
        <button ref={guestTrigger} type="button" className="search-control" aria-expanded={panel === 'guests'} onClick={() => toggle('guests')}><Users size={20} aria-hidden="true" /><span><small>{t(bookingLabels.guests)}</small><strong>{guestText}</strong></span><ChevronDown size={16} aria-hidden="true" /></button>
        {panel === 'guests' && <div className="search-panel guests-panel" role="group" aria-label={t(bookingLabels.guests)}>
          {['adults', 'children'].map(field => <div key={field} className="guest-row"><span>{t(bookingLabels[field])}</span><div className="counter">
            <button type="button" className="icon-button" aria-label={t(bookingLabels[field]) + ' −'} disabled={value[field] <= Number(field === 'adults')} onClick={() => changeGuests(field, -1)}><Minus size={16} aria-hidden="true" /></button>
            <output aria-live="polite">{value[field]}</output>
            <button type="button" className="icon-button" aria-label={t(bookingLabels[field]) + ' +'} disabled={value.adults + value.children >= limits.guests} onClick={() => changeGuests(field, 1)}><Plus size={16} aria-hidden="true" /></button>
          </div></div>)}
          {value.ages.map((age, index) => <label className="age-field" key={index}>{t(['Çocuk yaşı (isteğe bağlı)', 'Child’s age (optional)', 'Alter des Kindes (optional)'])} {value.children > 1 ? index + 1 : ''}<input type="number" value={age} min="0" max="17" onChange={event => {
            const next = event.target.valueAsNumber;
            const ages = value.ages.map((previous, position) => position === index ? (Number.isInteger(next) ? Math.max(0, Math.min(next, 17)) : '') : previous);
            onChange({ ...value, ages });
          }} /></label>)}
          <p className="guest-room-note small" role="status">{roomCountFor(value) === 2
            ? t(['Bu grup için sonuçlarda iki oda seçebilirsiniz.', 'You can choose two rooms for this group in the results.', 'Für diese Gruppe können Sie in den Ergebnissen zwei Zimmer wählen.'])
            : t(['Oda başına en fazla 3, toplam en fazla 6 misafir.', 'Up to 3 guests per room and 6 in total.', 'Bis zu 3 Gäste pro Zimmer und 6 insgesamt.'])}</p>
          <button type="button" className="button" disabled={loading} onClick={() => {
            if (value.checkout) submit();
            else { setPanel(''); guestTrigger.current.focus(); }
          }}>{value.checkout ? t(['Odaları göster', 'Show rooms', 'Zimmer anzeigen']) : t(bookingLabels.done)}</button>
        </div>}
      </div>
      <button type="button" className="button search-submit" disabled={loading} onClick={submit}>{loading ? t(['Yükleniyor…', 'Loading…', 'Wird geladen…']) : t(bookingLabels.search)}</button>
      {error && <p id="search-error" className="search-error" role="alert">{error}</p>}
    </div>
  );
}
