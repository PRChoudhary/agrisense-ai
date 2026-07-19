import prisma from '../config/database.js'

export const getAllCrops = async (filters = {}) => {
  let { categoryId, search, isActive = true } = filters
  if (typeof isActive === 'string') isActive = isActive === 'true'
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
