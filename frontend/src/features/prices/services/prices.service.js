import api from '../../../services/api'

/**
 * Fetch paginated prices with filters
 * @param {object} params - cropId, mandiId, state, page, limit, sortBy, sortOrder, search, dateFrom, dateTo
 */
export const fetchPrices = async (params = {}) => {
  const response = await api.get('/prices', { params })
  return response.data
}

/** Fetch latest price per crop/mandi combo */
export const fetchLatestPrices = async (params = {}) => {
  const response = await api.get('/prices/latest', { params })
  return response.data
}

/** Fetch 30-day price trend for a crop */
export const fetchCropTrend = async (cropId, mandiId) => {
  const params = mandiId ? { mandiId } : {}
  const response = await api.get(`/prices/crop/${cropId}/trend`, { params })
  return response.data
}

/** Fetch price summary (min/max/avg/trend) for a crop */
export const fetchCropSummary = async (cropId) => {
  const response = await api.get(`/prices/crop/${cropId}/summary`)
  return response.data
}

/** Fetch all crops for dropdown */
export const fetchCrops = async (categoryId) => {
  const params = categoryId ? { categoryId } : {}
  const response = await api.get('/crops', { params })
  return response.data
}

/** Fetch mandis with filters */
export const fetchMandis = async (params = {}) => {
  const response = await api.get('/mandis', { params })
  return response.data
}

/** Fetch all Indian states (from mandis) */
export const fetchStates = async () => {
  const response = await api.get('/mandis/states')
  return response.data
}
