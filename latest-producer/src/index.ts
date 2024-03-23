/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-var-requires */
import { app } from '@azure/functions'
import axios, { type AxiosResponse } from 'axios'
import { Kafka, logLevel } from 'kafkajs'

const appid = process.env['OPENWEATHER_API_KEY'] ?? ''
const lat = process.env['LAT'] ?? ''
const lon = process.env['LON'] ?? ''
const username = process.env['KAFKA_USER'] ?? ''
const password = process.env['KAFKA_PASSWORD'] ?? ''
const broker = process.env['KAFKA_BROKER'] ?? ''

const url = new URL(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appid}`)

const kafka = new Kafka({
  brokers: [broker],
  ssl: true,
  sasl: {
    mechanism: 'scram-sha-256',
    username,
    password
  },
  logLevel: logLevel.ERROR
})

const producer = kafka.producer()

const save = async (result: WeatherResult): Promise<void> => {
  await producer.connect()

  await producer.send({
    topic: 'weather-raw',
    messages: [
      { value: JSON.stringify(result), key: `${result.coord.lat},${result.coord.lon}` }
    ]
  })

  console.log('Message sent successfully')
  await producer.disconnect()
}

app.timer('getLatest', {
  schedule: '0 */2 * * * *',
  handler: async (myTimer, context) => {
    console.log(url.href)

    const result: AxiosResponse<WeatherResult> = await axios.get(url.href)

    if (result.status !== 200) {
      console.error(result.status)
      return
    }

    console.log(result.status)
    console.log(result.data)

    await save(result.data)
  }
})

export interface WeatherResult {
  coord: Coord
  weather: Weather[]
  base: string
  main: Main
  visibility: number
  wind: Wind
  rain: Rain
  clouds: Clouds
  dt: number
  sys: Sys
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Coord {
  lon: number
  lat: number
}

export interface Weather {
  id: number
  main: string
  description: string
  icon: string
}

export interface Main {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level: number
  grnd_level: number
}

export interface Wind {
  speed: number
  deg: number
  gust: number
}

export interface Rain {
  '1h': number
}

export interface Clouds {
  all: number
}

export interface Sys {
  type: number
  id: number
  country: string
  sunrise: number
  sunset: number
}
