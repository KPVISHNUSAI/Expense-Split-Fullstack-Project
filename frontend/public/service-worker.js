// Define cache name
const CACHE_NAME = 'my-app-cache-v1';

// Files to cache
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/static/js/bundle.js', // Adjust paths based on your build setup
    '/static/js/vendors~main.js', // Adjust paths based on your build setup
    '/static/css/main.css', // Adjust paths based on your build setup
];

// Install event - cache the static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If a match is found in cache, return it; otherwise fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
