import { rooms } from '../data/hotel.js';

export const limits = { minNights: 1, maxNights: 30, horizon: 365, guestsPerRoom: 3, guests: 6, blackout: [] };
export const emptyStay = { checkin: '', checkout: '', adults: 2, children: 0, ages: [], roomIds: [] };
const dayMs = 86400000;

export const dateKey = date => date.toISOString().slice(0, 10);
export const asDate = key => new Date(key + 'T00:00:00Z');
export const shiftDay = (key, days) => dateKey(new Date(asDate(key).getTime() + days * dayMs));
export const nightsBetween = (start, end) => start && end ? (asDate(end) - asDate(start)) / dayMs : 0;
export const todayInKas = () => {
  const fields = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts();
  const part = type => fields.find(field => field.type === type).value;
  return part('year') + '-' + part('month') + '-' + part('day');
};
const validDate = key => /^\d{4}-\d{2}-\d{2}$/.test(key ?? '') && Number.isFinite(asDate(key).getTime()) && dateKey(asDate(key)) === key;

export function formatDay(key, locale, options = { day: 'numeric', month: 'short' }) {
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(asDate(key));
}

export function allowedDate(key, today = todayInKas()) {
  return validDate(key) && key >= today && key <= shiftDay(today, limits.horizon);
}

export function allowedRange(start, end, today = todayInKas()) {
  if (!allowedDate(start, today) || !allowedDate(end, today)) return false;
  const nights = nightsBetween(start, end);
  return nights >= limits.minNights && nights <= limits.maxNights && !limits.blackout.some(day => day >= start && day < end);
}

export function readStay(raw, today = todayInKas()) {
  const checkin = allowedDate(raw?.checkin, today) && !limits.blackout.includes(raw.checkin) ? raw.checkin : '';
  const checkout = checkin && allowedRange(checkin, raw?.checkout, today) ? raw.checkout : '';
  const adults = Number.isInteger(raw?.adults) && raw.adults >= 1 && raw.adults <= limits.guests ? raw.adults : emptyStay.adults;
  const children = Number.isInteger(raw?.children) && raw.children >= 0 && raw.children + adults <= limits.guests ? raw.children : 0;
  const ages = Array.from({ length: children }, (_, index) => Number.isInteger(raw?.ages?.[index]) && raw.ages[index] >= 0 && raw.ages[index] <= 17 ? raw.ages[index] : '');
  const selected = Array.isArray(raw?.roomIds) ? raw.roomIds : [raw?.roomId];
  const roomIds = selected.slice(0, roomCountFor({ adults, children })).map(id => rooms.some(room => room.id === id) ? id : '');
  return { checkin, checkout, adults, children, ages, roomIds };
}

export const roomCountFor = stay => Math.ceil((stay.adults + stay.children) / limits.guestsPerRoom);

export function roomSlotsFor(stay) {
  const count = roomCountFor(stay);
  const guests = stay.adults + stay.children;
  return Array.from({ length: count }, (_, index) => Math.floor(guests / count) + Number(index < guests % count));
}

export function roomOptionsFor(stay) {
  return roomSlotsFor(stay).map(guests => ({ guests, rooms: rooms.filter(room => room.maxGuests >= guests) }));
}

export function officialBookingUrl(stay, locale) {
  const url = new URL(locale, 'https://lale-hotel.hmshotel.net/');
  url.search = new URLSearchParams({
    checkin: stay.checkin, checkout: stay.checkout, adult: String(stay.adults), child: String(stay.children),
  });
  if (stay.children && stay.ages.length === stay.children && stay.ages.every(age => Number.isInteger(age) && age <= 16)) {
    url.searchParams.set('childAges', stay.ages.join(','));
  }
  return url.href;
}
