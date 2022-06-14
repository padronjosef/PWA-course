var url = window.location.href
var swLocation = '/twittor/sw.js'
var swReg

if (navigator.serviceWorker) {
  if (url.includes('localhost')) swLocation = '/sw.js'

  window.addEventListener('load', function () {
    navigator.serviceWorker.register(swLocation).then(function (reg) {
      swReg = reg
      swReg.pushManager.getSubscription().then(verificaSuscripcion)
    })
  })
}

// Referencias de jQuery
var googleMapKey = 'AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8'

// Google Maps llaves alternativas - desarrollo
// AIzaSyDyJPPlnIMOLp20Ef1LlTong8rYdTnaTXM
// AIzaSyDzbQ_553v-n8QNs2aafN9QaZbByTyM7gQ
// AIzaSyA5mjCwx1TRLuBAjwQw84WE6h5ErSe7Uj8
// AIzaSyCroCERuudf2z02rCrVa6DTkeeneQuq8TA
// AIzaSyBkDYSVRVtQ6P2mf2Xrq0VBjps8GEcWsLU
// AIzaSyAu2rb0mobiznVJnJd6bVb5Bn2WsuXP2QI
// AIzaSyAZ7zantyAHnuNFtheMlJY1VvkRBEjvw9Y
// AIzaSyDSPDpkFznGgzzBSsYvTq_sj0T0QCHRgwM
// AIzaSyD4YFaT5DvwhhhqMpDP2pBInoG8BTzA9JY
// AIzaSyAbPC1F9pWeD70Ny8PHcjguPffSLhT-YF8

var titulo = $('#titulo')
var nuevoBtn = $('#nuevo-btn')
var salirBtn = $('#salir-btn')
var cancelarBtn = $('#cancel-btn')
var postBtn = $('#post-btn')
var avatarSel = $('#seleccion')
var timeline = $('#timeline')

var modal = $('#modal')
var modalAvatar = $('#modal-avatar')
var avatarBtns = $('.seleccion-avatar')
var txtMensaje = $('#txtMensaje')

var btnActivadas = $('.btn-noti-activadas')
var btnDesactivadas = $('.btn-noti-desactivadas')

var btnLocation = $('#location-btn')
var modalMapa = $('.modal-mapa')

var btnTomarFoto = $('#tomar-foto-btn')
var btnPhoto = $('#photo-btn')
var contenedorCamara = $('.camara-contenedor')
var player = $('#player')[0]

let lat = null
let lng = null
let foto = null

let usuario

const camara = new Camara(player)

function crearMensajeHTML(mensaje, personaje, lat, lng, foto) {
  var content = `
    <li
      class="animated fadeIn fast"
      data-tipo="${mensaje}"
      data-user="${personaje}"
    >
      <div class="avatar">
        <img src="img/avatars/${personaje}.jpg">
      </div>
        <div class="bubble-container">
      <div class="bubble">
      <h3>@${personaje}</h3>
      <br/>
      ${mensaje}
    `

  if (foto) {
    content += `
      <br>
      <img class="foto-mensaje" src="${foto}">
    `
  }

  content += `
      </div>        
        <div class="arrow"></div>
      </div>
    </li>
  `

  if (lat) crearMensajeMapa(lat, lng, personaje)

  lat = null
  lng = null

  $('.modal-mapa').remove()

  timeline.prepend(content)
  cancelarBtn.click()
}

function crearMensajeMapa(lat, lng, personaje) {
  let content = `
    <li class="animated fadeIn fast"
      data-tipo="mapa"
      data-user="${personaje}"
      data-lat="${lat}"
      data-lng="${lng}"
    >
      <div class="avatar">
        <img src="img/avatars/${personaje}.jpg">
      </div>
      <div class="bubble-container">
        <div class="bubble">
          <iframe
            width="100%"
            height="250"
            frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen
          >
          </iframe>
        </div>
        <div class="arrow"></div>
      </div>
    </li> 
  `

  timeline.prepend(content)
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass('oculto')
    salirBtn.removeClass('oculto')
    timeline.removeClass('oculto')
    avatarSel.addClass('oculto')
    modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg')
    return
  }

  nuevoBtn.addClass('oculto')
  salirBtn.addClass('oculto')
  timeline.addClass('oculto')
  avatarSel.removeClass('oculto')
  titulo.text('Seleccione Personaje')
}

// Seleccion de personaje
avatarBtns.on('click', function () {
  usuario = $(this).data('user')
  titulo.text('@' + usuario)
  logIn(true)
})

// Boton de salir
salirBtn.on('click', () => logIn(false))

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
  modal.removeClass('oculto')
  modal.animate({ marginTop: '-=1000px', opacity: 1 }, 200)
})

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
  if (!modal.hasClass('oculto')) {
    modal.animate({
      marginTop: '+=1000px',
      opacity: 0
    }, 200, () => {
      modal.addClass('oculto')
      modalMapa.addClass('oculto')
      txtMensaje.val('')
    })
  }
})

// Boton de enviar mensaje
postBtn.on('click', () => {
  var mensaje = txtMensaje.val()

  if (!mensaje.length) return cancelarBtn.click()

  var data = { user: usuario, mensaje, lat, lng, foto }

  fetch('api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => console.log('📧 send: ', data))
    .catch(err => console.log('app.js error:', err))

  // camera.apagar()
  // contenedorCamara.addClass('oculto')

  crearMensajeHTML(mensaje, usuario, lat, lng, foto)

  foto = null
})

function getMensajes() {
  fetch('api')
    .then(res => res.json())
    .then(posts => {
      posts.forEach(post =>
        crearMensajeHTML(post.mensaje, post.user, post.lat, post.lng, post.foto))
    })
}

getMensajes()

function isOnline() {
  if (navigator.onLine) {
    $.mdtoast('Online', {
      interaction: true,
      interactionTimeout: 1000,
      actionText: 'OK!'
    })
    return
  }

  $.mdtoast('Offline', {
    interaction: true,
    actionText: 'OK',
    type: 'warning'
  })
}

window.addEventListener('online', isOnline)
window.addEventListener('offline', isOnline)

isOnline()

// Notificaciones
function verificaSuscripcion(activadas) {
  if (activadas) {
    btnActivadas.removeClass('oculto')
    btnDesactivadas.addClass('oculto')
    return
  }

  btnActivadas.addClass('oculto')
  btnDesactivadas.removeClass('oculto')
}

function enviarNotificacion() {
  const notificationOpts = {
    body: 'Este es el cuerpo de la notificación',
    icon: 'img/icons/icon-72x72.png'
  }

  const n = new Notification('Hola Mundo', notificationOpts)

  n.onclick = () => console.log('Click')
}

function notificarme() {
  if (!window.Notification) {
    console.log('Este navegador no soporta notificaciones')
    return
  }

  if (Notification.permission === 'granted') {
    enviarNotificacion()
  } else if (Notification.permission !== 'denied' || Notification.permission === 'default') {
    Notification.requestPermission(function (permission) {
      if (permission === 'granted') enviarNotificacion()
    })
  }
}

// Get Key
function getPublicKey() {
  return fetch('api/key')
    .then(res => res.arrayBuffer())
    .then(key => new Uint8Array(key))
}

btnDesactivadas.on('click', function () {
  if (!swReg) return console.log('No hay registro de SW')

  getPublicKey().then(function (key) {
    swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key
    })
      .then(res => res.toJSON())
      .then(suscripcion => {
        fetch('api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(suscripcion)
        })
          .then(verificaSuscripcion)
          .catch(cancelarSuscripcion)
      })
  })
})

function cancelarSuscripcion() {
  swReg.pushManager.getSubscription().then(subs => {
    subs.unsubscribe().then(() => verificaSuscripcion(false))
  })
}

btnActivadas.on('click', () => {
  cancelarSuscripcion()
})

function mostrarMapaModal(lat, lng) {
  $('.modal-mapa').remove()
  var content = `
    <div class="modal-mapa">
      <iframe
        width="100%"
        height="250"
        frameborder="0"
        src="https://www.google.com/maps/embed/v1/view?key=${googleMapKey}&center=${lat},${lng}&zoom=17" allowfullscreen>
        </iframe>
    </div>
  `

  modal.append(content)
}

// Obtener la geolocalización
btnLocation.on('click', () => {
  console.log('Botón geolocalización')
  if (navigator.geolocation) {
    // navigator.geolocation.watchPosition(post => console.log("🚀 post", post))
    navigator.geolocation.getCurrentPosition(post => {
      mostrarMapaModal(post.coords.latitude, post.coords.longitude)

      lat = post.coords.latitude
      lng = post.coords.longitude
    })

    $.mdtoast('Loading map...', {
      interaction: true,
      interactionTimeout: 2000,
      actionText: 'OK!'
    })
  }
})

// Boton de la camara
// usamos la funcion de fleca para prevenir
// que jQuery me cambie el valor del this
btnPhoto.on('click', () => {
  console.log('Inicializar camara')

  contenedorCamara.toggleClass('oculto')

  camara.encender()
})

// Boton para tomar la foto
btnTomarFoto.on('click', () => {
  foto = camara.tomarFoto()

  camara.apagar()
})

// Share API

timeline.on('click', 'li', function () {
  if (navigator.share) {
    let tipo = $(this).data('tipo')
    let lat = $(this).data('lat')
    let lng = $(this).data('lng')
    let mensaje = $(this).data('mensaje')
    let user = $(this).data('user')

    const shareOpts = {
      title: user,
      text: mensaje
    }

    if (tipo === 'mapa') {
      shareOpts.text = 'Mapa'
      shareOpts.url = `https://www.google.com/maps/@${lat},${lng}`
    }

    navigator.share(shareOpts)
      .then(() => console.log('Successful share'))
      .catch(error => console.log('error sharing: ', error))
  }
})

