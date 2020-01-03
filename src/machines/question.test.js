import { Machine, sendParent, interpret } from "xstate"
import { questionMachine } from "./question"

const mockTickMachine = Machine({
  id: "mockTickService",
  initial: "tick",
  states: {
    tick: {
      after: {
        1: "stopped"
      },
      exit: sendParent("TICK")
    },
    stopped: {
      on: {
        TICK: "tick"
      }
    }
  }
})

const question = {
  answer: "Calvin and Hobbes",
  question:
    "What is the name of the comic about a young boy, and a tiger who is actually a stuffed animal?",
  correct: "Calvin and Hobbes",
  incorrectAlternatives: ["Winnie the Pooh", "Albert and Pogo", "Peanuts"]
}

const questionMachineWithContext = questionMachine
  .withConfig({
    services: { tickMachine: mockTickMachine },
    delays: { FEEDBACK_DELAY: 1 }
  })
  .withContext({
    hasFiftyFifty: true,
    hasAdditionalTen: true,
    question: question,
    answer: null,
    answerAlternatives: [],
    time: 1
  })

describe("questionMachine", () => {
  test("should construct answer alternatives", done => {
    interpret(questionMachineWithContext)
      .onTransition(state => {
        if (state.matches("answering")) {
          expect(state.context.answerAlternatives).toHaveLength(4)

          done()
        }
      })
      .start()
  })

  test("should progress to answering state when started", done => {
    interpret(questionMachineWithContext)
      .onTransition(state => {
        if (state.matches("answering")) {
          expect(state.context.answer).toBe(null)

          done()
        }
      })
      .start()
  })

  test("should accept and store answer", done => {
    const answer = "Calvin and Hobbes"
    const question = interpret(questionMachineWithContext)

    question
      .onTransition(state => {
        if (state.matches("answering")) {
          question.send({ type: "ANSWER", answer })
        }

        if (state.matches("done")) {
          expect(state.context.answer).toBe(answer)

          done()
        }
      })
      .start()
  })

  test("should have feedback state", done => {
    const answer = "Calvin and Hobbes"
    const question = interpret(questionMachineWithContext)

    question
      .onTransition(state => {
        if (state.matches("answering")) {
          question.send({ type: "ANSWER", answer })
        }

        if (state.matches("feedback")) {
          expect(state.context.answer).toBe(answer)

          done()
        }
      })
      .start()
  })

  test("should progress to done with no answer if time runs out", done => {
    interpret(questionMachineWithContext)
      .onTransition(state => {
        if (state.matches("done")) {
          expect(state.context.answer).toBe(null)

          done()
        }
      })
      .start()
  })

  test("should handle using lifelines", done => {
    const question = interpret(questionMachineWithContext)
    let hasSentLifelines = false

    question
      .onTransition(state => {
        if (state.matches("answering") && !hasSentLifelines) {
          hasSentLifelines = true
          expect(state.context.hasAdditionalTen).toBe(true)
          expect(state.context.hasFiftyFifty).toBe(true)

          question.send("ADDITIONAL_TEN")
          question.send("FIFTY_FIFTY")
          question.send({ type: "ANSWER", answer: "" })
        }

        if (state.matches("done")) {
          expect(state.context.hasAdditionalTen).toBe(false)
          expect(state.context.hasFiftyFifty).toBe(false)

          done()
        }
      })
      .start()
  })
})
