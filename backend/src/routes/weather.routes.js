import { Router } from 'express'
import * as weatherController from '../controllers/weather.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'
import { searchLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// Get current weather + forecast + AI summary for a location
router.get('/current', searchLimiter, optionalAuth, weatherController.getCurrentWeather)

// Get weather for multiple major Indian cities (for dashboard overview)
router.get('/india-overview', searchLimiter, weatherController.getIndiaOverview)

// Get recent saved weather records from DB
router.get('/history', weatherController.getWeatherHistory)

// Get farming risk assessment for a state
router.get('/risk/:state', searchLimiter, optionalAuth, weatherController.getFarmingRisk)

export default router
