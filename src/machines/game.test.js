import { Machine, interpret } from "xstate"
import { gameMachine } from "./game"

const mockQuestionMachine = Machine({
  id: "mockQuestionMachine",
  initial: "initial",
  context: {
    question: null
  },
  states: {
    initial: {
      on: { "": "done" }
    },
    done: {
      type: "final",
      data: context => ({ ...context })
    }
  }
})

const answeredQuestion = {
  answer: "Calvin and Hobbes",
  question:
    "What is the name of the comic about a young boy, and a tiger who is actually a stuffed animal?",
  correct: "Calvin and Hobbes",
  incorrectAlternatives: ["Winnie the Pooh", "Albert and Pogo", "Peanuts"]
}

describe("gameMachine", () => {
  const gameMachineWithContext = gameMachine
    .withConfig({
      services: { questionMachine: mockQuestionMachine }
    })
    .withContext({
      ...gameMachine.initialState.context,
      unAnsweredQuestions: [answeredQuestion, answeredQuestion]
    })

  test('should be in "statistics" after answering all questions', done => {
    interpret(gameMachineWithContext)
      .onTransition(state => {
        if (state.matches("statistics")) {
          expect(state.context.statistics).toEqual({
            corrects: 2,
            incorrects: 0,
            unanswered: 0
          })

          done()
        }
      })
      .start()
  })

  test("should iterate over all questions in a game", done => {
    let numberOfPlayingStates = 0

    interpret(gameMachineWithContext)
      .onTransition(state => {
        if (state.matches("playing")) {
          numberOfPlayingStates += 1
        }

        if (state.matches("statistics")) {
          expect(numberOfPlayingStates).toBe(2)
          expect(state.context.unAnsweredQuestions).toHaveLength(0)
          expect(state.context.answeredQuestions).toHaveLength(2)
          done()
        }
      })
      .start()
  })

  test("machine should be done after sending done to machine in statistics state", done => {
    const game = interpret(gameMachineWithContext)

    game
      .onTransition(state => {
        if (state.matches("statistics")) {
          game.send("DONE")
        }

        if (state.matches("done")) {
          expect(state.done).toBe(true)

          done()
        }
      })
      .start()
  })
})
