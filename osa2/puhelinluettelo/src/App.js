import { useState, useEffect } from 'react'
import axios from 'axios'

const PersonForm = ({ newName, onNameChange, newNumber, onNumberChange, onSubmitClick }) => {
  return (
    <form onSubmit={onSubmitClick}> 
      <div>
        name: <input value={newName} onChange={onNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ filter, onFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={onFilterChange}/>
    </div>
  )
}


const Person  = ({ person }) => {
  return (
    <div>{person.name} {person.number}</div>
  )
}

const Persons = ({ persons, filter }) => {
  return (
    <div>
      {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <Person key={person.name} person={person} />)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const onSubmitClick = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      setPersons(persons.concat({ name: newName, number: newNumber }))
      setNewName('')
      setNewNumber('')
    }
  }

  const onNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const onNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const onFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={onFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} onNameChange={onNameChange} newNumber={newNumber} onNumberChange={onNumberChange} onSubmitClick={onSubmitClick}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App