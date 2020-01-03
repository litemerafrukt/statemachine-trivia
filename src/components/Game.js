import React from "react"
import { useService } from "@xstate/react"
import { Question } from "./Question"
import { Statistics } from "./Statistics"

export const Game = ({ gameService }) => {
  const [current, send] = useService(gameService)

  switch (current.value) {
    case "playing":
      return <Question questionService={current.children.question} />
    case "statistics":
      return (
        <Statistics
          statistics={current.context.statistics}
          answeredQuestions={current.context.answeredQuestions}
          onPlayAgain={() => send("DONE")}
        />
      )
    case "progress":
      return null
    default:
      throw new Error("This is a state that should not be")
  }
}
