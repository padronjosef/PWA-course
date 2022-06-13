function sumOne(num, callback) {
  if (num >= 5) return callback(`${num} Num Too high`)

  setTimeout(() => {
    callback(null, num + 1)
  }, 200)
}

sumOne(3, (error, newValue) => {
  if (error) return console.log("💥 error 1: ", error)
  console.log("🚀 New Value 1: ", newValue)

  sumOne(newValue, (error, newValue2) => {
    if (error) return console.log("💥 error 2: ", error)
    console.log("🚀 New Value 2: ", newValue2)

    sumOne(newValue2, (error, newValue3) => {
      if (error) return console.log("💥 error 3: ", error)
      console.log("🚀 New Value 3: ", newValue3)
    })

  })

})