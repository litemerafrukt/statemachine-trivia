import React from "react"
import { useMachine } from "@xstate/react"
import { appMachine } from "./machines/app"
import "./App.css"
import { Game } from "./components/Game"

function App() {
  const [current, send] = useMachine(appMachine, { devTools: true })

  return (
    <div className="app">
      <header className="app-header">
        <p>Trivia</p>
      </header>
      <div>
        {current.matches("playing") ? (
          <Game gameService={current.children.game} />
        ) : (
          <>
            <Rules />
            {current.matches("ready") ? (
              <button onClick={() => send("PLAY")}>Begin!</button>
            ) : current.matches("initiationFailed") ? (
              <span>
                Initiation failed{" "}
                <button onClick={() => send("RETRY_INITIATION")}>
                  Try again
                </button>
              </span>
            ) : (
              <span>Setting up game...</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Rules() {
  return (
    <div>
      <p>
        Ten questions. Try to answer as quickly as possible, there is a 15
        seconds limit.
      </p>
      <p>
        You have two lifelines, 50/50 and 10 extra seconds, use them wisely.
      </p>
    </div>
  )
}

export default App
