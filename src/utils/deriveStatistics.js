export const deriveStatistics = answers => ({
  corrects: answers.filter(answer => answer.answer === answer.correct).length,
  incorrects: answers.filter(
    answer => answer.answer !== answer.correct && answer.answer != null
  ).length,
  unanswered: answers.filter(answer => answer.answer == null).length
})
