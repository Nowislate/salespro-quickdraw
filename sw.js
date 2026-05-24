// salespro-quickdraw — Service Worker
// Cache-first for same-origin core assets only. CDN responses (cross-origin) are
// NOT cached — they revalidate from the browser HTTP cache + CDN every load.
// Bump CACHE_NAME on every deploy (e.g., quickdraw-v1 → quickdraw-v2) so the
// activate handler purges old caches. A 14-day TTL self-heal also forces a full
// cache purge if the same cache namespace has been resident for 14+ days —
// catches drift between deploys where someone forgets to bump CACHE_NAME, and
// blunts the blast radius of any cross-origin MITM poisoning (worst case = 14d).

const CACHE_NAME = 'quickdraw-v1';
const TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const TTL_KEY = '/__install_ts__';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-maskable.svg',
];

async function stampInstallTime(cache) {
  await cache.put(
    TTL_KEY,
    new Response(String(Date.now()), { headers: { 'Content-Type': 'text/plain' } })
  );
}

async function purgeIfStale() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const stampResp = await cache.match(TTL_KEY);
    if (!stampResp) {
      await stampInstallTime(cache);
      return;
    }
    const installedAt = parseInt(await stampResp.text(), 10);
    if (Number.isFinite(installedAt) && Date.now() - installedAt > TTL_MS) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      const fresh = await caches.open(CACHE_NAME);
      await fresh.addAll(CORE_ASSETS);
      await stampInstallTime(fresh);
    }
  } catch (e) {
    // Offline or storage unavailable — silently skip, retry next activate
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(CORE_ASSETS);
      await stampInstallTime(cache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
      await purgeIfStale();
    })()
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // SECURITY: cache ONLY same-origin responses. Cross-origin (CDN: unpkg,
          // tailwindcss.com, Google Fonts) responses are returned to the browser
          // but NEVER persisted to the SW cache. This blunts CDN-MITM poisoning
          // on first install — even if a malicious response gets returned once,
          // the next fetch re-checks the network instead of pinning the poison.
          // React + Babel CDN scripts are SRI-pinned in index.html as additional
          // defense in depth.
          if (
            response &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
