const db = new PouchDB('messages')

async function saveMessage(message) {
  message._id = new Date().toISOString()

  return db.put(message).then(() => {
    self.registration.sync.register('new-post')

    const newResp = { ok: true, offline: true }

    return new Response(JSON.stringify(newResp))
  })
}


function postMessages() {
  const posts = []

  return db.allDocs({ includes_docs: true }).then(docs => {
    docs.rows.forEach(row => {
      const doc = row.doc

      const fetchProm = fetch('api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
      }).then(res => {
        return db.remove(doc)
      })

      posts.push(fetchProm)
    })

    return Promise.all(posts)
  })
}