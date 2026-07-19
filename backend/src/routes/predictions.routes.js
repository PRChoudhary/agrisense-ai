import { Router } from 'express'
import * as predictionsController from '../controllers/predictions.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'
import { aiLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// Generate/get prediction for a crop (optionally filtered by mandi)
router.get('/crop/:cropId', aiLimiter, optionalAuth, predictionsController.getCropPrediction)

// Get top predictions for popular crops (used on dashboard/predictions page overview)
router.get('/top', optionalAuth, predictionsController.getTopPredictions)

// Get all predictions for a crop (history)
router.get('/crop/:cropId/history', optionalAuth, predictionsController.getPredictionHistory)

export default router
