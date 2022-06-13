// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
  if (res.ok) {
    return caches.open(dynamicCache).then(cache => {
      cache.put(req, res.clone())

      return res.clone()
    })

  } else return res
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
  if (APP_SHELL_INMUTABLE.includes(req.url)) {
    // No hace falta actualizar el inmutable
  } else {
    return fetch(req)
      .then(res => {
        return actualizaCacheDinamico(staticCache, req, res)
      })
  }
}

// Network with cache fullback / update
function apiMessagesApi(cacheName, req) {
  if (req.clone().method === 'POST') {
    if (self.registration.sync) {
      return req.clone().text().then(body => {
        const bodyObj = JSON.parse(body)
        return saveMessage(bodyObj)
      })
    }

    return fetch(req)

  } else {
    return fetch(req).then(res => {
      if (res.ok) {
        actualizaCacheDinamico(cacheName, req, res.clone())
        return res.clone()
      }
      caches.match(req)
    }).catch(err => caches.match(req))
  }
}