// cache and network race

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
      '/img/no-img.jpg',
    ]))

  const cacheInmutable = caches.open(CACHE_INMUTABLE)
    .then(cache => cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'))

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})

self.addEventListener('fetch', e => {
  const respond = new Promise((resolve, reject) => {
    let rejected = false

    const failedOne = () => {
      if (rejected) {
        if (/\.(png|jpg)/i.test(e.request.url)) {
          resolve(caches.match('/img/no-img.jpg'))
        } else {
          reject('no response founded')
        }
      } else {
        rejected = true
      }
    }

    fetch(e.request).then(res =>
      res.ok ? resolve(res) : failedOne()
    ).catch(failedOne)

    caches.match(e.request).then(res =>
      res ? resolve(res) : failedOne()
    ).catch(failedOne)
  })

  e.respondWith(respond)
})