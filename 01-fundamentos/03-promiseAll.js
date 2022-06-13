
const returnTrue = () => {
  return true
}

const sumSlow = (num) => {
  return new Promise((res, rej) => {
    if (num >= 10) return rej(`Sum slow fail`)
    setTimeout(() => res(num + 1), 800)
  })
}

const sumFast = (num) => {
  return new Promise((res, rej) => {
    if (num >= 20) return rej(`Sum fast fail`)
    setTimeout(() => res(num + 1), 300)
  })
}

const arrayOfThings = [sumSlow(5), sumFast(10), true, 'anything', returnTrue()]

// if only one of them fail, all will be rejected
Promise.all(arrayOfThings)
  .then(console.log)
  .catch(console.error)

// sumSlow(5).then(console.log)
// sumFast(10).then(console.log)