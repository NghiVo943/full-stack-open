import { useEffect, useState } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

import Filter from './components/Filter'
import CountryList from './components/CountryList'
import CountryInfo from './components/CountryInfo'
import Weather from './components/Weather'

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState({})

  useEffect(() => {
    countryService
      .getAll()
        .then(allCountries => { setCountries(allCountries) })
        .catch(_ => {
          setCountries([])
        })
    if (filteredCountries.length === 1) {
      getCountry(filteredCountries[0].name.common)
    }
    else {
      setCountry({})
    }
  }, [filter])

  const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
  
  const getCountry = (name) => {
    return countryService
      .getCountry(name)
        .then(country => {
          weatherService
            .getWeather(country.capital)
              .then(weather => {
                country.weather = weather
                setCountry(country)
              })
              .catch(error => console.log(error))
        })
        .catch(_ => {
          return {}
        })
  }
  
  const handleFilter = (event) => { setFilter(event.target.value) }
  const handleShowCountry = (name) => { getCountry(name) }

  return (
    <div>
      <Filter filter={filter} filterHandler={handleFilter}/>
      <CountryList countries={filteredCountries} showHandler={handleShowCountry}/>
      <CountryInfo country={country} />
      <Weather country={country} />
    </div>
  )
}

export default App
