
// cache only
// esta es usada cuando queremos que toda la app sea servida desde el cache, sin peticiones a la web

const CACHE_STATIC = 'static-v1'

self.addEventListener('install', e => {
  const staticCache = caches.open(CACHE_STATIC)
    .then(cache => cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/img/main.jpg',
      'js/app.js'
    ]))

  const inmutableCache = caches.open(CACHE_STATIC)
    .then(cache => cache.addAll([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
    ]))

  e.waitUntil(Promise.all([staticCache, inmutableCache]))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request))
})