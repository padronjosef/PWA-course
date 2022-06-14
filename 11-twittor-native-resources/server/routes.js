// Routes.js - Módulo de rutas
const express = require('express')
const router = express.Router()
const push = require('./push')

const mensajes = [
  { _id: 'XXX', user: 'spiderman', mensaje: 'Hola Mundo' }
]

router.get('/', function (req, res) {
  res.json(mensajes)
})

// Post mensaje
router.post('/', function (req, res) {
  const mensaje = {
    mensaje: req.body.mensaje,
    user: req.body.user,
    lat: req.body.lat,
    lng: req.body.lng,
    foto: req.body.foto
  }

  mensajes.push(mensaje)

  res.json({ ok: true, mensaje })
})

router.post('/subscribe', (req, res) => {
  const suscripcion = req.body

  push.addSubscription(suscripcion)
  res.json('subscribe')
})

// Almacenar la suscripción
router.get('/key', (req, res) => {
  const key = push.getKey()
  res.send(key)
})

router.post('/push', (req, res) => {
  const post = {
    titulo: req.body.titulo,
    cuerpo: req.body.cuerpo,
    usuario: req.body.usuario
  }

  push.sendPush(post)
  res.json(post)
})

module.exports = router
