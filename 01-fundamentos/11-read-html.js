const body = document.querySelector('body')

fetch('not-found.htmla')
  .then(res => {
    if (res.ok) {
      return res.text()
    } else {
      throw new Error('File not found')
    }
  })
  .then(htlml => body.innerHTML = htlml)
  .catch(error => {
    console.log('Error on the requet')
    console.error(error)
  })