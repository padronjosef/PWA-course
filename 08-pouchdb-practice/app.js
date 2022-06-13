// Entrenamiento PouchDB

// 1- Crear la base de datos
// Nombre:  mensajes
let db = new PouchDB('mensajes')
let remoteCouch = false

// Objeto a grabar en base de datos
let mensaje = {
  _id: new Date().toISOString(),
  user: 'spiderman',
  mensaje: 'Mi tía hizo unos panqueques muy buenos',
  sincronizado: false
};

// 2- Insertar en la base de datos
// db.put(mensaje)
//   .then(console.log('Successfully posted a todo!'))
//   .catch(console.log)

// 3- Leer todos los mensajes offline
db.allDocs({ include_docs: true, descending: true })
  .then(doc => console.log('mensajes', doc.rows))

// 4- Cambiar el valor 'sincronizado' de todos los objetos
//  en la BD a TRUE
// db.allDocs({ include_docs: true, descending: true })
//   .then(docs => {
//     docs.rows.forEach((row, index) => {
//       let doc = row.doc
//       doc.sincronizado = false
//       db.put(doc)
//     })
//   })

// 5- Borrar todos los registros, uno por uno, evaluando
// cuales no estan sincronizados
// deberá de comentar todo el código que actualiza
// el campo de la sincronización 
db.allDocs({ include_docs: true, descending: true })
  .then(docs => {
    docs.rows.forEach(row => {
      let doc = row.doc
      if (!doc.sincronizado) db.remove(doc)
    })
  })
