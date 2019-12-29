import pipe from "callbag-pipe"
import { randomizeArray } from "./randomizeArray"

const reduceToIndexesOfIncorrect = answers =>
  answers.reduce((indexes, answer, i) => {
    if (!answer.correct) {
      indexes.push(i)
    }

    return indexes
  }, [])

const takeFirstHalfOfArray = array =>
  array.slice(0, Math.ceil(array.length / 2))

export const fiftyFifty = (answers, randomize = randomizeArray) => {
  const indexesToBeDisabled = pipe(
    answers,
    reduceToIndexesOfIncorrect,
    randomize,
    takeFirstHalfOfArray
  )

  return answers.map((answer, i) => {
    if (indexesToBeDisabled.some(index => index === i)) {
      return { ...answer, disabled: true }
    }

    return answer
  })
}
