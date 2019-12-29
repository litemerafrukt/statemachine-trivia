import React from "react"
import { useService } from "@xstate/react"
import { Question } from "./Question"

export const Game = ({ gameService }) => {
  const [current, send] = useService(gameService)
  const { answeredQuestions, statistics } = current.context

  switch (current.value) {
    case "playing":
      return <Question questionService={current.children.question} />
    case "statistics":
      return (
        <div>
          <h2>Statistics</h2>
          <p>
            Correct: {statistics.corrects}/{answeredQuestions.length}
          </p>
          <p>
            Incorrect: {statistics.incorrects}/{answeredQuestions.length}
          </p>
          <p>
            Unanswered: {statistics.unanswered}/{answeredQuestions.length}
          </p>
          <button onClick={() => send("DONE")}>Play again</button>
          <ul style={{ listStyle: "none" }}>
            {answeredQuestions.map(question => (
              <li key={question.question}>
                <h4>{question.question}</h4>
                <p>Your answer: {question.answer ?? "no answer"}</p>
                <p>Correct answer: {question.correct}</p>
              </li>
            ))}
          </ul>
        </div>
      )
    case "progress":
      return null
    default:
      throw new Error("This is a state that should not be")
  }
}
