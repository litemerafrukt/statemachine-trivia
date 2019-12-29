export const randomizeArray = array => {
  const randomArray = [...array]

  for (let i = randomArray.length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * i)
    ;[randomArray[randomIndex], randomArray[i]] = [
      randomArray[i],
      randomArray[randomIndex]
    ]
  }

  return randomArray
}
