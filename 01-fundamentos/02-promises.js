function sumOne(num) {
  console.log("🚀 num: ", num)

  const promise = new Promise((resolve, reject) => {
    if (num >= 5) return reject(`${num} Num Too high`)

    setTimeout(() => resolve(num + 1), 200)
  });

  return promise;
}

// sumOne(3)
//   .then(value => {
//     console.log("🚀value 1: ", value)
//     return sumOne(value)
//   })
//   .then(value2 => {
//     console.log("🚀value 2: ", value2)
//     return sumOne(value2)
//   })
//   .then(value3 => {
//     console.log("🚀value 3: ", value3)
//   })

// short hard
sumOne(1)
  .then(sumOne)
  .then(sumOne)
  .then(sumOne)
  .then(sumOne)
  .then(sumOne)
  .then(sumOne)
  .catch(err => console.error("💥 Error in Promise: ", err))