const request = new XMLHttpRequest()

request.open('GET', 'https://reqres.in/api/users', true)
request.send(null)

request.onreadystatechange = () => {
  if( request.readyState === 4) {
    const response = request.response
    const data = JSON.parse(response)
    console.log("🚀 ~ file: fetch.js ~ line 10 ~ data", data)
  }
}