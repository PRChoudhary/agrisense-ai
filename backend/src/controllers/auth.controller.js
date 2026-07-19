import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import * as authService from '../services/auth.service.js'

export const register = asyncHandler(async (req, res) => {
  try {
    const result = await authService.registerUser(req.body)
    return sendSuccess(res, result, 'Registration successful', 201)
  } catch (error) {
    return sendError(res, error.message, 400)
  }
})

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    return sendSuccess(res, result, 'Login successful', 200)
  } catch (error) {
    return sendError(res, error.message, 401)
  }
})

export const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body
    const result = await authService.googleAuth(token)
    return sendSuccess(res, result, 'Google login successful', 200)
  } catch (error) {
    return sendError(res, error.message, 400)
  }
})

export const refresh = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body
    const result = await authService.refreshAccessToken(refreshToken)
    return sendSuccess(res, result, 'Token refreshed', 200)
  } catch (error) {
    return sendError(res, error.message, 401)
  }
})

export const logout = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body
    await authService.logoutUser(req.user.id, refreshToken)
    return sendSuccess(res, null, 'Logout successful', 200)
  } catch (error) {
    return sendError(res, error.message, 400)
  }
})

export const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id)
    return sendSuccess(res, user, 'Profile retrieved', 200)
  } catch (error) {
    return sendError(res, error.message, 404)
  }
})

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = await authService.updateUser(req.user.id, req.body)
    return sendSuccess(res, user, 'Profile updated', 200)
  } catch (error) {
    return sendError(res, error.message, 400)
  }
})
