import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import * as mandiService from '../services/mandi.service.js'

export const getMandis = asyncHandler(async (req, res) => {
  const mandis = await mandiService.getMandis(req.query)
  return sendSuccess(res, mandis, 'Mandis retrieved')
})

export const getMandiById = asyncHandler(async (req, res) => {
  const mandi = await mandiService.getMandiById(req.params.id)
  if (!mandi) return res.status(404).json({ success: false, message: 'Mandi not found' })
  return sendSuccess(res, mandi, 'Mandi retrieved')
})

export const getNearbyMandis = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 50 } = req.query
  if (!lat || !lng) return res.status(400).json({ success: false, message: 'lat and lng are required' })
  const mandis = await mandiService.getNearbyMandis(parseFloat(lat), parseFloat(lng), parseFloat(radius))
  return sendSuccess(res, mandis, 'Nearby mandis retrieved')
})

export const getStates = asyncHandler(async (req, res) => {
  const states = await mandiService.getStates()
  return sendSuccess(res, states, 'States retrieved')
})
