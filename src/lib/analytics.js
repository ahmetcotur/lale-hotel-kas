const candidate = import.meta.env.VITE_GA4_ID ?? '';
export const analyticsId = /^G-[A-Z0-9]{5,20}$/.test(candidate) ? candidate : '';
const key = 'lale-analytics-consent';
const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
let consent = '';
let initialized = false;

export function readAnalyticsConsent() {
  if (!analyticsId) return '';
  try {
    const saved = localStorage.getItem(key);
    return ['granted', 'denied'].includes(saved) ? saved : '';
  } catch {
    return '';
  }
}

export function setAnalyticsConsent(value) {
  if (!analyticsId) return;
  consent = value;
  try { localStorage.setItem(key, value); } catch {}
  window['ga-disable-' + analyticsId] = value !== 'granted';
  if (value === 'denied') {
    if (initialized) window.gtag('consent', 'update', denied);
    return;
  }
  if (initialized) {
    window.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
    return;
  }
  initialized = true;
  window.dataLayer ??= [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', denied);
  window.gtag('consent', 'update', { ...denied, analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', analyticsId, { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + analyticsId;
  document.head.append(script);
}

export function track(name, properties) {
  if (!analyticsId || !initialized || consent !== 'granted') return;
  window.gtag('event', name, properties);
}
