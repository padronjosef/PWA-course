const fs = require('fs')
const urlsafeBase64 = require('urlsafe-base64')
const vapid = require('./vapid.json')
const webpush = require('web-push')

webpush.setVapidDetails(
  'mailto: josepadron.go@gmail.com',
  vapid.publicKey,
  vapid.privateKey
)

const suscriptions = require('./subs-db.json')

module.exports.getKey = () => {
  return urlsafeBase64.decode(vapid.publicKey)
}

module.exports.addSubscription = suscription => {
  suscriptions.push(suscription)
  fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(suscriptions))
}

module.exports.sendPush = post => {
  console.log('method: sendPush')

  const sendedNotifications = []

  let totalOfSubs = 0

  suscriptions.forEach((suscription, i) => {
    const pushPromisses = webpush.sendNotification(suscription, JSON.stringify(post))
      .then(++totalOfSubs)
      .then(_ => console.log(`total notifications sent: ${totalOfSubs}`))
      .catch(err => {
        if (err.statusCode === 410) {
          suscription.inactive = true
        }
      })

    sendedNotifications.push(pushPromisses)
  })

  Promise.all(sendedNotifications).then(() => {
    const activeSuscripcions = suscriptions.filter(subs => !subs.inactive)

    fs.writeFileSync(`${__dirname}/subs-db.json`, JSON.stringify(activeSuscripcions))
  })
}
