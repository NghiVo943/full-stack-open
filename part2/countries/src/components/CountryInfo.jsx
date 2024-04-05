const CountryInfo = ({ country }) => {

  if (!country.name) {
    return null
  }  
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>

      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>

      <img src={country.flags.png} />
    </div>
  )  
}

export default CountryInfo