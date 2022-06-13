// indexedDB: Reforzamiento
//name  ,  version
let request = window.indexedDB.open('my-database', 1)

// its updates when the DB version is created or updated
request.onupgradeneeded = (event) => {
  console.log('date base update')

  let db = event.target.result;

  db.createObjectStore('heroes', {
    keyPath: 'id'
  })
}

// errors manage
request.onerror = event => {
  console.log('DB error:', event.target.error)
}

// insert data
request.onsuccess = event => {
  let db = event.target.result

  let heroesData = [
    { id: '11', heroe: 'spiderman', message: "here's your friend spidermand" },
    { id: '22', heroe: 'ironman', message: "wearing my brand new Mark 50" },
    { id: '33', heroe: 'hulk', message: "you don't want to make me angry" },
    { id: '44', heroe: 'thor', message: "the most powerfull avanger" },
  ]

  let heroesTransaction = db.transaction('heroes', 'readwrite')

  heroesTransaction.onerror = event => {
    console.log('Error catched: ', event.target.error)
  }

  // feadback about the transaction success
  heroesTransaction.oncomplete = event => {
    console.log('Transaction success: ', event)
  }

  let heroesStore = heroesTransaction.objectStore('heroes')

  for (let hero of heroesData) {
    heroesStore.add(hero)
  }

  heroesStore.onsuccess = event => {
    console.log('New item added to the DB')
  }
}