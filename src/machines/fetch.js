import { Machine, assign } from "xstate"

export const fetchMachine = Machine(
  {
    id: "fetchMachine",
    context: {
      data: null,
      errorMessage: null
    },
    initial: "prefetch",
    states: {
      prefetch: {
        on: { FETCH: "fetching" }
      },
      fetching: {
        invoke: {
          id: "fetchMachinePromise",
          src: "fetcher",
          onDone: {
            target: "fetched",
            actions: "onFetchSuccess"
          },
          onError: {
            target: "failed",
            actions: "onFetchError"
          }
        }
      },
      fetched: {
        entry: "fetchedEntryTransform"
      },
      failed: {
        on: { RETRY: "fetching" }
      }
    }
  },
  {
    services: {
      fetcher: () => {
        throw new Error("Please implement the fetcher service")
      }
    },
    actions: {
      onFetchSuccess: assign({ data: (_, event) => event.data }),
      onFetchError: assign({ errorMessage: (_, event) => event.data }),
      fetchedEntryTransform: () => {}
    }
  }
)
