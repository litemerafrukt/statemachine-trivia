import { randomizeArray } from "./randomizeArray"

describe("randomizeArray", () => {
  test("Should not alter argument", () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const result = randomizeArray(original)

    expect(result).not.toBe(original)
  })

  test("Original and result should be same length and contain same items", () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const result = randomizeArray(original)

    expect(result.length).toBe(original.length)
    expect(result).toEqual(expect.arrayContaining(original))
  })

  // Due to the nature of randomness this might fail on rear occasions
  // just because the random array scrambles to the same order
  test("Original and result should differ in order (might fail in rear occasions)", () => {
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    const result = randomizeArray(original)

    expect(result).not.toEqual(original)
  })
})
