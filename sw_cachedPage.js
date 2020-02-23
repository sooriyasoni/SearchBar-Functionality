const cacheName = 'v1'
const cacheAsset = [
        'index.html',
        '/css/main.css',
        '/js/main.js'
    ]
    //call install event
self.addEventListener('install', (e) => {
    console.log('Service Worked : Installed');

    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("service worker: Caching files")
            cache.addAll(cacheAsset);
        })
        .then(() =>
            self.skipWaiting())
    );
})

//call Activate Event
self.addEventListener('activate', (e) => {
    console.log('Service Worked : Activated')
        //Remove Unwanted caches
    e.waitUntil(caches.keys()
        .then(cacheNames => {
            return Promise.all(cacheNames.map(cache => {
                if (cache != cacheName) {
                    console.log('Servicw worker:clear old cache');
                    return caches.delete(cache)
                }
            }))
        }))
})

//call fetch event 
self.addEventListener('fetch', (e) => {
    console.log('service worker : fetching');
    e.respondWith(fetch(e.request)
        .catch(() => {
            caches.match(e.request)
        }))
})