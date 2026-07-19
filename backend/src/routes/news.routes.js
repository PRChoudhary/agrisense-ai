import { Router } from 'express'
import * as newsController from '../controllers/news.controller.js'
import { searchLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// Get paginated news feed with filters
router.get('/', searchLimiter, newsController.getNews)

// Force refresh from NewsAPI
router.get('/refresh', searchLimiter, newsController.refreshNews)

// Get a single news article
router.get('/:id', newsController.getNewsById)

export default router
