
let superman = document.getElementById('superman')

fetch('superman.png')
  .then(resp => resp.blob())
  .then(imagen => {
    const imgPath = URL.createObjectURL(imagen)

    superman.src = imgPath
  })