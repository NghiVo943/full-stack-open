const Country = ({ name, showHandler }) => {
  return (
    <div>{name} <button onClick={showHandler} >show</button></div>
  )  
}
  
const CountryList = ({ countries, showHandler }) => {
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>  
    )
  }
  if (countries.length <= 1) {
    return null
  }
  return (
    <div>
      {countries.map(country => 
        <Country 
          key={country.cca3} 
          name={country.name.common} 
          showHandler={() => showHandler(country.name.common)}/>
      )}  
    </div>
  )  
}

export default CountryList