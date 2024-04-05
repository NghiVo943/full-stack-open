import { useState, useEffect } from "react"
import personService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({})

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
            .catch(error => {
              setNotification({ message : error.response.data.error, type : 'error' })
              personService.getAll().then(data => setPersons(data))
              setTimeout(() => setNotification({}), 5000)
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
          setNotification({ message: `Added ${returnedPerson.name}`, type: 'noti'})
          setTimeout(() => setNotification({}), 5000)
        })
        .catch(error => {
          setNotification({ message : error.response.data.error, type : 'error' })
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
      <Notification message={notification.message} type={notification.type}/>
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
