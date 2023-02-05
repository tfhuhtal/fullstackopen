import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Country = ({ country, showWeather, weather, weatherLoaded }) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h2>languages</h2>
      <ul>
        {country.languages.map(language => <li key={language.name}>{language.name}</li>)}
      </ul>
      <img src={country.flag} alt="flag" width="100" />
      <h2>Weather in {country.capital}</h2>
      {weatherLoaded && weather ? 
        <div>
          <div><b>temperature:</b> {weather.current.temperature} Celsius</div>
          <img src={weather.current.weather_icons[0]} alt="weather icon" width="100" />
          <div><b>wind:</b> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</div>
        </div> 
        : <button onClick={() => showWeather(country)}>show weather</button>}
    </div>
  )
}


const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ weather, setWeather ] = useState({})
  const [ weatherLoaded, setWeatherLoaded ] = useState(false)

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.com/v2/all') //using this API because the other one was down/ not working
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }

  useEffect(hook, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const showWeather = (country) => {
    console.log('showWeather')
    console.log(country)
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital}`)
      .then(response => {
        console.log('promise fulfilled')
        setWeather(response.data)
        setWeatherLoaded(true)
      })
  }

  const countriesToShow = filter
  ? countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  : countries


  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      <div>
        {countriesToShow.length > 10 ? 'Too many matches, specify another filter' : countriesToShow.length === 1 ? 
        <Country country={countriesToShow[0]} showWeather={showWeather} weather={weather} weatherLoaded={weatherLoaded} /> 
        : countriesToShow.map(country => 
        <div key={country.name}>{country.name} 
        <button onClick={() => setFilter(country.name)}>show</button>
        </div>)}
      </div>
    </div>
  )
}

export default App;
