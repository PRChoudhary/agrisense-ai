import api from '../../../services/api'

/**
 * Get prediction for a specific crop
 * @param {{ cropId: string, mandiId?: string, forceRefresh?: boolean }} params
 */
export const fetchCropPrediction = async ({ cropId, mandiId, forceRefresh = false }) => {
  const params = { forceRefresh }
  if (mandiId) params.mandiId = mandiId
  const response = await api.get(`/predictions/crop/${cropId}`, { params })
  return response.data
}

/**
 * Get top predictions for popular crops
 */
export const fetchTopPredictions = async () => {
  const response = await api.get('/predictions/top')
  return response.data
}

/**
 * Get all crops (for dropdown)
 */
export const fetchCropsForDropdown = async () => {
  const response = await api.get('/crops?limit=100&isActive=true')
  return response.data
}
