if (navigator.serviceWorker) {
  navigator.serviceWorker.register('sw.js')
}

// Referencias de jQuery
let titulo = $('#titulo')
let nuevoBtn = $('#nuevo-btn')
let salirBtn = $('#salir-btn')
let cancelarBtn = $('#cancel-btn')
let postBtn = $('#post-btn')
let avatarSel = $('#seleccion')
let timeline = $('#timeline')

let modal = $('#modal')
let modalAvatar = $('#modal-avatar')
let avatarBtns = $('.seleccion-avatar')
let txtMensaje = $('#txtMensaje')

// El user, contiene el ID del hÃ©roe seleccionado
let user

// ===== Codigo de la aplicaciÃ³n
function crearMensajeHTML(mensaje, personaje) {
  let content = `
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
    modalAvatar.attr('src', 'img/avatars/' + user + '.jpg')
  } else {
    nuevoBtn.addClass('oculto')
    salirBtn.addClass('oculto')
    timeline.addClass('oculto')
    avatarSel.removeClass('oculto')

    titulo.text('Seleccione Personaje')
  }
}

// Seleccion de personaje
avatarBtns.on('click', function () {
  user = $(this).data('user')
  titulo.text('@' + user)
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
    }, 200, () => {
      modal.addClass('oculto')
      txtMensaje.val('')
    })
  }
})

// Boton de enviar mensaje
postBtn.on('click', function () {
  const message = txtMensaje.val()
  if (!message.length) return cancelarBtn.click()

  const data = { message, user }

  fetch('api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(res => console.log('data', res))
    .catch(err => console.log('💥 error: ', err))

  crearMensajeHTML(message, user)
})

// get messages of the server
async function getMessage() {
  const data = await fetch('api')
  const posts = await data.json()

  posts.forEach(({ message, user }) => crearMensajeHTML(message, user))
}

getMessage()

function showToast() {
  const onLine = navigator.onLine
  const options = {
    interaction: true,
    interactionTimeout: 2000,
    actionText: 'OK',
    type: onLine
      ? mdtoast.SUCCESS
      : mdtoast.ERROR
  }

  // const alarm = new Audio("../alarm.mp3", 100, true)
  // alarm.play()

  mdtoast(onLine ? 'Online' : 'Offline', { ...options })
}

window.addEventListener('online', showToast)
window.addEventListener('offline', showToast)