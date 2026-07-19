import prisma from '../config/database.js'
import { logger } from '../utils/logger.js'

/**
 * Get all alerts for a user, including the PriceAlert relations
 */
export const getUserAlerts = async (userId) => {
  return prisma.alert.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      priceAlert: {
        include: {
          crop: { select: { id: true, name: true, nameHindi: true } },
          mandi: { select: { id: true, name: true, city: true } },
        }
      }
    }
  })
}

/**
 * Create a new Price Alert
 */
export const createPriceAlert = async (userId, data) => {
  const { name, cropId, mandiId, threshold, direction, emailNotify = true } = data

  let alertName = name
  if (!alertName) {
    // Generate a default name if not provided
    const crop = await prisma.crop.findUnique({ where: { id: cropId } })
    const mandi = mandiId ? await prisma.mandi.findUnique({ where: { id: mandiId } }) : null
    const mandiStr = mandi ? ` at ${mandi.name}` : ''
    alertName = `${crop?.name || 'Crop'} price ${direction === 'ABOVE' ? '>' : '<'} ₹${threshold}${mandiStr}`
  }

  return prisma.alert.create({
    data: {
      userId,
      type: 'PRICE',
      name: alertName,
      emailNotify,
      priceAlert: {
        create: {
          cropId,
          mandiId: mandiId || null,
          threshold: parseFloat(threshold),
          direction,
        }
      }
    },
    include: {
      priceAlert: {
        include: {
          crop: true,
          mandi: true,
        }
      }
    }
  })
}

/**
 * Toggle an alert's active status
 */
export const toggleAlertStatus = async (userId, alertId, isActive) => {
  const alert = await prisma.alert.findFirst({
    where: { id: alertId, userId }
  })

  if (!alert) return null

  return prisma.alert.update({
    where: { id: alertId },
    data: { isActive },
    include: {
      priceAlert: {
        include: { crop: true, mandi: true }
      }
    }
  })
}

/**
 * Delete an alert
 */
export const deleteAlert = async (userId, alertId) => {
  const alert = await prisma.alert.findFirst({
    where: { id: alertId, userId }
  })

  if (!alert) return false

  await prisma.alert.delete({
    where: { id: alertId }
  })
  
  return true
}
