import { Machine, assign } from "xstate"
import { randomizeArray } from "../utils/randomizeArray"
import { normalizeOpenTrivia } from "../utils/normalizeOpenTrivia"
import { requestQuestions } from "../api/mockOpenTrivia"
import { gameMachine } from "./game"

const NUMBER_OF_QUESTIONS = 10

export const appMachine = Machine(
  {
    id: "appMachine",
    initial: "initial",
    context: {
      questions: [],
      fetchError: ""
    },
    states: {
      initial: {
        invoke: {
          id: "fetchQuestions",
          src: "requestQuestions",
          onDone: {
            target: "ready",
            actions: "fetchQuestionsSuccess"
          },
          onError: {
            target: "initiationFailed",
            actions: "fetchQuestionsError"
          }
        }
      },
      initiationFailed: {
        on: { RETRY_INITIATION: "initial" }
      },
      ready: {
        on: {
          "": {
            target: "initial",
            cond: context => context.questions < NUMBER_OF_QUESTIONS
          },
          PLAY: "playing"
        }
      },
      playing: {
        invoke: {
          id: "game",
          src: gameMachine,
          data: {
            ...gameMachine.initialState.context,
            unAnsweredQuestions: context =>
              context.questions.slice(-NUMBER_OF_QUESTIONS)
          },
          onDone: {
            target: "ready",
            actions: assign({
              questions: context =>
                context.questions.slice(0, -NUMBER_OF_QUESTIONS)
            })
          }
        }
      }
    }
  },
  {
    services: {
      requestQuestions: requestQuestions
    },
    actions: {
      fetchQuestionsSuccess: assign({
        questions: (_, event) =>
          randomizeArray(event.data.results).map(normalizeOpenTrivia)
      }),
      fetchQuestionsError: assign({
        fetchError: (_, event) => event.data
      })
    }
  }
)
