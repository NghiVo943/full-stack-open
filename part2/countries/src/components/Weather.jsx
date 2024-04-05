const Weather = ({ country }) => {
  if (!country.weather) {
    return null
  }  

  const temperature = (country.weather.main.temp -32)*5 / 9
  const icon_src = `https://openweathermap.org/img/wn/${country.weather.weather[0].icon}@2x.png`
  const wind = country.weather.wind.speed

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <div>temperature {temperature} Celsius</div>
      <img src={icon_src}></img>
      <div>wind {wind} m/s</div>  
    </div>
  )  
}

export default Weather