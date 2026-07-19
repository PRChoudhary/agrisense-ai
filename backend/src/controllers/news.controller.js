import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError, sendPaginated } from '../utils/response.js'
import * as newsService from '../services/news.service.js'

/**
 * GET /news?category=POSITIVE&impact=HIGH&search=wheat&page=1&limit=12
 */
export const getNews = asyncHandler(async (req, res) => {
  const { category, impact, search, page = 1, limit = 12 } = req.query

  const { articles, total } = await newsService.getNews({
    category: category || null,
    impact: impact || null,
    search: search || null,
    page: parseInt(page),
    limit: parseInt(limit),
  })

  return sendPaginated(res, articles, total, page, limit, 'News retrieved')
})

/**
 * GET /news/refresh - Force fetch from NewsAPI
 */
export const refreshNews = asyncHandler(async (req, res) => {
  const articles = await newsService.fetchAndSaveNews()
  return sendSuccess(res, articles, `Refreshed ${articles.length} articles`)
})

/**
 * GET /news/:id
 */
export const getNewsById = asyncHandler(async (req, res) => {
  const article = await newsService.getNewsById(req.params.id)
  if (!article) return sendError(res, 'Article not found', 404)
  return sendSuccess(res, article, 'Article retrieved')
})
