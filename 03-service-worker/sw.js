
// Ciclo de vida del SW

// when the SW is istalling itself
self.addEventListener('install', event => {
  // downloading assets
  // dreating cache
  console.log("SW: installing the SW")

  const instalation = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("SW: simulating all is done")

      // this could be a bad practice
      self.skipWaiting()

      resolve()
    }, 100);
  })

  event.waitUntil(instalation)
})

// when the SW take control of de APP
// self.addEventListener('activate', event => {
//   // delete old cache
//   console.log("SW: active and ready to controll de app")
// })

// // handler of HTTP requests
// self.addEventListener('fetch', event => {
//   // Apply all cache strategies
//   console.log("SW: fetching some data from: ", event.request.url)

//   if (event.request.url.includes('api')) {
//     const response = new Response(`{ok: false, message: 'THE URL HAVE BEEN CHANGED'}`)

//     event.respondWith(response)
//   }
// })

self.addEventListener('activate', event => {

})

// SYNC: when we recover the internet conection
self.addEventListener('sync', event => {
  console.log('SW: internet recover: ', event.tag)
})

// manage the push notifications
self.addEventListener('push', event => {
  console.log('SW: notification recibed:', event)
})