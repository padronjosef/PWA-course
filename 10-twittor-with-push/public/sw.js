importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')
importScripts('js/sw-db.js')
importScripts('js/sw-utils.js')

const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v1'
const INMUTABLE_CACHE = 'inmutable-v1'

const APP_SHELL = [
  '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js',
  'js/libs/plugins/mdtoast.min.js',
  'js/libs/plugins/mdtoast.min.css'
]

// comment all inside APP_SHELL_INMUTABLE to test in local since phone
const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js'
]

self.addEventListener('install', event => {
  const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache => cache.addAll(APP_SHELL))

  const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE))

  event.waitUntil(Promise.all([cacheStatic, cacheInmutable]))
})


self.addEventListener('activate', event => {
  const respuesta = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key)
      }

      if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
        return caches.delete(key)
      }
    })
  })

  event.waitUntil(respuesta)
})

self.addEventListener('fetch', event => {
  let respuesta

  if (event.request.url.includes('/api')) {
    respuesta = manejoApiMensajes(DYNAMIC_CACHE, event.request)
    return
  }

  respuesta = caches.match(event.request)
    .then(res => {
      if (res) {
        actualizaCacheStatico(STATIC_CACHE, event.request, APP_SHELL_INMUTABLE)
        return res
      }

      return fetch(event.request)
        .then(newRes => actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newRes))
    })

  event.respondWith(respuesta)
})

// tareas asíncronas
self.addEventListener('sync', event => {
  console.log('SW: Sync')

  if (event.tag === 'nuevo-post') {
    const respuesta = postearMensajes()
    event.waitUntil(respuesta)
  }
})

// Listenning PUSH
self.addEventListener('push', event => {
  const data = JSON.parse(event.data.text())

  const title = data.title

  const options = {
    body: data.body,
    icon: `./img/avatars/${data.user}.jpg`,
    badge: './img/favicon.ico',
    image: 'https://images.thedirect.com/media/photos/avengers-tower-2.jpg',
    vibrate: [100, 200, 100, 200, 100, 200, 100, 200, 100, 100, 100, 100, 100, 200, 100, 200, 100, 200, 100, 200, 100, 100, 100, 100, 100, 200, 100, 200, 100, 200, 100, 200, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 50, 50, 100, 800],
    openUrl: '/',
    data: {
      // url: 'https://google.com',
      url: '/',
      id: data.user
    },
    actions: [
      {
        action: `thor-action`,
        title: 'thor',
        icon: `./img/avatars/thor.jpg`
      },
      {
        action: `ironman-action`,
        title: 'ironman',
        icon: `./img/avatars/ironman.jpg`
      }
    ]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  const notificacion = event.notification
  const accion = event.action

  const url = notificacion.data.url

  // console.log('⭐ notificationclick: ', { notificacion, accion })

  const respuesta = clients.matchAll()
    .then(clientes => {
      let cliente = clientes.find(c => c.visibilityState === 'visible')

      if (cliente !== undefined) {
        cliente.navigate(url)
        cliente.focus()
        return
      } else {
        clients.openWindow(url)
      }

      return notificacion.close()
    })

  event.waitUntil(respuesta)
})