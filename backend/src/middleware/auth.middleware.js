import { extractBearerToken, verifyAccessToken } from '../utils/jwt.js'
import { sendError } from '../utils/response.js'
import prisma from '../config/database.js'

/**
 * Middleware to authenticate user via JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization)
    if (!token) {
      return sendError(res, 'Authentication required', 401)
    }

    const payload = verifyAccessToken(token)
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })

    if (!user) {
      return sendError(res, 'User not found', 401)
    }

    req.user = user
    next()
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401)
  }
}

/**
 * Optional authentication middleware for guest support
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractBearerToken(req.headers.authorization)
    if (token) {
      const payload = verifyAccessToken(token)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })
      if (user) {
        req.user = user
      }
    }
  } catch (error) {
    // Ignore invalid tokens for optional auth
  } finally {
    next()
  }
}

/**
 * Middleware to check user role
 * @param  {...string} roles
 */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401)
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', 403)
    }
    next()
  }

/**
 * Require ADMIN role
 */
export const requireAdmin = requireRole('ADMIN')
