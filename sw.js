/* Saves the app on the device so it also opens without internet. A new build replaces the old copy. */
const CACHE = 'dino-hero-202611071957';
const SHELL = ['./', 'index.html', 'styles.css?v=202611071957', 'app.js?v=202611071957', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/face.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) {
    if (/(^|\.)(googleapis|gstatic)\.com$/.test(url.hostname)) {       // fonts: keep a copy
      e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()); return r; }))));
    }
    return;
  }
  // the app's own files: newest from the network, the saved copy when offline
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
});
