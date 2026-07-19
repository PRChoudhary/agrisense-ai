import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import * as weatherService from '../services/weather.service.js'

/**
 * GET /weather/current?city=Delhi&state=Delhi
 */
export const getCurrentWeather = asyncHandler(async (req, res) => {
  const { city, state, lat, lon } = req.query

  if (!city && !lat) {
    return sendError(res, 'Either city or lat/lon coordinates are required', 400)
  }

  const weather = await weatherService.getCurrentWeather({ city, state, lat, lon })
  return sendSuccess(res, weather, 'Weather retrieved')
})

/**
 * GET /weather/india-overview
 * Returns weather for 10 major Indian agricultural cities
 */
export const getIndiaOverview = asyncHandler(async (req, res) => {
  const overview = await weatherService.getIndiaOverview()
  return sendSuccess(res, overview, 'India weather overview retrieved')
})

/**
 * GET /weather/history
 */
export const getWeatherHistory = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query
  const history = await weatherService.getWeatherHistory(parseInt(limit))
  return sendSuccess(res, history, 'Weather history retrieved')
})

/**
 * GET /weather/risk/:state
 */
export const getFarmingRisk = asyncHandler(async (req, res) => {
  const { state } = req.params
  const risk = await weatherService.getFarmingRisk(state)
  return sendSuccess(res, risk, 'Farming risk assessment retrieved')
})
