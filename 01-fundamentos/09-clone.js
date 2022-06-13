const URL = 'https://reqres.in/api/users'

fetch(URL + '/1')
  .then(resp => {

    resp.clone().json()
      .then(user => console.log(user.data))

    resp.clone().json()
      .then(user => console.log(user.data))

    resp.json()
      .then(user => console.log(user.data))

  })