import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import * as copilotService from '../services/copilot.service.js'
import { logger } from '../utils/logger.js'

/**
 * POST /copilot/chat
 * Streams AI response via SSE
 */
export const streamChat = asyncHandler(async (req, res) => {
  const { message, sessionId, language = 'EN' } = req.body
  const userId = req.user?.id || null

  if (!message || !message.trim()) {
    return sendError(res, 'Message is required', 400)
  }

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable Nginx buffering
  res.flushHeaders()

  // Helper to send SSE events
  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    // Stream the AI response
    await copilotService.streamChatResponse({
      message: message.trim(),
      sessionId,
      userId,
      language,
      sendEvent,
    })
  } catch (error) {
    logger.error('Chat streaming error:', error)
    sendEvent({ type: 'error', content: 'Something went wrong. Please try again.' })
  } finally {
    res.end()
  }
})

/**
 * GET /copilot/sessions
 */
export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await copilotService.getUserSessions(req.user.id)
  return sendSuccess(res, sessions, 'Sessions retrieved')
})

/**
 * GET /copilot/sessions/:sessionId
 */
export const getSession = asyncHandler(async (req, res) => {
  const session = await copilotService.getSessionById(req.params.sessionId, req.user.id)
  if (!session) return sendError(res, 'Session not found', 404)
  return sendSuccess(res, session, 'Session retrieved')
})

/**
 * POST /copilot/sessions
 */
export const createSession = asyncHandler(async (req, res) => {
  const { title, language = 'EN' } = req.body
  const session = await copilotService.createSession(req.user.id, title, language)
  return sendSuccess(res, session, 'Session created', 201)
})

/**
 * DELETE /copilot/sessions/:sessionId
 */
export const deleteSession = asyncHandler(async (req, res) => {
  await copilotService.deleteSession(req.params.sessionId, req.user.id)
  return sendSuccess(res, null, 'Session deleted')
})

/**
 * PATCH /copilot/sessions/:sessionId
 */
export const updateSession = asyncHandler(async (req, res) => {
  const { title } = req.body
  const session = await copilotService.updateSessionTitle(req.params.sessionId, req.user.id, title)
  return sendSuccess(res, session, 'Session updated')
})
