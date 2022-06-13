let swReg

if (navigator.serviceWorker) {
  const url = window.location.href

  const swLocation = url.includes('localhost')
    ? '/sw.js'
    : '/twittor/sw.js'


  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swLocation)
      .then((reg) => {
        swReg = reg
        swReg.pushManager.getSubscription()
          .then(verifySuscripction)
      })
  })
}

// Referencias de jQuery
const titulo = $('#titulo')
const nuevoBtn = $('#nuevo-btn')
const salirBtn = $('#salir-btn')
const cancelarBtn = $('#cancel-btn')
const postBtn = $('#post-btn')
const avatarSel = $('#seleccion')
const timeline = $('#timeline')

const modal = $('#modal')
const modalAvatar = $('#modal-avatar')
const avatarBtns = $('.seleccion-avatar')
const txtMensaje = $('#txtMensaje')

const btnActivadas = $('.btn-noti-activadas')
const btnDesactivadas = $('.btn-noti-desactivadas')

// El usuario, contiene el ID del heroe seleccionado
let usuario

// ===== Codigo de la aplicación
function crearMensajeHTML(mensaje, personaje) {
  const content = `
    <li class="animated fadeIn fast">
      <div class="avatar">
        <img src="img/avatars/${personaje}.jpg">
      </div>

      <div class="bubble-container">
        <div class="bubble">
          <h3>@${personaje}</h3>
          <br/>
          ${mensaje}
        </div>

        <div class="arrow"></div>
      </div>
    </li>
  `
  timeline.prepend(content)
  cancelarBtn.click()
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass('oculto')
    salirBtn.removeClass('oculto')
    timeline.removeClass('oculto')
    avatarSel.addClass('oculto')
    return modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg')
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
nuevoBtn.on('click', () => {
  modal.removeClass('oculto')
  modal.animate({
    marginTop: '-=1000px',
    opacity: 1
  }, 200)
})

// Boton de cancelar mensaje
cancelarBtn.on('click', () => {
  if (!modal.hasClass('oculto')) {
    modal.animate({
      marginTop: '+=1000px',
      opacity: 0
    }, 200, function () {
      modal.addClass('oculto')
      txtMensaje.val('')
    })
  }
})

// Boton de enviar mensaje
postBtn.on('click', () => {
  const mensaje = txtMensaje.val()

  if (!mensaje.length) return cancelarBtn.click()

  const data = { mensaje: mensaje, user: usuario }

  fetch('api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => console.log('app.js', res))
    .catch(err => console.log('app.js error:', err))

  crearMensajeHTML(mensaje, usuario)
})

// Obtener mensajes del servidor
function getMensajes() {
  fetch('api')
    .then(res => res.json())
    .then(posts => {
      // console.log(posts)
      posts.forEach(post => crearMensajeHTML(post.mensaje, post.user))
    })
}

getMensajes()

// Detectar cambios de conexión
function isOnline() {
  // tenemos conexión
  if (navigator.onLine) {
    $.mdtoast('Online', { interaction: true, interactionTimeout: 1000, actionText: 'OK!' })
    return
  }
  // No tenemos conexión
  $.mdtoast('Offline', { interaction: true, actionText: 'OK', type: 'warning' })
}

window.addEventListener('online', isOnline)
window.addEventListener('offline', isOnline)

isOnline()


function sendNotification() {
  const notificationsOpts = {
    body: 'this is the body of the notification',
    icon: 'img/icons/icon-72x72.png'
  }

  const notificationTemplate = new Notification('hi world', notificationsOpts)

  notificationTemplate.onclick = () => {
    console.log('clicky click')
  }
}

function verifySuscripction(suscription) {
  if (suscription) {
    btnActivadas.removeClass('oculto')
    btnDesactivadas.addClass('oculto')
    return
  }
  btnActivadas.addClass('oculto')
  btnDesactivadas.removeClass('oculto')
}

// Notifications
function notifyMe() {
  if (!window.Notification) {
    console.log("this browser doesn't support notifications")
    return
  }

  if (Notification.permission === "granted") {
    // new Notification('Notifications are active in this page')
    sendNotification()
  }

  if (Notification.permission !== "denied" || Notification.permission === "default") {
    Notification.requestPermission(permission => {
      console.log(permission)

      if (permission === 'granted') {
        // new Notification('Notifications were active!')
        sendNotification()
      }
    })
  }
}

// notifyMe()

// Get Key
async function getPublicKey() {
  return fetch('api/key')
    .then(res => res.arrayBuffer())
    .then(key => new Uint8Array(key))
}

btnDesactivadas.on('click', () => {
  if (!swReg) return console.log("There's no sw register")
  getPublicKey()
    .then(key => {
      swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key
      })
        .then(res => res.toJSON())
        .then(suscription => {
          fetch('api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suscription)
          })
            .then(verifySuscripction)
            .catch(cancelarSuscripcion)
        })
    })
})

function cancelarSuscripcion() {
  swReg.pushManager.getSubscription()
    .then(subs => subs.unsubscribe()
      .then(_ => verifySuscripction(false))
    )
}

btnActivadas.on('click', () => cancelarSuscripcion())
