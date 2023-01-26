import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const TopVotes = ({votes, anecdotes}) => {
  const index = votes.indexOf(Math.max(...votes))
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[index]}<br />
      has {votes[index]} votes <br />
    </div> 
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.',
    'Better late than never.',
    'As the famous saying goes: Kissa ja kana saunassa!'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint16Array(anecdotes.length))
  
  console.log(selected)

  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  console.log(votes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}<br />
      has {votes[selected]} votes<br />
      <Button handleClick={vote} text="vote" / >
      <Button handleClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} text="next anecdote" / >
      <TopVotes votes={votes} anecdotes={anecdotes} / >
    </div>
  )
}

export default App