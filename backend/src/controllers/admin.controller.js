import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess, sendError } from '../utils/response.js'
import prisma from '../config/database.js'
import { logger } from '../utils/logger.js'

/**
 * GET /admin/stats
 * Get overall system statistics
 */
export const getStats = asyncHandler(async (req, res) => {
  const [
    userCount,
    mandiCount,
    cropCount,
    priceCount,
    weatherCount,
    newsCount,
    alertCount,
    sessionCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.mandi.count(),
    prisma.crop.count(),
    prisma.price.count(),
    prisma.weatherData.count(),
    prisma.news.count(),
    prisma.alert.count(),
    prisma.chatSession.count()
  ])

  const stats = {
    users: userCount,
    mandis: mandiCount,
    crops: cropCount,
    priceRecords: priceCount,
    weatherLogs: weatherCount,
    newsArticles: newsCount,
    activeAlerts: alertCount,
    chatSessions: sessionCount,
    serverUptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  }

  return sendSuccess(res, stats, 'System statistics retrieved')
})

/**
 * POST /admin/seed
 * Seed or re-populate initial crop, mandi, price and news data
 */
export const seedDatabase = asyncHandler(async (req, res) => {
  logger.info('Admin triggered database seeding...')

  // Check if categories exist
  let catCount = await prisma.cropCategory.count()
  if (catCount === 0) {
    const categories = ['Cereals', 'Vegetables', 'Fruits', 'Pulses', 'Oilseeds', 'Spices', 'Fibers']
    for (const name of categories) {
      await prisma.cropCategory.create({ data: { name } })
    }
  }

  // Create state & districts if empty
  let stateCount = await prisma.state.count()
  if (stateCount === 0) {
    await prisma.state.create({
      data: {
        name: 'Maharashtra',
        code: 'MH',
        districts: {
          create: [{ name: 'Nashik' }, { name: 'Pune' }, { name: 'Mumbai' }]
        }
      }
    })
    await prisma.state.create({
      data: {
        name: 'Delhi',
        code: 'DL',
        districts: {
          create: [{ name: 'Azadpur' }, { name: 'North Delhi' }]
        }
      }
    })
  }

  const state = await prisma.state.findFirst({ include: { districts: true } })
  const district = state?.districts[0]
  const cat = await prisma.cropCategory.findFirst()

  // Ensure crops exist
  let cropCount = await prisma.crop.count()
  if (cropCount < 5) {
    const defaultCrops = [
      { name: 'Wheat', mspPrice: 2275, unit: 'Quintal' },
      { name: 'Rice (Paddy)', mspPrice: 2183, unit: 'Quintal' },
      { name: 'Onion', mspPrice: null, unit: 'Quintal' },
      { name: 'Tomato', mspPrice: null, unit: 'Quintal' },
      { name: 'Potato', mspPrice: null, unit: 'Quintal' },
      { name: 'Cotton', mspPrice: 6620, unit: 'Quintal' },
      { name: 'Mustard', mspPrice: 5650, unit: 'Quintal' }
    ]

    for (const c of defaultCrops) {
      await prisma.crop.upsert({
        where: { name: c.name },
        update: {},
        create: {
          name: c.name,
          categoryId: cat.id,
          mspPrice: c.mspPrice,
          unit: c.unit,
        }
      })
    }
  }

  // Ensure mandis exist
  let mandiCount = await prisma.mandi.count()
  if (mandiCount < 3 && state && district) {
    const defaultMandis = [
      { name: 'APMC Azadpur', city: 'Delhi' },
      { name: 'APMC Lasalgaon', city: 'Nashik' },
      { name: 'APMC Vashi', city: 'Mumbai' }
    ]

    for (const m of defaultMandis) {
      await prisma.mandi.upsert({
        where: { name_stateId: { name: m.name, stateId: state.id } },
        update: {},
        create: {
          name: m.name,
          city: m.city,
          stateId: state.id,
          districtId: district.id,
          latitude: 19.99,
          longitude: 73.78
        }
      })
    }
  }

  // Create sample prices
  const crops = await prisma.crop.findMany()
  const mandis = await prisma.mandi.findMany()
  const today = new Date()

  for (const crop of crops) {
    for (const mandi of mandis) {
      const existing = await prisma.price.findFirst({
        where: { cropId: crop.id, mandiId: mandi.id }
      })
      if (!existing) {
        const base = crop.mspPrice || 2200
        await prisma.price.create({
          data: {
            cropId: crop.id,
            mandiId: mandi.id,
            modalPrice: base + Math.floor(Math.random() * 400 - 200),
            minPrice: Math.round(base * 0.9),
            maxPrice: Math.round(base * 1.1),
            arrivalQuantity: Math.floor(Math.random() * 800 + 200),
            date: today
          }
        })
      }
    }
  }

  return sendSuccess(res, { success: true }, 'Database seed check completed successfully')
})
