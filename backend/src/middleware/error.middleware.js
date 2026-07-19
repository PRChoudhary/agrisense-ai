import { logger } from '../utils/logger.js'
import { sendError } from '../utils/response.js'
import { ZodError } from 'zod'

/**
 * Global error handler
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack })

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }))
    return sendError(res, 'Validation failed', 400, formattedErrors)
  }

  // Prisma Errors
  if (err.code === 'P2002') {
    return sendError(res, 'Resource already exists', 409)
  }
  if (err.code === 'P2025') {
    return sendError(res, 'Resource not found', 404)
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'Invalid or expired token', 401)
  }

  // General server error
  const statusCode = err.statusCode || 500
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error'

  return sendError(res, message, statusCode)
}
