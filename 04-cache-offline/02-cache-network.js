// cache with network fallback
const CACHE_STATIC = 'static-v1'
const CACHE_DYNAMIC = 'dynamic-v1'
const CACHE_INMUTABLE = 'inmutable-v1'

const clearCache = (cacheName, limit) => {
  caches.open(cacheName)
    .then(cache => {
      cache.keys()
        .then(keys => {
          if (keys.length > limit) {
            cache.delete(keys[0])
              .then(clearCache(cacheName, limit))
          }
        })
    })

}

self.addEventListener('install', e => {
  const staticCache = caches.open(CACHE_STATIC)
    .then(cache => cache.addAll([
      '/',
      '/index.html',
      '/css/style.css',
      '/img/main.jpg',
      'js/app.js'
    ]))

  const inmutableCache = caches.open(CACHE_INMUTABLE)
    .then(cache => cache.addAll([
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
    ]))

  e.waitUntil(Promise.all([staticCache, inmutableCache]))
})

self.addEventListener('fetch', e => {
  const res = caches.match(e.request)
    .then(res => {
      if (res) return res

      // the file does'nt exits 
      return fetch(e.request).then(newRes => {
        caches.open(CACHE_DYNAMIC)
          .then(cache => {
            cache.put(e.request, newRes)
            clearCache(CACHE_DYNAMIC, 5)
          })
        return newRes.clone()
      })
    })

  e.respondWith(res)
})