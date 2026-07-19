import prisma from '../config/database.js'

export const getMandis = async (filters = {}) => {
  const { state, district, city, search, limit = 100 } = filters
  const where = { isActive: true }

  if (state) {
    where.state = { name: { contains: state, mode: 'insensitive' } }
  }
  if (district) {
    where.district = { name: { contains: district, mode: 'insensitive' } }
  }
  if (city) {
    where.city = { contains: city, mode: 'insensitive' }
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ]
  }

  return prisma.mandi.findMany({
    where,
    take: parseInt(limit),
    orderBy: { name: 'asc' },
    include: {
      state: true,
      district: true,
    },
  })
}

export const getMandiById = async (id) => {
  return prisma.mandi.findUnique({
    where: { id },
    include: { state: true, district: true },
  })
}

export const getNearbyMandis = async (lat, lng, radiusKm = 50) => {
  // Haversine approximation using bounding box for performance
  const latDelta = radiusKm / 111
  const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180))

  const mandis = await prisma.mandi.findMany({
    where: {
      isActive: true,
      latitude: { gte: lat - latDelta, lte: lat + latDelta },
      longitude: { gte: lng - lngDelta, lte: lng + lngDelta },
    },
    include: { state: true, district: true },
    take: 20,
  })

  // Sort by actual distance
  return mandis
    .map(m => ({
      ...m,
      distance: Math.round(
        Math.sqrt(Math.pow((m.latitude - lat) * 111, 2) + Math.pow((m.longitude - lng) * 111 * Math.cos((lat * Math.PI) / 180), 2))
      )
    }))
    .sort((a, b) => a.distance - b.distance)
}

export const getStates = async () => {
  const states = await prisma.state.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, code: true },
  })
  return states
}
