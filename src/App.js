import React from "react"
import { useMachine } from "@xstate/react"
import { appMachine } from "./machines/app"
import { Game } from "./components/Game"

export const App = () => {
  const [current, send] = useMachine(appMachine, { devTools: true })

  return (
    <div className="app">
      <header className="app-header">
        <h1>Trivia</h1>
      </header>
      <main>
        {current.matches("playing") ? (
          <Game gameService={current.children.game} />
        ) : (
          <Idle
            state={current.value}
            onPlay={() => send("PLAY")}
            onRetry={() => send("RETRY_INITIATION")}
          />
        )}
      </main>
    </div>
  )
}

function Idle({ state, onPlay, onRetry }) {
  return (
    <div>
      <div className="bordered">
        <p>
          Ten questions. Try to answer as quickly as possible, there is a 15
          seconds limit.
        </p>
        <p>
          You have two lifelines, 50/50 and 10 extra seconds, use them wisely.
        </p>
      </div>
      <div className="app-action-area">
        {state === "ready" ? (
          <button onClick={onPlay}>Play!</button>
        ) : state === "initiationFailed" ? (
          <span>
            Initiation failed <button onClick={onRetry}>Try again</button>
          </span>
        ) : (
          <span>Setting up game...</span>
        )}
      </div>
    </div>
  )
}
