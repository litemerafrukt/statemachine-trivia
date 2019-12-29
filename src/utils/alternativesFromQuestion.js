import { randomizeArray } from "./randomizeArray"

export const alternativesFromQuestion = question => {
  const alternatives = [...question.incorrectAlternatives]
    .map(alternative => ({ alternative, disabled: false }))
    .concat({
      alternative: question.correct,
      disabled: false,
      correct: true
    })

  return randomizeArray(alternatives)
}
