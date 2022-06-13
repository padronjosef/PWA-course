// if('serviceWorker' in navigator) {
//   console.log('🚀 Service worker can be use')
// }

// confirm is service worker can be use
if(navigator.serviceWorker) {
  navigator.serviceWorker.register('./sw.js')
}