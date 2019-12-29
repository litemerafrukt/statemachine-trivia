import { Machine, assign } from "xstate"
import { questionMachine } from "./question"
import { deriveStatistics } from "../utils/deriveStatistics"

export const gameMachine = Machine({
  id: "gameMachine",
  initial: "playing",
  context: {
    hasFiftyFifty: true,
    hasAdditionalTen: true,
    unAnsweredQuestions: [],
    answeredQuestions: []
  },
  states: {
    playing: {
      invoke: {
        id: "question",
        src: questionMachine,
        data: {
          ...questionMachine.initialState.context,
          hasFiftyFifty: context => context.hasFiftyFifty,
          hasAdditionalTen: context => context.hasAdditionalTen,
          question: context => context.unAnsweredQuestions.slice(-1)[0]
        },
        onDone: {
          target: "progress",
          actions: assign({
            unAnsweredQuestions: context =>
              context.unAnsweredQuestions.slice(0, -1),
            hasAdditionalTen: (_, event) => event.data.hasAdditionalTen,
            hasFiftyFifty: (_, event) => event.data.hasFiftyFifty,
            answeredQuestions: (context, event) =>
              context.answeredQuestions.concat(event.data.question)
          })
        }
      }
    },
    progress: {
      on: {
        "": [
          {
            target: "playing",
            cond: context => context.unAnsweredQuestions.length > 0
          },
          { target: "statistics" }
        ]
      }
    },
    statistics: {
      entry: assign({
        statistics: context => deriveStatistics(context.answeredQuestions)
      }),
      on: {
        DONE: "done"
      }
    },
    done: { type: "final" }
  }
})
