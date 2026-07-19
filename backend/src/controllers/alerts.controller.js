import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import * as alertsService from '../services/alerts.service.js'

export const getUserAlerts = asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendSuccess(res, [], 'Guest has no alerts')
  }
  const alerts = await alertsService.getUserAlerts(req.user.id)
  return sendSuccess(res, alerts, 'Alerts retrieved successfully')
})

export const createPriceAlert = asyncHandler(async (req, res) => {
  if (!req.user) {
    return sendError(res, 'Please log in to create alerts', 401)
  }

  const { name, cropId, mandiId, threshold, direction, emailNotify } = req.body

  if (!cropId || !threshold || !direction) {
    return sendError(res, 'Missing required fields: cropId, threshold, direction', 400)
  }

  const alert = await alertsService.createPriceAlert(req.user.id, {
    name, cropId, mandiId, threshold, direction, emailNotify
  })

  return sendSuccess(res, alert, 'Price alert created successfully', 201)
})

export const toggleAlertStatus = asyncHandler(async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)
  const { id } = req.params
  const { isActive } = req.body

  if (typeof isActive !== 'boolean') {
    return sendError(res, 'isActive must be a boolean', 400)
  }

  const alert = await alertsService.toggleAlertStatus(req.user.id, id, isActive)
  if (!alert) return sendError(res, 'Alert not found', 404)

  return sendSuccess(res, alert, `Alert ${isActive ? 'activated' : 'deactivated'}`)
})

export const deleteAlert = asyncHandler(async (req, res) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)
  const { id } = req.params
  
  const success = await alertsService.deleteAlert(req.user.id, id)
  if (!success) return sendError(res, 'Alert not found', 404)

  return sendSuccess(res, null, 'Alert deleted successfully')
})
