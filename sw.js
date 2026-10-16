/* Keep this version in step with shell changes. No user data enters this cache. */
'use strict';
const CACHE = 'kome-shell-v1';
const ROOT = new URL('./', self.location.href);
const SHELL = ['index.html', 'manifest.webmanifest', 'icon.svg', 'apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(path => new URL(path, ROOT).href))));
  // Activate on the next navigation so an open session keeps its current shell.
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('kome-shell-') && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      // Installed shells update atomically through the service-worker install.
      return response.ok ? response : caches.match(new URL('index.html', ROOT).href).then(cached => cached || response);
    }).catch(() => caches.match(new URL('index.html', ROOT).href)));
  } else if (SHELL.some(path => url.href === new URL(path, ROOT).href)) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
