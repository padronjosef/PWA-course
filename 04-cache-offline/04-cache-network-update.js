// cache with network update

// it is use when the performace is critical
// but also the updates are important too
// all is gonna be a version down

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
  if (e.request.url.includes('bootstrap')) {
    return e.respondWith(caches.match(e.request))
  }

  const result = caches.open(CACHE_STATIC).then(cache => {
    fetch(e.request).then(newRes => {
      cache.put(e.request, newRes)
    })

    return cache.match(e.request)
  })

  e.respondWith(result)
})