import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger.js'

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
})

/**
 * Connect to the PostgreSQL database via Prisma
 */
export async function connectDatabase() {
  try {
    await prisma.$connect()
    logger.info('📦 Successfully connected to PostgreSQL database')
  } catch (error) {
    logger.error('Failed to connect to the database', error)
    throw error
  }
}

export default prisma
