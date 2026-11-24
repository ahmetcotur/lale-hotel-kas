import { chromium, webkit } from 'playwright-core';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { canonicalPaths } from '../src/lib/routes.js';
import { todayInKas, shiftDay } from '../src/lib/booking.js';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4175';
const artifacts = process.env.QA_ARTIFACTS || join(tmpdir(), 'lale-site-qa');
await mkdir(artifacts, { recursive: true });
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executablePath = process.env.CHROME_BIN || (existsSync(macChrome) ? macChrome : undefined);
const browser = process.env.QA_BROWSER === 'webkit'
  ? await webkit.launch({ headless: true })
  : await chromium.launch({ executablePath, headless: true });
const require = createRequire(import.meta.url);
const knownPaths = new Set(canonicalPaths);
try {
  const cases = [
    { width: 1440, height: 950 },
    { width: 900, height: 940 },
    { width: 390, height: 844 },
    { width: 320, height: 720 },
  ];
  for (const viewport of cases) {
    const page = await browser.newPage({ viewport, reducedMotion: viewport.width === 320 ? 'reduce' : 'no-preference' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().includes('/assets/') && response.status() >= 400) errors.push(response.status() + ' ' + response.url());
    });
    for (const route of canonicalPaths) {
      const result = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      assert.equal(result.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, route);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://lalehotelkas.com' + route);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 4);
      const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.ok(schema['@graph'].some(node => node['@type'] === 'Hotel' && node.telephone === '+90 242 836 10 74'));
      assert.ok(schema['@graph'].every(node => !['Offer', 'AggregateRating'].includes(node['@type'])));
      for (const href of await page.locator('a[href^="/"]').evaluateAll(links => links.map(link => new URL(link.href).pathname))) {
        assert.ok(knownPaths.has(href), route + ' → ' + href);
      }
      const audit = await page.evaluate(async () => {
        const broken = await Promise.all([...document.images].map(async img => {
          img.loading = 'eager';
          try { await img.decode(); return null; } catch { return img.currentSrc; }
        }));
        return { over: document.documentElement.scrollWidth > innerWidth, broken: broken.filter(Boolean) };
      });
      assert.deepEqual(audit, { over: false, broken: [] }, route + ' ' + viewport.width);
    }
    await page.goto(base + '/tr/');
    await page.locator('.hero-image img').evaluate(image => image.decode());
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(artifacts, 'home-' + viewport.width + '.png'), animations: 'disabled' });
    if (viewport.width <= 1040) {
      await page.getByRole('button', { name: 'Menü' }).click();
      await page.getByRole('dialog', { name: 'Menü' }).waitFor();
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog', { name: 'Menü' }).count(), 0);
    }
    await page.goto(base + '/tr/galeri/');
    await page.locator('.photo-open').first().click();
    await page.locator('.lightbox[open] img').evaluate(img => img.decode());
    await page.keyboard.press('ArrowRight');
    await page.locator('.lightbox[open] img').evaluate(img => img.decode());
    assert.match(await page.locator('.lightbox[open] .lightbox-controls').innerText(), /2\//);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.lightbox[open]').count(), 0);
    if (viewport.width === 1440 || viewport.width === 390) {
      for (const route of ['/tr/', '/en/rooms/', '/de/zimmer/meer-und-inselblick/', '/tr/galeri/', '/tr/iletisim/', '/tr/rezervasyon/']) {
        await page.goto(base + route);
        if (route.includes('rezervasyon')) await page.locator('.dates-field button').click();
        await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
        const violations = await page.evaluate(async () => {
          const result = await window.axe.run({ runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] });
          return result.violations.map(violation => [violation.id, violation.nodes.map(node => node.target)]);
        });
        assert.deepEqual(violations, [], route + ' at ' + viewport.width + 'px');
      }
    }
    assert.deepEqual(errors, [], viewport.width + 'px');
    console.log(canonicalPaths.length + ' routes, images and gallery passed at ' + viewport.width + 'px');
    await page.close();
  }

  const flow = [
    { locale: 'tr', route: '/tr/', booking: '/tr/rezervasyon/', verify: 'Müsaitliği kontrol et' },
    { locale: 'en', route: '/en/', booking: '/en/booking/', verify: 'Check availability' },
    { locale: 'de', route: '/de/', booking: '/de/buchung/', verify: 'Verfügbarkeit prüfen' },
  ];
  const today = todayInKas();
  const start = shiftDay(today, 1);
  const end = shiftDay(start, 3);
  for (const [index, labels] of flow.entries()) {
    const viewport = cases[index === 0 ? 0 : index === 1 ? 2 : 3];
    const page = await browser.newPage({ viewport, reducedMotion: index === 2 ? 'reduce' : 'no-preference' });
    await page.goto(base + labels.route);
    await page.locator('.dates-field .search-control').click();
    await page.locator('[data-date="' + today + '"]').waitFor();
    assert.equal(await page.locator('.calendar-month-1').isVisible(), viewport.width > 670);
    const active = await page.evaluate(() => document.activeElement.dataset.date);
    assert.equal(active, today);
    if (today.slice(-2) !== '01') assert.equal(await page.locator('[data-date="' + shiftDay(today, -1) + '"]').getAttribute('aria-disabled'), 'true');
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.date), start);
    await page.keyboard.press('Enter');
    if (!(await page.locator('[data-date="' + end + '"]').isVisible())) await page.locator('.calendar-heading button').last().click();
    await page.locator('[data-date="' + end + '"]').click();
    await page.locator('.guests-panel').waitFor();
    await page.locator('.guest-row').last().locator('button').last().click();
    const multiRoom = index !== 1;
    if (multiRoom) {
      const moreAdults = page.locator('.guest-row').first().locator('button').last();
      for (let guestCount = 3; guestCount < 6; guestCount++) await moreAdults.click();
      assert.equal(await moreAdults.isDisabled(), true);
    }
    await page.locator('.age-field input').fill('7');
    if (multiRoom) {
      await page.locator('.guests-panel .button').click();
    } else {
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.guests-panel').count(), 0);
      await page.getByRole('button', { name: labels.verify }).click();
    }
    await page.waitForURL('**' + labels.booking + '?search=1');
    await page.locator('.room-choice').first().waitFor();
    assert.match(await page.locator('.stay-summary').innerText(), /3 (gece|nights|Nächte)/);
    assert.equal(await page.locator('.room-choices').count(), multiRoom ? 2 : 1);
    await page.locator('.room-choice').first().click();
    const proceed = page.locator('.booking-handoff button');
    if (multiRoom) {
      assert.equal(await proceed.count(), 0);
      const second = page.locator('.room-choices').nth(1).locator('.room-choice');
      await second.nth(index === 0 ? 1 : 0).click();
      assert.equal(await page.locator('.summary-room').count(), 2);
    }
    await proceed.click();
    await page.locator('input[name="guestName"]').fill('Elif Demir');
    await page.locator('input[name="guestEmail"]').fill('elif@example.com');
    await page.locator('input[name="guestPhone"]').fill('+90 532 000 00 00');
    await page.locator('input[name="paymentMethod"][value="hotel"]').check();
    await page.locator('.terms-check input[type="checkbox"]').check();
    await page.locator('.guest-form button[type="submit"]').click();
    await page.locator('.booking-confirmed').waitFor();
    assert.match(await page.locator('.booking-confirmed').innerText(), /LALE-/);
    await page.screenshot({ path: join(artifacts, 'booking-' + viewport.width + '.png') });
    console.log(labels.booking + ' direct booking flow passed at ' + viewport.width + 'px');
    await page.close();
  }

  const carousel = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await carousel.goto(base + '/tr/');
  const rail = carousel.locator('.room-rail');
  assert.equal(await rail.locator('.room-card').count(), 5);
  assert.equal(await carousel.locator('.breakfast-photos img').count(), 3);
  await rail.scrollIntoViewIfNeeded();
  await carousel.waitForFunction(() => document.querySelector('.room-rail').scrollLeft > 0, null, { timeout: 8500 });
  await carousel.getByRole('button', { name: 'Kaydırmayı durdur' }).click();
  await carousel.getByRole('button', { name: 'Kaydırmayı başlat' }).waitFor();
  await carousel.getByRole('button', { name: 'Sonraki oda' }).click();
  await carousel.close();

  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(base + '/de/zimmer/meer-und-inselblick/');
  assert.equal(await noJs.locator('h1').textContent(), 'Zimmer mit Meer- und Inselblick');
  await noJs.close();
  const page = await browser.newPage();
  await page.goto(base + '/tr/blog/');
  await page.locator('input[type=search]').fill('kekova');
  assert.equal(await page.locator('.journal-card').count(), 1);
  await page.locator('.journal-card h2 a').click();
  await page.waitForURL('**/tr/blog/kekova-tekne-rotasi/');
  await page.goto(base + '/tr/iletisim/');
  await page.locator('input[name=name]').fill('Ayse Yilmaz');
  await page.locator('input[name=email]').fill('ayse@example.com');
  await page.locator('textarea').fill('Konaklama bilgisi');
  await page.getByRole('button', { name: 'Mesaj Gönder' }).click();
  await page.locator('p[role=status]').waitFor();
  const response = await page.request.get(base + '/odalar', { maxRedirects: 0 });
  assert.equal(response.status(), 301);
  assert.equal(response.headers().location, '/tr/odalar/');
  assert.equal((await page.goto(base + '/en/does-not-exist/')).status(), 404);
  assert.equal(await page.locator('h1').textContent(), 'Page not found');
  console.log('No-JS HTML, article search, contact form, legacy redirect and localized 404 passed.');

  const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallback.route('**/assets/photos/kas-kiyi-drone*.webp', route => route.fulfill({ status: 404, body: '' }));
  await fallback.goto(base + '/tr/');
  await fallback.waitForFunction(() => {
    const photo = document.querySelector('.hero-image img');
    return photo?.currentSrc.endsWith('.jpg') && photo.naturalWidth > 0;
  });
  await fallback.route('**/assets/hotel/kas-kiyi-drone.jpg', route => route.fulfill({ status: 404, body: '' }));
  await fallback.reload();
  await fallback.locator('.hero-image.photo-fallback').waitFor();
  await fallback.close();
  console.log('WebP → JPEG → accessible fallback passed.');
  console.log('Screenshots: ' + artifacts);
} finally {
  await browser.close();
}
