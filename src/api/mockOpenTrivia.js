import triviaResponse from "./mockresponse/50questions.json"

export const requestQuestions = async () =>
  new Promise(resolve => setTimeout(() => resolve(triviaResponse), 500))
// new Promise((_, reject) =>
//   setTimeout(() => reject({ message: "whatnot" }), 1500)
// )
