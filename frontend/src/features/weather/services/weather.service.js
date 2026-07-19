import api from '../../../services/api'

/**
 * Get current weather for a city
 * @param {{ city?: string, state?: string, lat?: number, lon?: number }} params
 */
export const fetchCurrentWeather = async ({ city, state, lat, lon }) => {
  const params = {}
  if (city) params.city = city
  if (state) params.state = state
  if (lat) params.lat = lat
  if (lon) params.lon = lon
  const response = await api.get('/weather/current', { params })
  return response.data
}

/**
 * Get weather overview for major Indian cities
 */
export const fetchIndiaOverview = async () => {
  const response = await api.get('/weather/india-overview')
  return response.data
}

/**
 * Get weather history
 */
export const fetchWeatherHistory = async (limit = 20) => {
  const response = await api.get('/weather/history', { params: { limit } })
  return response.data
}

/**
 * Get farming risk for a state
 */
export const fetchFarmingRisk = async (state) => {
  const response = await api.get(`/weather/risk/${encodeURIComponent(state)}`)
  return response.data
}
