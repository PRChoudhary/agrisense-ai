import prisma from '../config/database.js'

export const getAllCrops = async (filters = {}) => {
  const { categoryId, search, isActive = true } = filters
  const where = { isActive }
  if (categoryId) where.categoryId = categoryId
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { nameHindi: { contains: search, mode: 'insensitive' } },
    ]
  }
  return prisma.crop.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { category: true },
  })
}

export const getCropById = async (id) => {
  return prisma.crop.findUnique({
    where: { id },
    include: { category: true },
  })
}
