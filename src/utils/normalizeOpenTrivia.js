export const normalizeOpenTrivia = question => ({
  question: decodeURIComponent(question.question),
  correct: decodeURIComponent(question.correct_answer),
  incorrectAlternatives: [...question.incorrect_answers].map(decodeURIComponent)
})
