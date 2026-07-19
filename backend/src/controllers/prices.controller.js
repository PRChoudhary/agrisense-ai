import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendPaginated } from '../utils/response.js'
import * as pricesService from '../services/prices.service.js'

export const getPrices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, ...filters } = req.query
  const { data, total } = await pricesService.getPrices(
    filters,
    parseInt(page),
    parseInt(limit)
  )
  return sendPaginated(res, data, total, page, limit, 'Prices retrieved')
})

export const getLatestPrices = asyncHandler(async (req, res) => {
  const prices = await pricesService.getLatestPrices(req.query)
  return sendSuccess(res, prices, 'Latest prices retrieved')
})

export const getCropTrend = asyncHandler(async (req, res) => {
  const { cropId } = req.params
  const trend = await pricesService.getCropTrend(cropId, req.query.mandiId)
  return sendSuccess(res, trend, 'Crop price trend retrieved')
})

export const getCropSummary = asyncHandler(async (req, res) => {
  const { cropId } = req.params
  const summary = await pricesService.getCropSummary(cropId)
  return sendSuccess(res, summary, 'Crop price summary retrieved')
})
