const URL = 'https://reqres.in/api/users'

const user = {
  name: 'jose',
  age: 27
}

fetch(URL, {
  method: 'POST',
  body: JSON.stringify(user),
  headers: {
    'Content-Type': 'application/JSON'
  }
})
  .then(res => res.json())
  .then(console.log)
  .catch((err) => {
    console.log('Error in the petition')
    console.error(err)
  })