import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const json = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const buildDate = new Date().toISOString().slice(0, 10);
const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ mode: 'production', server: { middlewareMode: true, watch: null }, appType: 'custom' });
try {
  const { App } = await server.ssrLoadModule('/src/App.jsx');
  const { canonicalPaths, matchRoute, redirects } = await server.ssrLoadModule('/src/lib/routes.js');
  const { metadata } = await server.ssrLoadModule('/src/lib/seo.js');
  const { breakfastShowcase, hotel, hotelHighlights, hotelPhotography, hotelSpaces, languageTags, rooms } = await server.ssrLoadModule('/src/data/hotel.js');

  function documentFor(path) {
    const route = matchRoute(path);
    const {
      title, description, url, image, imageWidth, imageHeight, imageAlt,
      siteName, ogLocale, ogLocaleAlternates, links, schema, index,
    } = metadata(route);
    const canonical = route.page !== 'missing';
    const head = [
      '<meta name="description" content="' + escape(description) + '">',
      ...(!index ? ['<meta name="robots" content="noindex,follow">'] : []),
      '<meta name="geo.region" content="TR-07">',
      '<meta name="geo.placename" content="Kaş, Antalya">',
      '<meta name="geo.position" content="36.19823;29.64385">',
      '<meta name="ICBM" content="36.19823, 29.64385">',
      ...(canonical ? ['<link rel="canonical" href="' + escape(url) + '">', ...links.map(([code, href]) => '<link rel="alternate" hreflang="' + code + '" href="' + escape(href) + '">')] : []),
      ...[
        ['og:site_name', siteName],
        ['og:locale', ogLocale],
        ...ogLocaleAlternates.map(alt => ['og:locale:alternate', alt]),
        ['og:title', title],
        ['og:description', description],
        ['og:image', image],
        ['og:image:width', String(imageWidth)],
        ['og:image:height', String(imageHeight)],
        ['og:image:alt', imageAlt],
        ['og:url', url],
        ['og:type', route.page === 'post' ? 'article' : 'website'],
      ].map(([key, value]) => '<meta property="' + key + '" content="' + escape(value) + '">'),
      '<meta name="twitter:card" content="summary_large_image">',
      '<meta name="twitter:title" content="' + escape(title) + '">',
      '<meta name="twitter:description" content="' + escape(description) + '">',
      '<meta name="twitter:image" content="' + escape(image) + '">',
      ...(canonical ? ['<script type="application/ld+json">' + json(schema) + '</script>'] : []),
    ];
    return template.replace(/lang="[^"]+"/, 'lang="' + languageTags[route.locale] + '"')
      .replace(/<title>.*?<\/title>/, '<title>' + escape(title) + '</title>')
      .replace('<!--page-head-->', () => head.join('\n  '))
      .replace('<div id="root"></div>', () => '<div id="root"' + (canonical ? ' data-prerendered="true"' : '') + '>' + renderToString(React.createElement(App, { pathname: path })) + '</div>');
  }

  for (const path of canonicalPaths) {
    const directory = join('dist', path);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), documentFor(path));
  }
  await writeFile('dist/index.html', documentFor('/'));
  await writeFile('dist/404.html', documentFor('/404'));
  for (const locale of ['en', 'de']) await writeFile('dist/' + locale + '/404.html', documentFor('/' + locale + '/404'));
  const rules = { ...redirects };
  for (const path of canonicalPaths) rules[path.slice(0, -1)] = path;
  await writeFile('dist/_redirects', Object.entries(rules).map(([from, to]) => from + ' ' + to + ' 301').join('\n') + '\n');

  const indexable = canonicalPaths.map(path => matchRoute(path)).filter(route => metadata(route).index);
  const ns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  const groups = {
    pages: indexable.filter(route => !['room', 'post'].includes(route.page)),
    rooms: indexable.filter(route => route.page === 'room'),
    blog: indexable.filter(route => route.page === 'post'),
  };
  const sitemapNames = Object.keys(groups).map(group => 'sitemap-' + group + '.xml');
  for (const [group, routes] of Object.entries(groups)) {
    const urls = routes.map(route => {
      const { url, image, links } = metadata(route);
      const featured = [hotel.hero, hotel.exterior, ...hotelHighlights.map(({ photo }) => photo), hotelSpaces.entrance[0], ...breakfastShowcase];
      const routePhotos = {
        home: featured,
        about: [hotel.exterior, ...breakfastShowcase, ...Object.values(hotelSpaces).flat()],
        gallery: [...hotelPhotography.map(photo => photo.name), ...rooms.flatMap(room => room.photos)],
      };
      const names = route.item?.photos ?? routePhotos[route.page];
      const photos = names ? [...new Set(names)].map(name => hotel.url + '/assets/hotel/' + name + '.jpg') : [image];
      return '<url><loc>' + escape(url) + '</loc><lastmod>' + buildDate + '</lastmod>' + links.map(([code, href]) => '<xhtml:link rel="alternate" hreflang="' + code + '" href="' + escape(href) + '"/>').join('') + photos.map(href => '<image:image><image:loc>' + escape(href) + '</image:loc></image:image>').join('') + '</url>';
    });
    await writeFile('dist/sitemap-' + group + '.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset ' + ns + '>\n' + urls.join('\n') + '\n</urlset>\n');
  }
  await writeFile('dist/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + sitemapNames.map(name => '<sitemap><loc>' + hotel.url + '/' + name + '</loc><lastmod>' + buildDate + '</lastmod></sitemap>').join('\n') + '\n</sitemapindex>\n');
  const robots = [
    'User-agent: *',
    'Disallow: /__editor',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    '# AI / LLM guide: ' + hotel.url + '/llms.txt',
    'Sitemap: ' + hotel.url + '/sitemap.xml',
    '',
  ].join('\n');
  await writeFile('dist/robots.txt', robots);
  console.log('Prerendered ' + canonicalPaths.length + ' pages across TR, EN and DE.');
} finally {
  await server.close();
}
