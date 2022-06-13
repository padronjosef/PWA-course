
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

// return the fastest
// if two of then response at the same time, will be return the one that was declared first
// it doesn't matter if one of them fails if the fastest one could resolve
Promise.race([sumSlow(5), sumFast(10)])
  .then(console.log)
  .catch(console.error)