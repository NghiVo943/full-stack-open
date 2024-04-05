import axios from "axios"
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_WEATHER_KEY

const getWeather = (city) => {
  return axios
    .get(`${baseUrl}?&q=${city}&appid=${api_key}`)
      .then(response => response.data)
      .catch(error => { console.log(error) })
}

export default { getWeather }