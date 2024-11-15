<script setup>
import { ref, onMounted } from "vue"
import { Iconoir, Check, CheckCircle, Cloud } from '@iconoir/vue';
import HeaderInfo from './components/HeaderInfo.vue'
import CurrentWeather from './components/CurrentWeather.vue'
import { useWeatherStore } from './stores/currentWeather.js'

const weatherStore = useWeatherStore()

const getLocation = () => new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      weatherStore.setLocation(position.coords)
      resolve(position)
    },
    (err) => {
      weatherStore.setError(`無法取得位置：${err.message}`)
      reject(err)
    }
  )
})

onMounted(async () => {
  await getLocation()
  if (weatherStore.location) {
    await weatherStore.fetchWeatherData()
    await weatherStore.fetchLocation()
  }
})

</script>

<template>
  <main class="bg-blue-500 h-screen flex flex-col items-center justify-center">
    <HeaderInfo />
    <CurrentWeather />
  </main>
</template>
