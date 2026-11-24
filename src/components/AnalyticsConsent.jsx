import React, { useEffect, useState } from 'react';
import { local } from '../data/hotel.js';
import { analyticsId, readAnalyticsConsent, setAnalyticsConsent, track } from '../lib/analytics.js';
import { pathFor } from '../lib/routes.js';

export function AnalyticsConsent({ locale, page, recordPage }) {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState('');
  useEffect(() => {
    if (!analyticsId) return;
    const saved = readAnalyticsConsent();
    if (saved) {
      setAnalyticsConsent(saved);
      if (saved === 'granted') recordPage();
    }
    setChoice(saved);
    setVisible(!saved || page === 'cookies');
  }, [page]);

  if (!analyticsId || !visible) return null;
  const t = values => local(values, locale);
  function update(value) {
    setAnalyticsConsent(value);
    if (choice !== 'granted' && value === 'granted') recordPage();
    track('consent_preferences_saved', { analytics_consent: value });
    setChoice(value);
    setVisible(page === 'cookies');
  }

  return <aside className={'analytics-consent' + (page === 'cookies' ? ' analytics-inline' : '')} aria-label={t(['Analiz çerezleri', 'Analytics cookies', 'Analyse-Cookies'])}>
    <p>{t(['Site kullanımını ölçmek için isteğe bağlı analiz çerezlerine izin verebilirsiniz.', 'Allow optional analytics cookies to help measure how the site is used.', 'Sie können optionale Analyse-Cookies zulassen, um die Nutzung der Website zu messen.'])}</p>
    {page === 'cookies' ? <p className="small muted" role="status">{choice === 'granted' ? t(['Analiz açık', 'Analytics enabled', 'Analyse aktiviert']) : t(['Analiz kapalı', 'Analytics off', 'Analyse deaktiviert'])}</p> : <a className="text-link" href={pathFor(locale, 'cookies')}>{t(['Çerez tercihleri', 'Cookie preferences', 'Cookie-Einstellungen'])}</a>}
    <div><button type="button" className="button button-outline" onClick={() => update('denied')}>{t(['Reddet', 'Decline', 'Ablehnen'])}</button><button type="button" className="button" onClick={() => update('granted')}>{t(['İzin ver', 'Allow', 'Zulassen'])}</button></div>
  </aside>;
}
