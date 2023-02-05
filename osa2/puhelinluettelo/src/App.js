import { useState, useEffect } from 'react'
import personService from './services/persons'


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

const Person  = ({ person, onNumberDelete }) => {
  return (
    <div>{person.name} {person.number} <button onClick={onNumberDelete}>delete</button></div>
  )
}

const Persons = ({ persons, filter, deleteNumber }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      {filteredPersons.map(person => <Person key={person.name} person={person} onNumberDelete={() => deleteNumber(person.id)} />)}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  const errorStyle = {
    color: 'red',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={errorStyle}>
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const successStyle = {
    color: 'green',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [ successMessage, setSuccessMessage] = useState(null)
  const [ errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const onSubmitClick = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = persons.find(person => person.name === newName)
    if (personObject) {
      if (window.confirm('Do you want to replace the number?')) {
        const changedPerson = { ...personObject, number: newNumber }
        personService
          .update(personObject.id, changedPerson)
          .then(returnedPerson => {
            successContent(`Changed ${personObject.name}`)
            setPersons(persons.map(person => person.id !== personObject.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            errorContent(`Information of ${personObject.name} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== personObject.id))
            setNewName('')
            setNewNumber('')
          }
        )
      }
    }
    else {
      const newbie = { name: newName, number: newNumber }
      personService
        .create(newbie)
        .then(returnedPerson => {
          successContent(`Added ${newbie.name}`)
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        }
      )
    }
  }

  const deleteNumber = (id) => {
    if (window.confirm('Do you want to delete the number?')) {
      deleteNumberFromServer(id)
    }
  }

  const deleteNumberFromServer = (id) => {
    console.log('deleteNumber', id)
    personService
      .deleteNumber(id)
      .then(response => {
        successContent(`Deleted ${id}`)
        console.log('deleteNumber response', response)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        errorContent(`Information of ${id} has already been removed from server`)
        setPersons(persons.filter(person => person.id !== id))
      }
    )
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

  const errorContent = (error, standardStatus) => {
    const message = error.response.data ? `Error: ${error.response.data.error}` : standardStatus
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const successContent = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} onFilterChange={onFilterChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} onNameChange={onNameChange} newNumber={newNumber} onNumberChange={onNumberChange} onSubmitClick={onSubmitClick}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteNumber={deleteNumber} />
    </div>
  )

}

export default App