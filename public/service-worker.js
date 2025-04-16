
// Cache name with version for easier updates
const CACHE_NAME = 'dawg-cache-v1';

// Assets to cache immediately on service worker install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/lovable-uploads/4f75fa74-78b9-452a-8966-617f384ebf8a.png',
  '/lovable-uploads/0bfd5d0a-98bb-4d65-b908-60d9337659de.png'
];

// Install event - precache key resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network with caching
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) return;

  // Skip Supabase API requests
  if (event.request.url.includes('supabase.co')) return;
  
  // For image requests, use cache-first strategy
  if (event.request.destination === 'image' || event.request.url.includes('/lovable-uploads/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            // Return cached response
            return cachedResponse;
          }
          
          // If not in cache, fetch from network
          return fetch(event.request).then(networkResponse => {
            // Clone the response since we need to use it twice
            const responseToCache = networkResponse.clone();
            
            // Cache the fetched resource
            cache.put(event.request, responseToCache);
            
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // For other requests, use network-first strategy
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

// Add cache management for lovable-uploads
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_NEW_IMAGE') {
    const imageUrl = event.data.url;
    if (imageUrl) {
      caches.open(CACHE_NAME).then(cache => {
        fetch(imageUrl, { 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }).then(response => {
          cache.put(imageUrl, response);
        });
      });
    }
  }
});
