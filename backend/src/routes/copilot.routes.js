import { Router } from 'express'
import * as copilotController from '../controllers/copilot.controller.js'
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js'
import { aiLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

// Chat streaming endpoint — optionalAuth allows guest usage
router.post('/chat', aiLimiter, optionalAuth, copilotController.streamChat)

// Session management
router.get('/sessions', authenticate, copilotController.getSessions)
router.get('/sessions/:sessionId', authenticate, copilotController.getSession)
router.post('/sessions', authenticate, copilotController.createSession)
router.delete('/sessions/:sessionId', authenticate, copilotController.deleteSession)
router.patch('/sessions/:sessionId', authenticate, copilotController.updateSession)

export default router
