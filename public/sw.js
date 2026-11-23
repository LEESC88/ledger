const CACHE_NAME = 'monetax-cache-v1.6.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/ledger.css',
  '/css/analytics-settings.css',
  '/css/projects-claims.css',
  '/i18n.js',
  '/js/core.js',
  '/js/updater.js',
  '/js/sync.js',
  '/js/records.js',
  '/js/analytics.js',
  '/js/settings.js',
  '/js/projects.js',
  '/js/claims.js',
  '/js/main.js',
  '/vendor/jszip.min.js',
  '/manifest.json',
  '/icon.svg',
  '/version.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Always network-first for version.json and API requests
  if (url.pathname === '/version.json' || url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // Network-first with cache fallback for HTML/CSS/JS so updates arrive immediately when online
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (
          response &&
          response.status === 200 &&
          url.origin === self.location.origin
        ) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
