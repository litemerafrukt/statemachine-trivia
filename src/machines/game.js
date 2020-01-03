import { Machine, assign } from "xstate"
import { questionMachine } from "./question"
import { deriveStatistics } from "../utils/deriveStatistics"

export const gameMachine = Machine(
  {
    id: "game",
    initial: "playing",
    context: {
      hasFiftyFifty: true,
      hasAdditionalTen: true,
      unAnsweredQuestions: [],
      answeredQuestions: [],
      statistics: null
    },
    states: {
      playing: {
        invoke: {
          id: "question",
          src: "questionMachine",
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
              hasFiftyFifty: (_, event) => event.data.hasFiftyFifty,
              hasAdditionalTen: (_, event) => event.data.hasAdditionalTen,
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
              cond: "hasQuestions"
            },
            { target: "statistics" }
          ]
        }
      },
      statistics: {
        entry: "deriveStatistics",
        on: {
          DONE: "done"
        }
      },
      done: { type: "final" }
    }
  },
  {
    services: {
      questionMachine: questionMachine
    },
    actions: {
      deriveStatistics: assign({
        statistics: context => deriveStatistics(context.answeredQuestions)
      })
    },
    guards: {
      hasQuestions: context => context.unAnsweredQuestions.length > 0
    }
  }
)
