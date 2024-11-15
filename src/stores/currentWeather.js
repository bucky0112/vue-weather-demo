import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWeatherStore = defineStore('weatherInfo', () => {
  const location = ref(null)
  const errorMsg = ref(null)
  const currentWeather = ref(null)
  const city = ref(null)

  const setLocation = (newLocation) => {
    location.value = newLocation
  }

  const setErrorMsg = (msg) => {
    errorMsg.value = msg
  }

  const setCurrentWeather = (weather) => {
    currentWeather.value = weather
  }

  const setCity = (newCity) => {
    city.value = newCity
  }

  const fetchLocation = async () => {
    if (location.value) {
      const apiUrl = import.meta.env.VITE_GEOCODING_API_URL
      const apiKey = import.meta.env.VITE_GEOCODING_API_KEY
      const { latitude, longitude } = location.value

      try {
        const res = await fetch(
          `${apiUrl}latlng=${latitude},${longitude}&key=${apiKey}&language=en`
        )
        const json = await res.json()
        const cityComponent = json.results
          .flatMap((result) => result.address_components)
          .find((component) => component.types.includes('locality'))
        console.log(json)
        console.log(cityComponent)

        if (cityComponent) {
          setCity(cityComponent.long_name)
        } else {
          console.error('沒找到 city')
        }
      } catch (err) {
        console.log(err)
        errorMsg.value = err.message
      }
    }
  }

  const fetchWeatherData = async () => {
    if (location.value) {
      const apiUrl = import.meta.env.VITE_WEATHER_API_URL
      const apiKey = import.meta.env.VITE_API_KEY

      try {
        const res = await fetch(
          `${apiUrl}lat=${location.value.latitude}&lon=${location.value.longitude}&units=metric&appid=${apiKey}`
        )
        const json = await res.json()
        currentWeather.value = json.current
      } catch (err) {
        console.log(err)
        errorMsg.value = err.message
      }
    }
  }

  return {
    location,
    setLocation,
    errorMsg,
    setErrorMsg,
    currentWeather,
    setCurrentWeather,
    fetchWeatherData,
    fetchLocation,
    city
  }
})
