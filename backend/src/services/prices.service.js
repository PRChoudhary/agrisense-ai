import prisma from '../config/database.js'

/**
 * Get paginated prices with all filters
 * @param {object} filters
 * @param {number} page
 * @param {number} limit
 */
export const getPrices = async (filters, page = 1, limit = 24) => {
  const {
    cropId,
    mandiId,
    state,
    district,
    search,
    date,
    dateFrom,
    dateTo,
    sortBy = 'date',
    sortOrder = 'desc',
  } = filters

  const where = {}

  if (cropId) where.cropId = cropId
  if (mandiId) where.mandiId = mandiId

  // Date filters
  if (date) {
    const d = new Date(date)
    const nextDay = new Date(d)
    nextDay.setDate(nextDay.getDate() + 1)
    where.date = { gte: d, lt: nextDay }
  } else if (dateFrom || dateTo) {
    where.date = {}
    if (dateFrom) where.date.gte = new Date(dateFrom)
    if (dateTo) where.date.lte = new Date(dateTo)
  }

  // State and district filter via mandi relation
  if (state || district || search) {
    where.mandi = {}
    if (state) {
      where.mandi.state = { name: { contains: state, mode: 'insensitive' } }
    }
    if (district) {
      where.mandi.district = { name: { contains: district, mode: 'insensitive' } }
    }
    if (search) {
      // Search across crop name, mandi name, state name
      where.OR = [
        { crop: { name: { contains: search, mode: 'insensitive' } } },
        { mandi: { name: { contains: search, mode: 'insensitive' } } },
        { mandi: { state: { name: { contains: search, mode: 'insensitive' } } } },
        { mandi: { city: { contains: search, mode: 'insensitive' } } },
      ]
    }
  }

  // Validate sortBy to prevent injection
  const validSortFields = ['date', 'modalPrice', 'minPrice', 'maxPrice', 'arrivalQuantity']
  const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'date'
  const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

  const skip = (parseInt(page) - 1) * parseInt(limit)
  const take = parseInt(limit)

  const [data, total] = await Promise.all([
    prisma.price.findMany({
      where,
      skip,
      take,
      orderBy: { [safeSortBy]: safeSortOrder },
      include: {
        crop: {
          include: { category: true }
        },
        mandi: {
          include: {
            state: true,
            district: true,
          }
        },
      },
    }),
    prisma.price.count({ where }),
  ])

  return { data, total }
}

/**
 * Get latest price for each unique crop+mandi combination
 */
export const getLatestPrices = async (filters = {}) => {
  const { cropId, mandiId, state, limit = 50 } = filters
  const where = {}
  if (cropId) where.cropId = cropId
  if (mandiId) where.mandiId = mandiId
  if (state) where.mandi = { state: { name: { contains: state, mode: 'insensitive' } } }

  return prisma.price.findMany({
    where,
    orderBy: { date: 'desc' },
    take: parseInt(limit),
    include: {
      crop: { include: { category: true } },
      mandi: { include: { state: true, district: true } },
    },
  })
}

/**
 * Get price trend for a crop over last 30 days
 * @param {string} cropId
 * @param {string} [mandiId]
 * @returns {object[]} sorted price records oldest to newest
 */
export const getCropTrend = async (cropId, mandiId) => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const where = {
    cropId,
    date: { gte: thirtyDaysAgo },
  }
  if (mandiId) where.mandiId = mandiId

  const prices = await prisma.price.findMany({
    where,
    orderBy: { date: 'asc' },
    include: { mandi: { include: { state: true } } },
  })

  return prices
}

/**
 * Get crop price summary with real trend direction
 * @param {string} cropId
 */
export const getCropSummary = async (cropId) => {
  const [agg, recentPrices] = await Promise.all([
    prisma.price.aggregate({
      where: { cropId },
      _min: { modalPrice: true },
      _max: { modalPrice: true },
      _avg: { modalPrice: true },
      _count: { id: true },
    }),
    // Get last 2 records to compute trend direction
    prisma.price.findMany({
      where: { cropId },
      orderBy: { date: 'desc' },
      take: 2,
      select: { modalPrice: true, date: true },
    }),
  ])

  // Real trend direction
  let trendDirection = 'STABLE'
  if (recentPrices.length >= 2) {
    const latest = recentPrices[0].modalPrice
    const previous = recentPrices[1].modalPrice
    const diff = ((latest - previous) / previous) * 100
    if (diff > 1) trendDirection = 'UP'
    else if (diff < -1) trendDirection = 'DOWN'
  }

  return {
    minPrice: agg._min.modalPrice,
    maxPrice: agg._max.modalPrice,
    avgPrice: agg._avg.modalPrice,
    totalRecords: agg._count.id,
    trendDirection,
  }
}
