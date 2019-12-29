import { interpret, assign } from "xstate"
import { fetchMachine } from "./fetch"

const mockFetchSuccess = async () => "success"
const mockFetchError = () => Promise.reject("fail")

const successFetchMachine = fetchMachine.withConfig({
  services: {
    fetcher: mockFetchSuccess
  }
})

const errorFetchMachine = fetchMachine.withConfig({
  services: {
    fetcher: mockFetchError
  }
})

const testOnMatchedState = (machine, stateNode, test) => done => {
  interpret(machine)
    .onTransition(state => {
      if (state.matches(stateNode)) {
        test(state)

        done()
      }
    })
    .start()
    .send({ type: "FETCH" })
}

describe("fetchMachine", () => {
  test(
    'on success we should be in "fetched" state with data in context',
    testOnMatchedState(successFetchMachine, "fetched", state => {
      expect(state.context.data).toBe("success")
    })
  )

  test(
    'on error we should be in "failed" with errorMessage in context',
    testOnMatchedState(errorFetchMachine, "failed", state => {
      expect(state.context.errorMessage).toBe("fail")
    })
  )

  test(
    "should have retry event on failed state",
    testOnMatchedState(errorFetchMachine, "failed", state => {
      expect(state.nextEvents).toContain("RETRY")
    })
  )

  test("should have a configurable transformation on fetch success", done => {
    const toUpperFetchMachine = successFetchMachine.withConfig({
      actions: {
        fetchedEntryTransform: assign({
          data: context => context.data.toUpperCase()
        })
      }
    })

    interpret(toUpperFetchMachine)
      .onTransition(state => {
        if (state.matches("fetched")) {
          expect(state.context.data).toBe("SUCCESS")

          done()
        }
      })
      .start()
      .send({ type: "FETCH" })
  })
})
