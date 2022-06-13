const express = require('express')
const router = express.Router()
const push = require('./push')

const mensajes = [
  { _id: 'XXX', user: 'spiderman', mensaje: 'Hola Mundo' }
]

router.get('/', function (req, res) {
  res.json(mensajes)
})

router.post('/', function (req, res) {
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user
  }

  mensajes.push(mensaje)
  res.send({ ok: true, mensaje })
})

router.post('/subscribe', (req, res) => {
  const suscipcion = req.body
  push.addSubscription(suscipcion)
  res.json('subscribe')
})

router.get('/key', (req, res) => {
  const key = push.getKey()
  res.send(key);
})

router.post('/push', (req, res) => {
  const post = {
    title: req.body.title,
    body: req.body.body,
    user: req.body.user
  }

  push.sendPush(post)

  res.json('push sended')
})

module.exports = router