import { Machine, assign, sendParent } from "xstate"
import { alternativesFromQuestion } from "../utils/alternativesFromQuestion"
import { fiftyFifty } from "../utils/fiftyFifty"

const tickService = Machine({
  id: "tickService",
  initial: "tick",
  states: {
    tick: {
      after: {
        1000: "tick"
      },
      exit: sendParent("TICK")
    }
  }
})

export const questionMachine = Machine(
  {
    id: "questionMachine",
    initial: "initial",
    context: {
      hasFiftyFifty: null,
      hasAdditionalTen: null,
      question: null,
      answer: null,
      answerAlternatives: [],
      time: 15
    },
    states: {
      initial: {
        on: {
          "": {
            target: "constructAnswerAlternatives"
          }
        }
      },
      constructAnswerAlternatives: {
        on: {
          "": {
            actions: "constructAnswerAlternatives",
            target: "answering"
          }
        }
      },
      answering: {
        invoke: {
          id: "ticker",
          src: tickService
        },
        on: {
          FIFTY_FIFTY: {
            actions: "fiftyFifty"
          },
          ADDITIONAL_TEN: {
            actions: "additionalTen"
          },
          ANSWER: {
            target: "feedback",
            actions: "answer"
          },
          TICK: {
            actions: "countdown"
          },
          "": {
            target: "feedback",
            cond: context => context.time <= 0
          }
        }
      },
      feedback: {
        after: {
          1000: "done"
        }
      },
      done: {
        type: "final",
        data: {
          hasFiftyFifty: context => context.hasFiftyFifty,
          hasAdditionalTen: context => context.hasAdditionalTen,
          question: context => ({ answer: context.answer, ...context.question })
        }
      }
    }
  },
  {
    actions: {
      constructAnswerAlternatives: assign({
        answerAlternatives: context =>
          context.question && alternativesFromQuestion(context.question)
      }),
      fiftyFifty: assign({
        answerAlternatives: context =>
          context.hasFiftyFifty
            ? fiftyFifty(context.answerAlternatives)
            : context.answerAlternatives,
        hasFiftyFifty: false
      }),
      additionalTen: assign({
        time: context =>
          context.hasAdditionalTen ? context.time + 10 : context.time,
        hasAdditionalTen: false
      }),
      countdown: assign({
        time: context => context.time - 1
      }),
      answer: assign({
        answer: (_, event) => event.answer
      })
    }
  }
)
