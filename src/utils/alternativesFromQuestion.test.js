import { alternativesFromQuestion } from "./alternativesFromQuestion"

const normalizedQuestion = {
  question:
    "This Greek mythological figure is the god/goddess of battle strategy (among other things).",
  correct: "Athena",
  incorrectAlternatives: ["Ares", "Artemis", "Apollo"]
}

describe("alternativesFromQuestion", () => {
  test("Should produce array with alternative objects", () => {
    const result = alternativesFromQuestion(normalizedQuestion)

    expect(result).toEqual(
      expect.arrayContaining([
        { alternative: "Ares", disabled: false },
        { alternative: "Athena", correct: true, disabled: false },
        { alternative: "Artemis", disabled: false },
        { alternative: "Apollo", disabled: false }
      ])
    )
    expect(result).toHaveLength(4)
  })
})
