import { ZodError } from 'zod'

/**
 * Zod validation middleware
 * @param {import('zod').AnyZodObject} schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    req.body = parsed.body || req.body
    req.query = parsed.query || req.query
    req.params = parsed.params || req.params
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    next(error)
  }
}
