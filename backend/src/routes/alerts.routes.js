import { Router } from 'express'
import * as alertsController from '../controllers/alerts.controller.js'
import { optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// All alert routes use optionalAuth (guests can view empty list, but creation blocked in controller)
router.use(optionalAuth)

// Get all alerts for current user
router.get('/', alertsController.getUserAlerts)

// Create a new price alert
router.post('/price', alertsController.createPriceAlert)

// Toggle alert active status
router.patch('/:id/toggle', alertsController.toggleAlertStatus)

// Delete an alert
router.delete('/:id', alertsController.deleteAlert)

export default router
