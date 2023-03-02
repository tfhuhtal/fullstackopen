import React from 'react'
import ReactDOM from 'react-dom/client'
import reducer from './reducer'
import { createStore } from 'redux'

const store = createStore(reducer)

const App = () => {
    return (
        <div>
            <button onClick={() => store.dispatch({ type: 'GOOD' })}>good</button>
            <button onClick={() => store.dispatch({ type: 'OK' })}>neutral</button>
            <button onClick={() => store.dispatch({ type: 'BAD' })}>bad</button>
            <button onClick={() => store.dispatch({ type: 'ZERO' })}>reset stats</button>
            <div>good {store.getState().good}</div>
            <div>neutral {store.getState().ok}</div>
            <div>bad {store.getState().bad}</div>
        </div>
    )
}

const renderApp = () => {
    ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
store.subscribe(renderApp)
