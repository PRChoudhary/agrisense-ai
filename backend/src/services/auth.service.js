import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js'

/**
 * Register a new user
 * @param {Object} data
 * @returns {Object} user and tokens
 */
export const registerUser = async (data) => {
  const { name, email, password, phone, state } = data
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email is already registered')
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone, state },
  })

  const tokens = await generateTokens(user.id)
  const { passwordHash: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword, ...tokens }
}

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Object} user and tokens
 */
export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    throw new Error('Invalid email or password')
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  const tokens = await generateTokens(user.id)
  const { passwordHash: _, ...userWithoutPassword } = user
  return { user: userWithoutPassword, ...tokens }
}

/**
 * Google authentication
 * @param {string} token
 */
export const googleAuth = async (token) => {
  // In a real app, verify the Google token using google-auth-library
  // Stub for now.
  throw new Error('Google Auth not fully implemented yet')
}

/**
 * Refresh access token
 * @param {string} token
 */
export const refreshAccessToken = async (token) => {
  if (!token) throw new Error('Refresh token is required')

  const tokenRecord = await prisma.refreshToken.findUnique({ where: { token } })
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token')
  }

  const payload = verifyRefreshToken(token)
  const accessToken = generateAccessToken({ userId: payload.userId })
  return { accessToken }
}

/**
 * Logout user
 * @param {string} userId
 * @param {string} refreshToken
 */
export const logoutUser = async (userId, refreshToken) => {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { userId, token: refreshToken },
    })
  }
}

/**
 * Get user by id
 * @param {string} id
 */
export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Update user profile
 * @param {string} id
 * @param {Object} data
 */
export const updateUser = async (id, data) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  })
  const { passwordHash: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Helper to generate and save tokens
 * @param {string} userId
 */
async function generateTokens(userId) {
  const accessToken = generateAccessToken({ userId })
  const refreshToken = generateRefreshToken({ userId })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  })

  return { accessToken, refreshToken }
}
