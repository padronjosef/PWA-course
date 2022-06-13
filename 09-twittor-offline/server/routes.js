// Routes.js - Módulo de rutas
let express = require('express')
let router = express.Router()

const messages = [
  {
    _id: 01,
    user: 'spiderman',
    message: 'hello world'
  },
  {
    _id: 02,
    user: 'ironman',
    message: 'bye world'
  },
  {
    _id: 03,
    user: 'hulk',
    message: 'grrrr!!'
  },
]

// Get messages
router.get('/', (req, res) => res.json(messages))

// Post messages
router.post('/', function (req, res) {
  const message = {
    message: req.body.message,
    user: req.body.user
  }

  messages.push(message)
  res.json({ ok: true, message })

  console.log('✔ messages: ', messages)
})

module.exports = router