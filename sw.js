// Service Worker for GiocoCoro V2
// Version v2: cache-first con invalidazione delle cache precedenti

const CACHE_NAME = 'giococoro-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css',
  'https://unpkg.com/react@18/umd/react.development.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.development.js'
];

// Install: apri la cache e aggiungi tutte le risorse
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate: elimina eventuali cache precedenti a questa versione
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch: rispondi con la cache se disponibile, altrimenti vai in rete
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
