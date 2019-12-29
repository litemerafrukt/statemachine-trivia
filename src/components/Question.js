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
      <h3 style={{ minHeight: "5rem" }}>{question.question}</h3>
      <h4>{time > 0 ? `${time} s` : "Time's up!"}</h4>
      <div
        className={classNames("lifelines", {
          disabled: current.matches("feedback")
        })}
        style={{
          opacity: time > 0 ? "1" : "0.5",
          pointerEvents: time === 0 && "none"
        }}
      >
        <button onClick={() => send("FIFTY_FIFTY")} disabled={!hasFiftyFifty}>
          50/50
        </button>
        <button
          onClick={() => send("ADDITIONAL_TEN")}
          disabled={!hasAdditionalTen}
        >
          +10s
        </button>
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
