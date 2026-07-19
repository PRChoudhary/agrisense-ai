import { Router } from 'express'
import { authLimiter } from '../middleware/rateLimit.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { authenticate } from '../middleware/auth.middleware.js'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
)
router.post('/login', authLimiter, validate(loginSchema), authController.login)
router.post('/google', authLimiter, authController.googleLogin)
router.post('/refresh', authController.refresh)
router.post('/logout', authenticate, authController.logout)
router.get('/me', authenticate, authController.getMe)
router.patch(
  '/me',
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile
)

export default router
