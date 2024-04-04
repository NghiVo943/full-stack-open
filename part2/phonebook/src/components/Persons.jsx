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

export default Persons