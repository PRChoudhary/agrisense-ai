import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import * as predictionsService from '../services/predictions.service.js'

/**
 * GET /predictions/crop/:cropId?mandiId=&forceRefresh=
 */
export const getCropPrediction = asyncHandler(async (req, res) => {
  const { cropId } = req.params
  const { mandiId, forceRefresh } = req.query

  const prediction = await predictionsService.getCropPrediction({
    cropId,
    mandiId: mandiId || null,
    forceRefresh: forceRefresh === 'true',
  })

  if (!prediction) {
    return sendError(res, 'Unable to generate prediction — insufficient price history', 422)
  }

  return sendSuccess(res, prediction, 'Prediction generated')
})

/**
 * GET /predictions/top
 * Returns predictions for the top 6 most-priced crops
 */
export const getTopPredictions = asyncHandler(async (req, res) => {
  const predictions = await predictionsService.getTopPredictions()
  return sendSuccess(res, predictions, 'Top predictions retrieved')
})

/**
 * GET /predictions/crop/:cropId/history
 */
export const getPredictionHistory = asyncHandler(async (req, res) => {
  const { cropId } = req.params
  const history = await predictionsService.getPredictionHistory(cropId)
  return sendSuccess(res, history, 'Prediction history retrieved')
})
