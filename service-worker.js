const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Gangsterz100/',
  '/Gangsterz100/index.html',
  '/Gangsterz100/script.js',
  '/Gangsterz100/manifest.json',
  '/Gangsterz100/icon-192.jpg',
  '/Gangsterz100/icon-512.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
