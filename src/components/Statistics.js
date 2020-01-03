import React from "react"

export const Statistics = ({ statistics, answeredQuestions, onPlayAgain }) => (
  <div className="statistics">
    <div className="statistics-summary">
      <div>
        <p>
          Correct: {statistics.corrects}/{answeredQuestions.length}
        </p>
        <p>
          Incorrect: {statistics.incorrects}/{answeredQuestions.length}
        </p>
        <p>
          Unanswered: {statistics.unanswered}/{answeredQuestions.length}
        </p>
      </div>
      <button className="play-again-button" onClick={onPlayAgain}>
        Play again
      </button>
    </div>
    <ul className="answered-questions-list">
      {answeredQuestions.map(question => (
        <li key={question.question}>
          <h4 className="answered-question-heading">{question.question}</h4>
          <p>Your answer: {question.answer ?? "no answer"}</p>
          <p>Correct answer: {question.correct}</p>
        </li>
      ))}
    </ul>
  </div>
)
