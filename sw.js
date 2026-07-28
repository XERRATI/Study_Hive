/*
  Study Hive service worker  —  network-first, falls back to cache when offline.

  This always tries the network first, so when you push an update to GitHub
  Pages every visitor sees the new version on their next load (no stale cache).

  HOW TO FORCE A REFRESH AFTER AN UPDATE:
    Bump CACHE_VERSION below (e.g. 'study-hive-v1' -> 'study-hive-v2').
  Existing caches are deleted on the next visit and replaced with fresh files.

  WANT TO REMOVE THE SERVICE WORKER ENTIRELY?
    Delete this file and the registration line in js/38-...-pwa.js.
    (Leaving it here is harmless if the file is missing — the browser just
    ignores the failed registration.)
*/
const CACHE_VERSION = 'study-hive-v1';
const CORE_ASSETS = ['./', './index.html', './css/app.css'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((c) => c.addAll(CORE_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('./index.html')))
  );
});
