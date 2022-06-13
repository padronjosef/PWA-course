// cache with network race

const CACHE_STATIC = 'static-v3'
const CACHE_INMUTABLE = 'inmutable-v3'
const CACHE_DYNAMIC = 'dynamic-v3'

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
      '/img/no-img.jpg',
      '/pages/offline.html',
    ]))

  const cacheInmutable = caches.open(CACHE_INMUTABLE)
    .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'))

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})

self.addEventListener('activate', e => {
  const activation = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== CACHE_STATIC && key.includes('static')) {
        return caches.delete(key)
      }
      if (key !== CACHE_INMUTABLE && key.includes('inmutable')) {
        return caches.delete(key)
      }
      if (key !== CACHE_DYNAMIC && key.includes('dynamic')) {
        return caches.delete(key)
      }
    });
  })

  e.waitUntil(activation)
})

self.addEventListener('fetch', e => {
  if (e.request.url.includes('chrome-extension')) return

  const res = caches.match(e.request)
    .then(res => {
      if (res) return res

      // the file does'nt exists 
      return fetch(e.request).then(newRes => {

        caches.open(CACHE_DYNAMIC)
          .then(cache => {
            cache.put(e.request, newRes)
            clearCache(CACHE_DYNAMIC, 50)
          })
        return newRes.clone()
      }).catch(() => {
        if (e.request.headers.get('accept').includes('text/html')) {
          return caches.match('/pages/offline.html')
        }
      })
    })

  e.respondWith(res)
})