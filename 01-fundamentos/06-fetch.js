// const URL = 'https://reqres.in/api/users'
// fetch(URL)
//   .then((res) => res.json())
//   .then((resObj) => {
//     console.log('data: ', resObj.data)
//     console.log('page: ', resObj.page)
//     console.log('per_page: ', resObj.per_page)
//   })

// active plugging disable CORS to be able to use this line
const URL = 'https://www.wikipedia.org/'
fetch(URL)
  .then((res) => res.text())
  .then((html) => {
    document.open()
    document.write(html)
    document.close()
  })