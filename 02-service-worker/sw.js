// 01 - set to null a request
// self.addEventListener('fetch', event => {
//   if (event.request.url.includes('style.css')) {
//     event.respondWith(null)
//   } else {
//     event.respondWith(fetch(event.request))
//   }
// })

// 02 - al the ways to change a request response
// self.addEventListener('fetch', event => {
//   if(event.request.url.includes('.jpg')){
//     console.log(event.request.url)

//     const photoReq = fetch('https://upload.wikimedia.org/wikipedia/en/3/35/Supermanflying.png')
//     // const photoReq = fetch(event.request.url)
//     // const photoReq = fetch(event.request)
//     event.respondWith(photoReq)
//   }
// })

// 03 - how to intersect the style
// self.addEventListener('fetch', event => {
//   if (event.request.url.includes('style.css')) {
//     const newStyle = new Response(`
//       body {
//         background-color: #0000ff30 !important;
//         color: #444;
//       }
//     `, {
//       headers: {
//         'Content-Type': 'text/css'
//       }
//     })

//     event.respondWith(newStyle)
//   }
// })

// 04 - change a specific img
// self.addEventListener('fetch', event => {
//   if (event.request.url.includes('main.jpg')) {
//     const imgRotated = fetch('./img/main-patas-arriba.jpg')
//     event.respondWith(imgRotated)
//   }
// })

self.addEventListener('fetch', event => {
  const altImg = './img/main-patas-arriba.jpg'

  const resp = fetch(event.request)
    .then(resp => {
      if (resp.ok) return resp

      if (resp.url.includes('.jpg')) return fetch(altImg)
    })

  event.respondWith(resp)
})
