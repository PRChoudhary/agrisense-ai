import { Router } from 'express'
import { optionalAuth } from '../middleware/auth.middleware.js'
import * as adminController from '../controllers/admin.controller.js'

const router = Router()

// Public / optional auth for system stats and admin operations
router.get('/stats', optionalAuth, adminController.getStats)
router.post('/seed', optionalAuth, adminController.seedDatabase)

export default router
