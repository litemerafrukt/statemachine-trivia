import { deriveStatistics } from "./deriveStatistics"

const answers = [
  {
    answer: "Gorilla",
    question:
      "What type of animal was Harambe, who was shot after a child fell into it's enclosure at the Cincinnati Zoo?",
    correct: "Gorilla",
    incorrectAlternatives: ["Tiger", "Panda", "Crocodile"]
  },
  {
    answer: "Calvin and Hobbes",
    question:
      "What is the name of the comic about a young boy, and a tiger who is actually a stuffed animal?",
    correct: "Calvin and Hobbes",
    incorrectAlternatives: ["Winnie the Pooh", "Albert and Pogo", "Peanuts"]
  },
  {
    answer: "2004",
    question: 'When was the first "Half-Life" released?',
    correct: "1998",
    incorrectAlternatives: ["2004", "1999", "1997"]
  },
  {
    answer: null,
    question: "What event marked the start of World War II?",
    correct: "Invasion of Poland (1939)",
    incorrectAlternatives: [
      ("Invasion of Russia (1942)",
      "Battle of Britain (1940)",
      "Invasion of Normandy (1944)")
    ]
  }
]

describe("deriveStatistics", () => {
  test("Should have number of correct answers", () => {
    const result = deriveStatistics(answers)

    expect(result).toHaveProperty("corrects", 2)
  })

  test("Should have number of incorrects answers", () => {
    const result = deriveStatistics(answers)

    expect(result).toHaveProperty("incorrects", 1)
  })

  test("Should have number of unanswered", () => {
    const result = deriveStatistics(answers)

    expect(result).toHaveProperty("unanswered", 1)
  })
})
