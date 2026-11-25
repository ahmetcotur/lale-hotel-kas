import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputPath = resolve('src/data/googleReviews.json');
const defaultCid = '17649994864911914682';
const defaultProfileUrl = 'https://www.google.com/maps?cid=' + defaultCid;

const starMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

function normalizeReviews(items) {
  return items
    .map((entry, index) => ({
      id: String(entry.id || entry.reviewId || 'google-' + index),
      author: String(entry.author || entry.reviewer?.displayName || entry.user?.name || 'Google Misafiri').trim(),
      rating: Number(entry.rating ?? starMap[entry.starRating] ?? 0),
      date: entry.date ? String(entry.date).slice(0, 10) : null,
      relativeTime: entry.relativeTime ? String(entry.relativeTime).trim() : '',
      text: String(entry.text || entry.comment || entry.snippet || entry.review_text || '').trim(),
      language: String(entry.language || 'tr').slice(0, 2).toLowerCase(),
      url: String(entry.url || entry.link || defaultProfileUrl),
    }))
    .filter(entry => entry.rating === 5 && entry.text.length > 0)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 10);
}

async function fetchFromGbp(token, locationName) {
  const endpoint = `https://mybusiness.googleapis.com/v4/${locationName}/reviews?pageSize=50&orderBy=updateTime%20desc`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`GBP API HTTP ${response.status}`);
  const data = await response.json();
  const reviews = normalizeReviews((data.reviews ?? []).map(item => ({
    id: item.reviewId,
    author: item.reviewer?.displayName,
    starRating: item.starRating,
    date: item.updateTime || item.createTime,
    text: item.comment,
    url: defaultProfileUrl,
  })));
  return {
    rating: typeof data.averageRating === 'number' ? Number(data.averageRating.toFixed(1)) : null,
    reviewCount: typeof data.totalReviewCount === 'number' ? data.totalReviewCount : null,
    reviews,
  };
}

async function fetchFromSerpApi(apiKey) {
  const params = new URLSearchParams({
    engine: 'google_maps_reviews',
    data_cid: defaultCid,
    sort_by: 'newestFirst',
    hl: 'tr',
    api_key: apiKey,
  });
  const response = await fetch(`https://serpapi.com/search.json?${params}`);
  if (!response.ok) throw new Error(`SerpApi HTTP ${response.status}`);
  const data = await response.json();
  const place = data.place_info ?? {};
  const reviews = normalizeReviews((data.reviews ?? []).map(item => ({
    id: item.review_id,
    author: item.user?.name,
    rating: item.rating,
    date: item.iso_date || item.iso_date_of_last_edit,
    relativeTime: item.date,
    text: item.snippet || item.extracted_snippet?.original,
    url: item.link || defaultProfileUrl,
  })));
  return {
    rating: typeof place.rating === 'number' ? Number(place.rating.toFixed(1)) : null,
    reviewCount: typeof place.reviews === 'number' ? place.reviews : null,
    reviews,
  };
}

async function fetchFromOutscraper(apiKey) {
  const params = new URLSearchParams({
    query: 'Lale Hotel Kas',
    reviewsLimit: '30',
    sort: 'newest',
    language: 'tr',
    async: 'false',
  });
  const response = await fetch(`https://api.app.outscraper.com/maps/reviews-v3?${params}`, {
    headers: { 'X-API-KEY': apiKey },
  });
  if (!response.ok) throw new Error(`Outscraper HTTP ${response.status}`);
  const data = await response.json();
  const place = data.data?.[0] ?? {};
  const reviews = normalizeReviews((place.reviews_data ?? []).map(item => ({
    id: item.review_id,
    author: item.author_title,
    rating: item.review_rating,
    date: item.review_datetime_utc,
    relativeTime: '',
    text: item.review_text,
    url: item.review_link || defaultProfileUrl,
  })));
  return {
    rating: typeof place.rating === 'number' ? Number(place.rating.toFixed(1)) : null,
    reviewCount: typeof place.reviews === 'number' ? place.reviews : null,
    reviews,
  };
}

async function run() {
  const existing = JSON.parse(await readFile(outputPath, 'utf8'));
  const gbpToken = process.env.GOOGLE_GBP_ACCESS_TOKEN?.trim();
  const gbpLocation = process.env.GOOGLE_GBP_LOCATION_NAME?.trim();
  const serpApiKey = process.env.SERPAPI_API_KEY?.trim();
  const outscraperKey = process.env.OUTSCRAPER_API_KEY?.trim();

  let fetched = null;
  if (gbpToken && gbpLocation) {
    fetched = await fetchFromGbp(gbpToken, gbpLocation);
  } else if (serpApiKey) {
    fetched = await fetchFromSerpApi(serpApiKey);
  } else if (outscraperKey) {
    fetched = await fetchFromOutscraper(outscraperKey);
  } else {
    console.log(
      'Google yorum senkronizasyonu atlandı: API anahtarı tanımlı değil. ' +
      '(Otomatik çekim için GOOGLE_GBP_ACCESS_TOKEN + GOOGLE_GBP_LOCATION_NAME, SERPAPI_API_KEY veya OUTSCRAPER_API_KEY ayarlayın.)'
    );
    return;
  }

  const next = {
    source: 'google',
    placeCid: existing.placeCid || defaultCid,
    profileUrl: existing.profileUrl || defaultProfileUrl,
    updatedAt: new Date().toISOString().slice(0, 10),
    rating: fetched.rating ?? existing.rating ?? null,
    reviewCount: fetched.reviewCount ?? existing.reviewCount ?? null,
    reviews: fetched.reviews.length ? fetched.reviews : existing.reviews,
  };

  await writeFile(outputPath, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(`Synced ${next.reviews.length} five-star Google reviews to src/data/googleReviews.json.`);
}

run().catch(error => {
  console.error('Google yorum senkronizasyon hatası:', error.message);
  process.exit(1);
});
