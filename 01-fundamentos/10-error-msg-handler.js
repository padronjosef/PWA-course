const URL = 'https://reqres.in/api/users'

fetch(URL + '/1')
  .then(resp => {
    if (resp.ok) {
      return resp.json()
    } else {
      throw new Error('user not found')
    }
  })
  .then(console.log)
  .catch((error) => {
    console.log('Error in the request')
    console.error(error)
  })