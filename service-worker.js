const CACHE_NAME = 'recycling-app-cache-v1';

const urlsToCache = [
  './', 
  './index.html',
  // Platzhalter: In einer echten PWA müssten die Icon-Pfade hier hinzugefügt werden.
];

// Event: Installation des Service Workers
self.addEventListener('install', event => {
  console.log('[Service Worker] Installiere und cache statische Assets.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Event: Abfangen von Netzwerkanfragen (für Offline-Modus)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    // 1. Prüfen, ob die angeforderte Ressource im Cache vorhanden ist
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log(`[Service Worker] Ressource aus Cache: ${event.request.url}`);
          return response;
        }
        // 2. Wenn nicht im Cache, gehe zum Netzwerk
        console.log(`[Service Worker] Ressource von Netzwerk: ${event.request.url}`);
        return fetch(event.request);
      })
  );
});

// Event: Aktivierung des Service Workers (alte Caches aufräumen)
self.addEventListener('activate', event => {
  console.log('[Service Worker] Aktiviert und räume alte Caches auf.');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`[Service Worker] Lösche alten Cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
