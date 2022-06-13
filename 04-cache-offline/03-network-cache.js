// network with cache fallback

const CACHE_STATIC = 'static-v1'
const CACHE_INMUTABLE = 'inmutable-v1'
const CACHE_DYNAMIC = 'dynamic-v1'

const CACHE_DYNAMIC_LIMIT = 50

function clearCache(cacheName, numeroItems) {
  caches.open(cacheName)
    .then(cache => cache.keys()
      .then(keys => {
        if (keys.length > numeroItems) {
          cache.delete(keys[0])
            .then(clearCache(cacheName, numeroItems))
        }
      })
    )
}

self.addEventListener('install', e => {
  const cacheStatic = caches.open(CACHE_STATIC)
    .then(cache => cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/img/main.jpg',
      '/js/app.js',
    ]))

  const cacheInmutable = caches.open(CACHE_INMUTABLE)
    .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'))

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})

self.addEventListener('fetch', e => {
  const respuesta = fetch(e.request).then(res => {
    if (!res) return caches.match(e.request)

    caches.open(CACHE_DYNAMIC)
      .then(cache => {
        cache.put(e.request, res)
        clearCache(CACHE_DYNAMIC, CACHE_DYNAMIC_LIMIT)
      })

    return res.clone()
  })
    .catch(() => caches.match(e.request))

  e.respondWith(respuesta)

})