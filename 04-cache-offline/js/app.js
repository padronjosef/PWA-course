

if (navigator.serviceWorker) {
  // navigator.serviceWorker.register('./sw.js');
  navigator.serviceWorker.register('./05-cache-network-race.js');
}

// if (window.caches) {
//   caches.open('test-1')
//   caches.open('test-2')

//   // caches.has('test-3').then(console.log)
//   // caches.delete('test-2').then(console.log)

//   caches.open('cache-v1.0').then(cache => {
//     cache.add('./index.html')

//     const thingsToSave = [
//       '/index.html',
//       '/css/style.css',
//       '/img/main.jpg'
//     ]

//     cache.addAll(thingsToSave)
//       .then(() => {
//         // cache.delete('/css/style.css')
//         const newCashe = new Response('hi world')
//         cache.put('index.html', newCashe)
//       })

//     cache.match('/index.html')
//       .then(res => res.text())
//       .then(console.log)
//   })

//   caches.keys()
//     .then(keys => console.log(keys))
// }
