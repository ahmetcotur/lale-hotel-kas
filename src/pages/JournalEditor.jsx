import React, { useEffect, useState } from 'react';
import { hotel, locales, posts } from '../data/hotel.js';
import { PageHeading } from '../components/HotelUI.jsx';

const storageKey = 'lale-journal-drafts';
const emptyDraft = () => ({
  id: '', slug: ['', '', ''], title: ['', '', ''], category: ['', '', ''],
  intro: ['', '', ''], body: [['', '', '']], image: hotel.boat, reviewOn: '',
});
const fields = [
  ['title', 'Başlık'], ['slug', 'URL kısa adı'], ['category', 'Kategori'], ['intro', 'Özet'],
];
const media = [...new Set([hotel.hero, hotel.boat, hotel.breakfast, ...posts.map(post => post.image)])];

export default function JournalEditor() {
  const [drafts, setDrafts] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [language, setLanguage] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(saved)) setDrafts(saved);
    } catch {}
  }, []);

  function update(field, value) {
    setDraft(previous => ({ ...previous, [field]: value }));
    setStatus('');
  }

  function save(event) {
    event.preventDefault();
    const next = { ...draft, id: draft.id || crypto.randomUUID() };
    const entries = [...drafts.filter(entry => entry.id !== next.id), next];
    try {
      localStorage.setItem(storageKey, JSON.stringify(entries));
      setDrafts(entries);
      setDraft(next);
      setStatus('Taslak bu tarayıcıya kaydedildi.');
    } catch {
      setStatus('Tarayıcı depolama alanına yazılamadı. Taslağı JSON olarak indirebilirsiniz.');
    }
  }

  function exportDraft() {
    const complete = fields.every(([field]) => draft[field].every(value => value.trim()))
      && draft.slug.every(value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
      && draft.body.every(row => row.every(value => value.trim()));
    if (!complete) {
      setStatus('Her dilde başlık, kısa ad, kategori, özet ve paragrafları tamamlayın. Kısa adlarda küçük ASCII harf, rakam ve tire kullanın.');
      return;
    }
    const payload = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(payload);
    const link = document.createElement('a');
    link.href = url;
    link.download = draft.slug[0] + '.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Taslak editoryal inceleme için dışa aktarıldı.');
  }

  return <main id="main-content">
    <PageHeading title="Günlük taslakları" description="Yerel editör. Taslaklar bu tarayıcıda saklanır ve inceleme için dışa aktarılır." />
    <section className="wrap section section-topless editor-layout">
      <aside className="surface-form">
        <button className="button button-outline" type="button" onClick={() => { setDraft(emptyDraft()); setStatus(''); }}>Yeni taslak</button>
        {drafts.map(entry => <button key={entry.id} className="choice" type="button" aria-pressed={entry.id === draft.id} onClick={() => {
          setDraft(entry);
          setStatus('');
        }}>{entry.title.find(Boolean) || 'Başlıksız taslak'}</button>)}
      </aside>
      <form className="surface-form" onSubmit={save}>
        <div className="editor-languages" role="group" aria-label="Taslak dili">{locales.map((code, index) => <button key={code} type="button" className="choice" aria-pressed={language === index} onClick={() => setLanguage(index)}>{code.toUpperCase()}</button>)}</div>
        {fields.map(([field, label]) => <label key={field}>{label}<input value={draft[field][language]} onChange={event => update(field, draft[field].map((value, index) => index === language ? event.target.value : value))} /></label>)}
        {draft.body.map((row, index) => <label key={index}>Paragraf {index + 1}<textarea rows="4" value={row[language]} onChange={event => update('body', draft.body.map((entry, rowIndex) => rowIndex === index ? entry.map((value, langIndex) => langIndex === language ? event.target.value : value) : entry))} /></label>)}
        <button className="button button-outline" type="button" onClick={() => update('body', [...draft.body, ['', '', '']])}>Paragraf ekle</button>
        {draft.body.length > 1 && <button className="button button-outline" type="button" onClick={() => update('body', draft.body.slice(0, -1))}>Son paragrafı kaldır</button>}
        <label>Görsel<select value={draft.image} onChange={event => update('image', event.target.value)}>{media.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
        <label>İnceleme tarihi<input value={draft.reviewOn} onChange={event => update('reviewOn', event.target.value)} type="date" /></label>
        <div className="editor-languages"><button className="button" type="submit">Taslağı kaydet</button><button className="button button-outline" type="button" onClick={exportDraft}>JSON indir</button></div>
        <p role="status">{status}</p>
      </form>
    </section>
  </main>;
}
