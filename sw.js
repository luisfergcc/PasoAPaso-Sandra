/* Paso a Paso — funciona sin conexión. Al publicar cambios, sube el número de CACHE. */
const CACHE = 'pasoapaso-v3';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './app.css', './data.js', './exdata.js', './anim.js', './animdefs.js', './fuerza.js', './core.js', './calent.js', './app.js', './views1.js', './views2.js', './boot.js', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
