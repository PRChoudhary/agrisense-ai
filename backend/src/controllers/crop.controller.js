import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/response.js'
import * as cropService from '../services/crop.service.js'

export const getCrops = asyncHandler(async (req, res) => {
  const crops = await cropService.getAllCrops(req.query)
  return sendSuccess(res, crops, 'Crops retrieved')
})

export const getCropById = asyncHandler(async (req, res) => {
  const crop = await cropService.getCropById(req.params.id)
  if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' })
  return sendSuccess(res, crop, 'Crop retrieved')
})
