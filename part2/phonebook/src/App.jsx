import { useState } from "react"

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

const Person = ({ name, number }) => {
  return (
    <div>{name} {number}</div>
  )
}

const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <Person key={person.id} name={person.name} number={person.number}/>)}
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleName = (event) => {setName(event.target.value)}
  const handleNumber = (event) => {setNumber(event.target.value)}
  const handleFilter = (event) => {setFilter(event.target.value)}

  const handleSubmit = (event) => {
    event.preventDefault();
    if (persons.map(person => person.name).includes(name)) {
      alert(`${name} is already added to phonebook`)
      return
    }

    const newPerson = {
      name : name,
      number : number,
      id : persons.length
    }
    
    setPersons(persons.concat(newPerson))
    setName('')
    setNumber('')
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} filterHandler={handleFilter} />

      <h3>Add a new</h3>

      <PersonForm name={name} number={number} nameHandler={handleName} numberHandler={handleNumber} submitHandler={handleSubmit}/>

      <h3>Numbers</h3>

      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App
