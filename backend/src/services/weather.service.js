import axios from 'axios'
import prisma from '../config/database.js'
import openai, { MODELS } from '../config/openai.js'
import { logger } from '../utils/logger.js'

const OWM_BASE = 'https://api.openweathermap.org/data/2.5'
const OWM_KEY = process.env.OPENWEATHER_API_KEY

/**
 * Major Indian agricultural cities for overview
 */
const INDIA_CITIES = [
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Ludhiana', state: 'Punjab' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Patna', state: 'Bihar' },
]

/**
 * Map OpenWeatherMap condition codes to emoji + description
 * @param {number} code - OWM weather condition code
 * @returns {{ emoji: string, label: string, bg: string }}
 */
function mapWeatherCondition(code) {
  if (code >= 200 && code < 300) return { emoji: '⛈️', label: 'Thunderstorm', bg: 'storm' }
  if (code >= 300 && code < 400) return { emoji: '🌦️', label: 'Drizzle', bg: 'rain' }
  if (code >= 500 && code < 600) return { emoji: '🌧️', label: 'Rain', bg: 'rain' }
  if (code >= 600 && code < 700) return { emoji: '❄️', label: 'Snow', bg: 'cold' }
  if (code >= 700 && code < 800) return { emoji: '🌫️', label: 'Fog', bg: 'fog' }
  if (code === 800) return { emoji: '☀️', label: 'Clear', bg: 'sunny' }
  if (code === 801 || code === 802) return { emoji: '⛅', label: 'Partly Cloudy', bg: 'cloudy' }
  if (code >= 803) return { emoji: '☁️', label: 'Cloudy', bg: 'cloudy' }
  return { emoji: '🌡️', label: 'Unknown', bg: 'neutral' }
}

/**
 * Calculate farming risk score from weather metrics
 * @returns {{ score: number, level: 'low'|'medium'|'high'|'critical', factors: string[] }}
 */
function calculateFarmingRisk({ temperature, humidity, rainfall, windSpeed, conditionCode }) {
  let score = 0
  const factors = []

  // Temperature risk
  if (temperature > 42) { score += 30; factors.push('Extreme heat — crop stress risk') }
  else if (temperature > 38) { score += 15; factors.push('High heat — monitor irrigation') }
  else if (temperature < 5) { score += 25; factors.push('Cold wave — frost damage risk') }
  else if (temperature < 10) { score += 10; factors.push('Cool temperatures — monitor crops') }

  // Rainfall risk
  if (rainfall > 50) { score += 30; factors.push('Heavy rainfall — flooding & transport risk') }
  else if (rainfall > 20) { score += 15; factors.push('Moderate rainfall — possible road disruptions') }
  else if (rainfall < 2 && humidity < 30) { score += 10; factors.push('Dry conditions — irrigation needed') }

  // Wind risk
  if (windSpeed > 15) { score += 15; factors.push('Strong winds — protect storage') }
  else if (windSpeed > 10) { score += 5; factors.push('Moderate winds') }

  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    score += 20
    factors.push('Thunderstorms — avoid outdoor work')
  }

  // Humidity
  if (humidity > 85) { score += 10; factors.push('High humidity — pest & fungal disease risk') }

  const clampedScore = Math.min(100, score)
  let level = 'low'
  if (clampedScore >= 70) level = 'critical'
  else if (clampedScore >= 45) level = 'high'
  else if (clampedScore >= 20) level = 'medium'

  return { score: clampedScore, level, factors }
}

/**
 * Generate AI farming risk summary using GPT-4o
 * @param {object} weatherData
 * @param {string} location
 * @returns {Promise<string>}
 */
async function generateAISummary(weatherData, location) {
  if (!process.env.OPENAI_API_KEY) {
    return 'AI summary unavailable — OpenAI API key not configured.'
  }

  try {
    const prompt = `You are an agricultural weather analyst for Indian farmers. Based on the following weather data for ${location}, provide a concise farming advisory in 3-4 bullet points. Focus on: what crops are at risk, optimal actions to take today, and selling/transport recommendations.

Weather Data:
- Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Rainfall: ${weatherData.rainfall}mm
- Wind Speed: ${weatherData.windSpeed} km/h
- Condition: ${weatherData.condition}
- Risk Level: ${weatherData.riskLevel} (score: ${weatherData.riskScore}/100)
- Risk Factors: ${weatherData.riskFactors?.join(', ') || 'None identified'}

Provide a practical, farmer-friendly advisory. Use simple language. Mention specific crops where relevant (wheat, rice, onion, tomato, cotton based on the region and season). Keep it under 150 words.`

    const response = await openai.chat.completions.create({
      model: MODELS.FAST,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.6,
    })

    return response.choices[0]?.message?.content || 'Unable to generate summary.'
  } catch (error) {
    logger.error('AI weather summary error:', error)
    return 'AI summary temporarily unavailable.'
  }
}

/**
 * Process OWM forecast data into daily summaries
 * @param {object[]} forecastList - OWM forecast list (every 3 hours)
 * @returns {object[]} Daily summaries
 */
function processForecast(forecastList) {
  const dailyMap = {}

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0]
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        temps: [],
        humidity: [],
        rainfall: 0,
        conditions: [],
        conditionCodes: [],
        windSpeeds: [],
      }
    }
    const d = dailyMap[date]
    d.temps.push(item.main.temp)
    d.humidity.push(item.main.humidity)
    d.rainfall += (item.rain?.['3h'] || 0)
    d.conditions.push(item.weather[0].description)
    d.conditionCodes.push(item.weather[0].id)
    d.windSpeeds.push(item.wind.speed * 3.6) // m/s to km/h
  })

  return Object.values(dailyMap).slice(0, 7).map(d => {
    const avgTemp = Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length)
    const maxTemp = Math.round(Math.max(...d.temps))
    const minTemp = Math.round(Math.min(...d.temps))
    const avgHumidity = Math.round(d.humidity.reduce((a, b) => a + b, 0) / d.humidity.length)
    const avgWind = Math.round(d.windSpeeds.reduce((a, b) => a + b, 0) / d.windSpeeds.length)
    // Most common condition
    const condCode = d.conditionCodes.sort((a, b) =>
      d.conditionCodes.filter(v => v === b).length - d.conditionCodes.filter(v => v === a).length
    )[0]
    const cond = mapWeatherCondition(condCode)

    return {
      date: d.date,
      avgTemp, maxTemp, minTemp,
      humidity: avgHumidity,
      rainfall: Math.round(d.rainfall * 10) / 10,
      windSpeed: avgWind,
      condition: cond.label,
      emoji: cond.emoji,
      bg: cond.bg,
    }
  })
}

/**
 * Main function: Get current weather + forecast + risk + AI summary
 * @param {{ city?: string, state?: string, lat?: string, lon?: string }} params
 */
export const getCurrentWeather = async ({ city, state, lat, lon }) => {
  // Check if we have a recent cached entry (within 1 hour)
  if (city) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const cached = await prisma.weatherData.findFirst({
      where: {
        location: { contains: city, mode: 'insensitive' },
        recordedAt: { gte: oneHourAgo },
      },
      orderBy: { recordedAt: 'desc' },
    })
    if (cached) {
      logger.info(`Returning cached weather for ${city}`)
      return cached
    }
  }

  if (!OWM_KEY || OWM_KEY === 'your_openweather_key') {
    // Return mock data if no API key configured
    return generateMockWeather(city || 'Delhi', state || 'Delhi')
  }

  try {
    // Build query params
    const qParam = lat && lon ? `lat=${lat}&lon=${lon}` : `q=${encodeURIComponent(city)},IN`

    // Fetch current weather + forecast in parallel
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${OWM_BASE}/weather?${qParam}&appid=${OWM_KEY}&units=metric`),
      axios.get(`${OWM_BASE}/forecast?${qParam}&appid=${OWM_KEY}&units=metric`),
    ])

    const current = currentRes.data
    const forecast = forecastRes.data

    const temperature = Math.round(current.main.temp)
    const humidity = current.main.humidity
    const rainfall = current.rain?.['1h'] || 0
    const windSpeed = Math.round(current.wind.speed * 3.6) // m/s to km/h
    const conditionCode = current.weather[0].id
    const cond = mapWeatherCondition(conditionCode)
    const locationName = city || current.name
    const stateName = state || ''

    // Compute risk
    const { score: riskScore, level: riskLevel, factors: riskFactors } = calculateFarmingRisk({
      temperature, humidity, rainfall, windSpeed, conditionCode
    })

    // Process forecast
    const forecastData = processForecast(forecast.list)

    // Build weather object
    const weatherObj = {
      location: locationName,
      state: stateName,
      latitude: current.coord.lat,
      longitude: current.coord.lon,
      temperature,
      feelsLike: Math.round(current.main.feels_like),
      humidity,
      rainfall,
      windSpeed,
      visibility: current.visibility ? Math.round(current.visibility / 1000) : null,
      pressure: current.main.pressure,
      condition: cond.label,
      conditionDesc: current.weather[0].description,
      emoji: cond.emoji,
      bg: cond.bg,
      icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
      riskScore,
      riskLevel,
      riskFactors,
      forecast: forecastData,
    }

    // Generate AI summary
    const aiSummary = await generateAISummary(weatherObj, `${locationName}, ${stateName}`)
    weatherObj.aiSummary = aiSummary

    // Save to DB
    const saved = await prisma.weatherData.create({
      data: {
        location: locationName,
        state: stateName,
        latitude: weatherObj.latitude,
        longitude: weatherObj.longitude,
        temperature,
        humidity,
        rainfall,
        windSpeed,
        condition: cond.label,
        icon: weatherObj.icon,
        forecast: forecastData,
        riskScore,
        riskLevel,
        aiSummary,
      },
    })

    return { ...weatherObj, id: saved.id, recordedAt: saved.recordedAt }
  } catch (error) {
    logger.error('OpenWeatherMap API error:', error.message)
    // Fallback to mock data on API error
    return generateMockWeather(city || 'Delhi', state || 'Delhi')
  }
}

/**
 * Generate realistic mock weather data when API key is not configured
 * @param {string} city
 * @param {string} state
 */
function generateMockWeather(city, state) {
  const temp = 28 + Math.floor(Math.random() * 10)
  const humidity = 55 + Math.floor(Math.random() * 30)
  const rainfall = Math.random() > 0.7 ? Math.floor(Math.random() * 20) : 0
  const windSpeed = 5 + Math.floor(Math.random() * 15)
  const conditionCode = rainfall > 5 ? 501 : 800
  const cond = mapWeatherCondition(conditionCode)

  const { score: riskScore, level: riskLevel, factors: riskFactors } = calculateFarmingRisk({
    temperature: temp, humidity, rainfall, windSpeed, conditionCode
  })

  const today = new Date()
  const forecast = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const t = temp + Math.floor(Math.random() * 6 - 3)
    return {
      date: d.toISOString().split('T')[0],
      avgTemp: t, maxTemp: t + 3, minTemp: t - 3,
      humidity: humidity + Math.floor(Math.random() * 10 - 5),
      rainfall: Math.random() > 0.6 ? Math.floor(Math.random() * 15) : 0,
      windSpeed: windSpeed + Math.floor(Math.random() * 4 - 2),
      condition: cond.label,
      emoji: cond.emoji,
      bg: cond.bg,
    }
  })

  return {
    location: city,
    state,
    latitude: 28.6,
    longitude: 77.2,
    temperature: temp,
    feelsLike: temp + 2,
    humidity,
    rainfall,
    windSpeed,
    pressure: 1013,
    visibility: 10,
    condition: cond.label,
    conditionDesc: cond.label.toLowerCase(),
    emoji: cond.emoji,
    bg: cond.bg,
    icon: null,
    riskScore,
    riskLevel,
    riskFactors,
    forecast,
    aiSummary: `Current conditions in ${city} are ${riskLevel} risk for farming. Temperature of ${temp}°C with ${humidity}% humidity. ${rainfall > 0 ? `${rainfall}mm of rainfall expected — consider delaying outdoor harvesting.` : 'Dry conditions — good for harvesting and transport.'} Monitor your crops and check prices before heading to the mandi.`,
    isMockData: true,
  }
}

/**
 * Get weather overview for major Indian agricultural cities
 */
export const getIndiaOverview = async () => {
  const results = []
  // Try to get from cache first (last 2 hours)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)

  for (const { city, state } of INDIA_CITIES) {
    try {
      const cached = await prisma.weatherData.findFirst({
        where: {
          location: { contains: city, mode: 'insensitive' },
          recordedAt: { gte: twoHoursAgo },
        },
        orderBy: { recordedAt: 'desc' },
        select: { id: true, location: true, state: true, temperature: true, condition: true, riskLevel: true, riskScore: true, humidity: true, rainfall: true },
      })

      if (cached) {
        results.push(cached)
      } else {
        // Use mock for overview to avoid hammering the API
        results.push(generateMockWeather(city, state))
      }
    } catch (e) {
      results.push(generateMockWeather(city, state))
    }
  }

  return results
}

/**
 * Get recent weather history from DB
 */
export const getWeatherHistory = async (limit = 20) => {
  return prisma.weatherData.findMany({
    orderBy: { recordedAt: 'desc' },
    take: limit,
  })
}

/**
 * Get farming risk assessment for a state
 */
export const getFarmingRisk = async (state) => {
  const cached = await prisma.weatherData.findFirst({
    where: { state: { contains: state, mode: 'insensitive' } },
    orderBy: { recordedAt: 'desc' },
  })

  if (cached) {
    return {
      state,
      riskScore: cached.riskScore,
      riskLevel: cached.riskLevel,
      aiSummary: cached.aiSummary,
      temperature: cached.temperature,
      condition: cached.condition,
      recordedAt: cached.recordedAt,
    }
  }

  // Generate mock if no data
  const mock = generateMockWeather(state, state)
  return {
    state,
    riskScore: mock.riskScore,
    riskLevel: mock.riskLevel,
    aiSummary: mock.aiSummary,
    temperature: mock.temperature,
    condition: mock.condition,
  }
}
