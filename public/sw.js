// Service Worker for caching images and static assets

const CACHE_NAME = 'dawg-cache-v1';
const ASSETS_TO_CACHE = [
  '/lovable-uploads/',
];

// Install event - pre-cache important assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - cache images with a cache-first strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Check if the request is for an image
  const url = new URL(event.request.url);
  const isImage = /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(url.pathname) || 
                  url.pathname.includes('/lovable-uploads/');

  if (isImage) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Return cached response if found
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise fetch from network, cache and return
          return fetch(event.request).then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            cache.put(event.request, responseToCache);
            
            return networkResponse;
          });
        });
      })
    );
  }
});
