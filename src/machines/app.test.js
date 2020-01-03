import { Machine, interpret } from "xstate"
import { appMachine } from "./app"

const question = {
  category: "Entertainment%3A%20Comics",
  type: "multiple",
  difficulty: "medium",
  question:
    "What%20is%20the%20name%20of%20the%20comic%20about%20a%20young%20boy%2C%20and%20a%20tiger%20who%20is%20actually%20a%20stuffed%20animal%3F",
  correct_answer: "Calvin%20and%20Hobbes",
  incorrect_answers: ["Winnie%20the%20Pooh", "Albert%20and%20Pogo", "Peanuts"]
}

const questions = Array.from({ length: 10 }, () => question)

const mockGameMachine = Machine({
  id: "mockQuestionMachine",
  initial: "initial",
  states: {
    initial: {
      after: { 1: "done" }
    },
    done: {
      type: "final"
    }
  }
})

const successAppMachine = appMachine.withConfig({
  services: {
    requestQuestions: () => Promise.resolve({ results: [...questions] }),
    gameMachine: mockGameMachine
  }
})

const failAppMachine = appMachine.withConfig({
  services: {
    requestQuestions: () => Promise.reject("no questions for you"),
    gameMachine: mockGameMachine
  }
})

describe("app", () => {
  test("should be in ready state on successful question fetch", done => {
    interpret(successAppMachine)
      .onTransition(state => {
        if (state.matches("ready")) {
          expect(state.context.questions).toHaveLength(questions.length)

          done()
        }
      })
      .start()
  })

  test("should be in initiationFailed state if fetch questions failed", done => {
    interpret(failAppMachine)
      .onTransition(state => {
        if (state.matches("initiationFailed")) {
          expect(state.context.fetchError).toBe("no questions for you")
          expect(state.nextEvents).toContain("RETRY_INITIATION")

          done()
        }
      })
      .start()
  })

  test("should transition to playing state on PLAY", done => {
    const app = interpret(successAppMachine)

    app
      .onTransition(state => {
        if (state.matches("ready")) {
          app.send("PLAY")
        }

        if (state.matches("playing")) {
          expect(state.children.game).not.toBeUndefined()

          done()
        }
      })
      .start()
  })

  test("should return to ready state after play", done => {
    let havePlayed = false
    const app = interpret(successAppMachine)

    app
      .onTransition(state => {
        if (state.matches("ready")) {
          app.send("PLAY")
          havePlayed = true
        }

        if (state.matches("ready") && havePlayed) {
          expect(state.context.questions).toHaveLength(10)

          done()
        }
      })
      .start()
  })

  test("should re-fetch questions when questions run out", done => {
    let havePlayedAndDepletedAllQuestions = false
    const app = interpret(successAppMachine)

    app
      .onTransition(state => {
        if (state.matches("ready")) {
          app.send("PLAY")
          havePlayedAndDepletedAllQuestions = true
        }

        if (state.matches("initial") && havePlayedAndDepletedAllQuestions) {
          expect(state.context.questions).toHaveLength(0)

          done()
        }
      })
      .start()
  })
})
