const cache_name = 'v1';
const cache_assets = [
    '/TugasDesainWebReza/index.html',
    '/TugasDesainWebReza/hubungi-kami.html',  // Nama file diperbaiki
    '/TugasDesainWebReza/about.html',
    '/TugasDesainWebReza/offline.html',
    '/TugasDesainWebReza/styles.css',
];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(cache_assets);
            })
            .catch((error) => {
                console.error('Error caching assets:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cache_name) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Jika ditemukan di cache, kembalikan respons cache
            if (response) {
                return response;
            }
            // Jika tidak ditemukan di cache, lakukan fetch request
            return fetch(event.request).catch(() => {
                // Jika fetch gagal, tampilkan halaman offline
                return caches.match('offline.html');
            });
        })
    );
});
