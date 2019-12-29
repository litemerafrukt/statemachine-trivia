import { fiftyFifty } from "./fiftyFifty"

const answers = [
  { answer: "Ares", disabled: false },
  { answer: "Athena", correct: true, disabled: false },
  { answer: "Artemis", disabled: false },
  { answer: "Apollo", disabled: false }
]

describe("fiftyFifty", () => {
  test("Answers should be of same length and in same order", () => {
    const result = fiftyFifty(answers)

    expect(answers.length).toBe(result.length)

    for (let i = 0; i < answers.length; i++) {
      expect(answers[i].answer).toBe(result[i].answer)
    }
  })

  test("Correct answer should not be disabled", () => {
    const result = fiftyFifty(answers)

    expect(result).toEqual(
      expect.arrayContaining([
        { answer: "Athena", correct: true, disabled: false }
      ])
    )
  })

  test("Should disable half of the incorrect answers", () => {
    const result = fiftyFifty(answers, item => item)

    const numberOfDisabled = result.reduce(
      (sum, answer) => (answer.disabled ? sum + 1 : sum),
      0
    )

    expect(numberOfDisabled).toBe(2)

    expect(result).toEqual([
      { answer: "Ares", disabled: true },
      { answer: "Athena", correct: true, disabled: false },
      { answer: "Artemis", disabled: true },
      { answer: "Apollo", disabled: false }
    ])
  })
})
