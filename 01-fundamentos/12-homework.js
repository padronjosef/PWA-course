// Tarea sobre promesas y fetch
// Realice resolución de cada ejercicio,

// compruebe el resultado en la consola y posteriormente
// siga con el siguiente.

// Comente TODO el código del ejercicio anterior
// antes de continuar con el siguiente.

// ==============================================
// Ejercicio #1
// ==============================================
/*
 Realizar un llamado FETCH a la siguiente API
 https://swapi.dev/api/people/1/
 Imprima en consola el nombre y género de la persona.
*/

// Resolución de la tarea #1

// const URL = 'https://swapi.dev/api/people/1/'

// fetch(URL)
//   .then(res => res.json())
//   .then(data => console.log('name: ',data.name, ' , ','gender: ', data.gender))


// ==============================================
// Ejercicio #2
// ==============================================
/*
 Similar al ejercicio anterior... haga un llamado a la misma api
 (puede reutilizar el código )
 https://swapi.dev/api/people/1/

 Pero con el nombre y el género, haga un posteo
 POST a: https://reqres.in/api/users

 Imprima en consola el objeto y asegúrese que tenga
 el ID y la fecha de creación del objeto
*/

// Resolución de la tarea #2
const SW_API = 'https://swapi.dev/api/people/1/'
const REQRES = 'https://reqres.in/api/users'

const postData = ({ name, gender }) => (
  fetch(REQRES, ({
    method: 'POST',
    body: JSON.stringify({
      name: name,
      gender: gender,
    }),
    headers: { 'Content-Type': 'application/JSON' }
  }))
)

fetch(SW_API)
  .then(res => res.json())
  .then(postData)
  .then(res => res.json())
  .then(console.log)
  .catch(console.error)
