import api from '../../../services/api'

/**
 * Fetch paginated news with optional filters
 * @param {{ category?: string, impact?: string, search?: string, page?: number, limit?: number }} params
 */
export const fetchNews = async ({ category, impact, search, page = 1, limit = 12 } = {}) => {
  const params = { page, limit }
  if (category && category !== 'ALL') params.category = category
  if (impact && impact !== 'ALL') params.impact = impact
  if (search) params.search = search
  const response = await api.get('/news', { params })
  return response.data
}

/**
 * Refresh news from NewsAPI
 */
export const refreshNews = async () => {
  const response = await api.get('/news/refresh')
  return response.data
}

/**
 * Get a single article
 */
export const fetchNewsById = async (id) => {
  const response = await api.get(`/news/${id}`)
  return response.data
}
