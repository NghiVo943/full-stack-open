import { useState, useEffect } from "react"
import personService from './services/persons'

const Filter = ({ filter, filterHandler }) => {
  return (
    <div>filter shown with <input value = {filter} onChange={filterHandler} /></div>
  )
}

const PersonForm = ({ name, number, nameHandler, numberHandler, submitHandler }) => {
  return (
    <form onSubmit={submitHandler}>
      <div>name: <input value = {name} onChange={nameHandler} /></div>
      <div>number: <input value = {number} onChange={numberHandler} /></div>
      <div><button type="submit" >add</button></div>
    </form>
  )
}

const Person = ({ name, number, deleteHandler }) => {
  return (
    <div>
      <span>{name} {number} </span>
      <button onClick={deleteHandler}>delete</button>
    </div>
  )
}

const Persons = ({ persons, deleteHandler }) => {
  return (
    <div>
      {persons.map(person => 
        <Person 
          key={person.id} 
          name={person.name} 
          number={person.number} 
          deleteHandler={() => deleteHandler(person.id)}
        />)}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {personService.getAll().then(data => setPersons(data))}, [])

  const handleName = (event) => {setName(event.target.value)}
  const handleNumber = (event) => {setNumber(event.target.value)}
  const handleFilter = (event) => {setFilter(event.target.value)}

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(name)) {
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === name)
        const changedPerson = { ...person, number : number }
        personService
          .update(changedPerson.id, changedPerson)
            .then(returnedPerson => setPersons(persons.map(person => person.name === name ? returnedPerson : person)))
            .catch(_ => {
              alert(`${person.name} was already deleted from server`)
              setPersons(persons.filter(person => person.name !== name))
            })
      }
      return
    }

    const newPerson = {
      name : name,
      number : number
    }

    personService
      .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setName('')
          setNumber('')
        })
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(id)
          .then(_ => {
            setPersons(persons.filter(person => person.id !== id))
          })
    }
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} filterHandler={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm 
        name={name} number={number} 
        nameHandler={handleName} numberHandler={handleNumber} 
        submitHandler={handleSubmit}/>

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deleteHandler={handleDelete}/>
    </div>
  )
}

export default App
