import { normalizeOpenTrivia } from "./normalizeOpenTrivia"

const openTriviaQuestion = {
  category: "Entertainment%3A%20Comics",
  type: "multiple",
  difficulty: "medium",
  question:
    "What%20is%20the%20name%20of%20the%20comic%20about%20a%20young%20boy%2C%20and%20a%20tiger%20who%20is%20actually%20a%20stuffed%20animal%3F",
  correct_answer: "Calvin%20and%20Hobbes",
  incorrect_answers: ["Winnie%20the%20Pooh", "Albert%20and%20Pogo", "Peanuts"]
}

describe("normalizeOpenTrivia", () => {
  test("Should produce object with specified fields", () => {
    const result = normalizeOpenTrivia(openTriviaQuestion)

    expect(result).toEqual({
      question:
        "What is the name of the comic about a young boy, and a tiger who is actually a stuffed animal?",
      correct: "Calvin and Hobbes",
      incorrectAlternatives: expect.arrayContaining([
        "Winnie the Pooh",
        "Albert and Pogo",
        "Peanuts"
      ])
    })
  })
})
