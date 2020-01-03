import React from "react"
import { useService } from "@xstate/react"
import classNames from "classnames"

export const Question = ({ questionService }) => {
  const [current, send] = useService(questionService)
  const {
    question,
    answerAlternatives,
    hasFiftyFifty,
    hasAdditionalTen,
    time,
    answer: playerAnswer
  } = current.context

  return (
    <div>
      <div className="question">
        <h3>{question.question}</h3>
      </div>
      <div className="question-action-area bordered">
        <span className="time">{time > 0 ? `${time} s` : "Time's up!"}</span>
        <div
          className={classNames("lifelines", {
            disabled: current.matches("feedback")
          })}
        >
          <button
            onClick={() => send("FIFTY_FIFTY")}
            disabled={!hasFiftyFifty}
            className={classNames({
              disabled: !hasFiftyFifty
            })}
          >
            50/50
          </button>
          <button
            onClick={() => send("ADDITIONAL_TEN")}
            disabled={!hasAdditionalTen}
            className={classNames({
              disabled: !hasAdditionalTen
            })}
          >
            +10s
          </button>
        </div>
      </div>
      <div
        className={classNames({ "no-pointer": current.matches("feedback") })}
      >
        <div className="answers">
          {answerAlternatives.map(answer => (
            <div
              key={answer.alternative}
              onClick={() =>
                send({ type: "ANSWER", answer: answer.alternative })
              }
              className={classNames("answer", {
                "disabled-answer": answer.disabled,
                "feedback-chosen":
                  current.matches("feedback") &&
                  playerAnswer === answer.alternative,
                "feedback-correct":
                  current.matches("feedback") && answer.correct
              })}
            >
              {answer.alternative}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
