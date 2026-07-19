/**
 * Send a success response
 * @param {import('express').Response} res
 * @param {any} data
 * @param {string} message
 * @param {number} statusCode
 * @param {any} meta
 */
export const sendSuccess = (
  res,
  data = null,
  message = 'Success',
  statusCode = 200,
  meta = null
) => {
  const response = { success: true, message }
  if (data !== null) response.data = data
  if (meta) response.meta = meta
  return res.status(statusCode).json(response)
}

/**
 * Send an error response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {any} errors
 */
export const sendError = (
  res,
  message = 'Error',
  statusCode = 400,
  errors = null
) => {
  const response = { success: false, message }
  if (errors) response.errors = errors
  return res.status(statusCode).json(response)
}

/**
 * Send a paginated response
 * @param {import('express').Response} res
 * @param {any[]} data
 * @param {number} total
 * @param {number|string} page
 * @param {number|string} limit
 * @param {string} message
 */
export const sendPaginated = (
  res,
  data,
  total,
  page,
  limit,
  message = 'Success'
) => {
  const parsedPage = parseInt(page, 10)
  const parsedLimit = parseInt(limit, 10)
  return res.json({
    success: true,
    message,
    data,
    meta: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
      hasNextPage: parsedPage * parsedLimit < total,
      hasPrevPage: parsedPage > 1,
    },
  })
}
