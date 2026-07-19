import { Router } from 'express'
import * as pricesController from '../controllers/prices.controller.js'

const router = Router()

router.get('/', pricesController.getPrices)
router.get('/latest', pricesController.getLatestPrices)
router.get('/crop/:cropId/trend', pricesController.getCropTrend)
router.get('/crop/:cropId/summary', pricesController.getCropSummary)

export default router
