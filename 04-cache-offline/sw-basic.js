

self.addEventListener('fetch', event => {
  // const offlineRes = new Response(`
  //   Welcome to by web page

  //   Sorry but you need internet to use this :(
  // `)

  //   const offlineRes = new Response(`
  //   <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //       <meta charset="UTF-8">
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //       <title>Mi PWA</title>
  //     </head>
  //     <body class="container p-3">
  //       <h1>Offline Mode</h1>
  //     </body>
  //   </html>
  // `, {
  //   headers: {
  //     'Content-Type': 'text/html'
  //   }
  // })

  const offlineRes = fetch('pages/offline.html')

  const response = fetch(event.request)
    .catch(() => offlineRes)

  event.respondWith(response)

  self.skipWaiting()
})
