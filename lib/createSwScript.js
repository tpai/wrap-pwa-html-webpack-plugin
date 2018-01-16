const swScript = ({ name, files }) => (`// Plugin will automatically generate cache name and asset file name
const cacheName = '${name}';
const filesToCache = [
  ${files.map(file => `\'${file}\'`)}
];
// So DO NOT delete variable definitions upon

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',  e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});`);

module.exports = swScript;
