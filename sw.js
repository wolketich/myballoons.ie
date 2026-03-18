/* ============================================================
   MyBalloons — Service Worker
   Strategy: Cache-first for assets, network-first for pages
   ============================================================ */

const CACHE_NAME = 'myballoons-v1';
const ASSETS_CACHE = 'myballoons-assets-v1';

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/collections.html',
  '/custom-order.html',
  '/gallery.html',
  '/about.html',
  '/reviews.html',
  '/faq.html',
  '/delivery.html',
  '/contact.html',
  '/thank-you.html',
  '/404.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json',
  '/offline.html'
];

// ---- Install: pre-cache core assets ----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

// ---- Activate: clean up old caches ----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== ASSETS_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ---- Fetch: smart routing strategy ----
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (WhatsApp links, external fonts, etc.)
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.href.includes('fonts.googleapis.com') && !url.href.includes('fonts.gstatic.com')) return;

  // Fonts: cache-first, very long TTL
  if (url.href.includes('fonts.googleapis.com') || url.href.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Static assets (CSS, JS, images): cache-first
  if (
    url.pathname.startsWith('/css/') ||
    url.pathname.startsWith('/js/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|webp|svg|woff2?)$/)
  ) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(cache =>
        cache.match(request).then(cached => {
          if (cached) return cached;
          return fetch(request).then(response => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => new Response('Asset not available offline', { status: 503 }));
        })
      )
    );
    return;
  }

  // HTML pages: network-first, fall back to cache, then offline page
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(cached => {
          if (cached) return cached;
          return caches.match('/offline.html');
        })
      )
  );
});

// ---- Background sync for form submissions (future enhancement) ----
self.addEventListener('sync', event => {
  if (event.tag === 'sync-order') {
    event.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders() {
  // Placeholder for future offline form queue sync
  // When connected to a real form backend, pending submissions
  // stored in IndexedDB would be sent here
  console.log('[SW] Background sync: checking pending orders');
}
