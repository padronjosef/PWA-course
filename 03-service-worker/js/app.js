
// Detectar si podemos usar Service Workers
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg =>
      // setTimeout(() => 
      //   reg.sync.register('SYNC tag 💥')
      //   console.log('SW: all the photos were send to the server')
      // }, 3000)

      Notification.requestPermission()
        .then(result => {
          console.log("SW: user grand push notification permition: ", result)
          reg.showNotification('SW: permition granted')
        })
    )
}

// if(window.syncManager) {}

// fetch('https://reqres.in/api/users')
//   .then(res => res.text())
//   .then(console.log)