import prisma from '../config/database.js'
import openai, { MODELS } from '../config/openai.js'
import { logger } from '../utils/logger.js'

/**
 * IDs of popular crops to generate top predictions for
 * We dynamically fetch the most-priced crops from the DB
 */

/**
 * Get crop prediction — checks cache first, generates if stale
 * @param {{ cropId: string, mandiId?: string, forceRefresh?: boolean }} params
 */
export const getCropPrediction = async ({ cropId, mandiId, forceRefresh = false }) => {
  // Check for cached prediction (within 6 hours)
  if (!forceRefresh) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000)
    const cached = await prisma.prediction.findFirst({
      where: {
        cropId,
        mandiId: mandiId || null,
        createdAt: { gte: sixHoursAgo },
        targetDate: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      include: { crop: true, mandi: { include: { state: true } } },
    })

    if (cached) {
      logger.info(`Returning cached prediction for cropId=${cropId}`)
      // Fetch all predictions in the same batch (same crop, same day)
      const batchPredictions = await prisma.prediction.findMany({
        where: {
          cropId,
          mandiId: mandiId || null,
          createdAt: { gte: new Date(cached.createdAt.getTime() - 1000) }, // within 1 second of each other
        },
        orderBy: { targetDate: 'asc' },
        include: { crop: true },
      })
      
      if (batchPredictions.length >= 7) {
        return formatCachedPrediction(cached, batchPredictions)
      }
    }
  }

  return generatePrediction({ cropId, mandiId })
}

/**
 * Format cached DB predictions into the standard response shape
 */
function formatCachedPrediction(latest, batch) {
  return {
    cropId: latest.cropId,
    cropName: latest.crop.name,
    cropNameHindi: latest.crop.nameHindi,
    mandiId: latest.mandiId,
    trend: latest.reasoning ? JSON.parse(latest.reasoning || '{}').trend || 'STABLE' : 'STABLE',
    confidence: latest.confidence,
    recommendation: latest.reasoning ? JSON.parse(latest.reasoning || '{}').recommendation || 'WAIT' : 'WAIT',
    reasoning: latest.reasoning ? JSON.parse(latest.reasoning || '{}').reasoning || '' : '',
    keyFactors: latest.reasoning ? JSON.parse(latest.reasoning || '{}').keyFactors || [] : [],
    predictions: batch.map(p => ({
      date: p.targetDate.toISOString().split('T')[0],
      price: p.predictedPrice,
      low: p.minPrediction,
      high: p.maxPrediction,
    })),
    currentPrice: latest.reasoning ? JSON.parse(latest.reasoning || '{}').currentPrice : null,
    mspPrice: latest.crop.mspPrice,
    isCached: true,
    generatedAt: latest.createdAt,
  }
}

/**
 * Generate a fresh AI prediction for a crop
 * @param {{ cropId: string, mandiId?: string }} params
 */
async function generatePrediction({ cropId, mandiId }) {
  // 1. Fetch crop info
  const crop = await prisma.crop.findUnique({
    where: { id: cropId },
    include: { category: true },
  })
  if (!crop) throw new Error('Crop not found')

  // 2. Fetch last 30 days of price history
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const priceHistory = await prisma.price.findMany({
    where: {
      cropId,
      ...(mandiId ? { mandiId } : {}),
      date: { gte: thirtyDaysAgo },
    },
    orderBy: { date: 'asc' },
    include: {
      mandi: { include: { state: true } },
    },
    take: 60, // max 60 entries
  })

  if (priceHistory.length < 3) {
    // Try without mandi filter
    const allHistory = await prisma.price.findMany({
      where: { cropId, date: { gte: thirtyDaysAgo } },
      orderBy: { date: 'asc' },
      take: 60,
    })
    
    if (allHistory.length < 3) {
      logger.warn(`Insufficient price history for crop ${crop.name} (${allHistory.length} records)`)
      return generateMockPrediction(crop)
    }
    priceHistory.push(...allHistory)
  }

  // 3. Aggregate by date (avg modal price per day)
  const dailyPrices = {}
  priceHistory.forEach(p => {
    const date = p.date.toISOString().split('T')[0]
    if (!dailyPrices[date]) dailyPrices[date] = []
    dailyPrices[date].push(p.modalPrice)
  })

  const historicalSeries = Object.entries(dailyPrices)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, prices]) => ({
      date,
      price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }))

  const currentPrice = historicalSeries[historicalSeries.length - 1]?.price || 0
  const oldestPrice = historicalSeries[0]?.price || currentPrice
  const priceChangePct = oldestPrice > 0 ? ((currentPrice - oldestPrice) / oldestPrice * 100).toFixed(1) : '0'

  // 4. Call GPT-4o for prediction
  const historicalText = historicalSeries
    .map(d => `${d.date}: ₹${d.price}/quintal`)
    .join('\n')

  const prompt = `You are an expert Indian agricultural commodity price analyst specializing in APMC mandi market dynamics.

Generate a 7-day price prediction for ${crop.name}${crop.nameHindi ? ` (${crop.nameHindi})` : ''} in Indian mandis.

Historical Price Data (last ${historicalSeries.length} days):
${historicalText}

Crop Information:
- Category: ${crop.category.name}
- Season: ${crop.season || 'All year'}
- MSP (Minimum Support Price): ${crop.mspPrice ? `₹${crop.mspPrice}/quintal` : 'Not set'}
- Current Average Price: ₹${currentPrice}/quintal
- Price Change (30 days): ${priceChangePct}%

Consider these Indian market factors:
- APMC mandi arrival patterns
- Seasonal demand changes
- Government procurement operations
- Storage and transportation logistics
- Festival season impacts (if relevant to current date)
- Export/import dynamics for this commodity

Return ONLY valid JSON with this exact structure:
{
  "predictions": [
    { "date": "YYYY-MM-DD", "price": <number>, "low": <number>, "high": <number> },
    ... (exactly 7 entries, starting tomorrow)
  ],
  "trend": "UP" | "DOWN" | "STABLE",
  "confidence": <number 0-100>,
  "recommendation": "SELL_NOW" | "SELL_IN_3_DAYS" | "SELL_IN_7_DAYS" | "WAIT",
  "reasoning": "<2-3 sentence explanation of the prediction>",
  "keyFactors": ["factor 1", "factor 2", "factor 3"]
}`

  let aiResult = null

  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-...') {
    try {
      const response = await openai.chat.completions.create({
        model: MODELS.ANALYSIS,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
        temperature: 0.4, // Lower temperature for more consistent predictions
      })
      aiResult = JSON.parse(response.choices[0].message.content)
      logger.info(`AI prediction generated for ${crop.name}: trend=${aiResult.trend}, confidence=${aiResult.confidence}`)
    } catch (error) {
      logger.error('AI prediction error:', error.message)
      aiResult = null
    }
  }

  // Fallback: generate statistical prediction if AI fails
  if (!aiResult) {
    aiResult = generateStatisticalPrediction(historicalSeries, crop)
  }

  // Validate predictions structure
  if (!aiResult.predictions || aiResult.predictions.length < 7) {
    aiResult = generateStatisticalPrediction(historicalSeries, crop)
  }

  // 5. Save predictions to DB (one row per day)
  const today = new Date()
  try {
    await prisma.prediction.createMany({
      data: aiResult.predictions.map((p, i) => {
        const targetDate = new Date(today)
        targetDate.setDate(targetDate.getDate() + i + 1)
        return {
          cropId,
          mandiId: mandiId || null,
          predictedPrice: p.price,
          minPrediction: p.low,
          maxPrediction: p.high,
          confidence: aiResult.confidence,
          horizon: i + 1,
          reasoning: JSON.stringify({
            trend: aiResult.trend,
            recommendation: aiResult.recommendation,
            reasoning: aiResult.reasoning,
            keyFactors: aiResult.keyFactors,
            currentPrice,
          }),
          targetDate,
        }
      }),
    })
  } catch (dbError) {
    logger.error('Failed to save predictions to DB:', dbError.message)
  }

  // 6. Build historical series for chart
  const chartHistory = historicalSeries.slice(-14).map(d => ({
    date: d.date,
    price: d.price,
    type: 'actual',
  }))

  return {
    cropId,
    cropName: crop.name,
    cropNameHindi: crop.nameHindi,
    mandiId: mandiId || null,
    trend: aiResult.trend,
    confidence: aiResult.confidence,
    recommendation: aiResult.recommendation,
    reasoning: aiResult.reasoning,
    keyFactors: aiResult.keyFactors || [],
    predictions: aiResult.predictions,
    historicalPrices: chartHistory,
    currentPrice,
    mspPrice: crop.mspPrice,
    isCached: false,
    generatedAt: new Date(),
  }
}

/**
 * Statistical prediction fallback (no AI key required)
 * Uses linear regression + seasonal adjustment
 */
function generateStatisticalPrediction(historicalSeries, crop) {
  const prices = historicalSeries.map(d => d.price)
  const n = prices.length
  const currentPrice = prices[n - 1]
  
  // Simple linear regression
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
  prices.forEach((price, i) => {
    sumX += i; sumY += price; sumXY += i * price; sumX2 += i * i
  })
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  
  // Recent trend (last 7 days vs previous 7 days)
  const recent = prices.slice(-7)
  const older = prices.slice(-14, -7)
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
  const olderAvg = older.length > 0 ? older.reduce((a, b) => a + b, 0) / older.length : recentAvg
  const trendPct = ((recentAvg - olderAvg) / olderAvg) * 100

  const trend = trendPct > 3 ? 'UP' : trendPct < -3 ? 'DOWN' : 'STABLE'
  const confidence = Math.min(85, Math.max(40, 70 - Math.abs(trendPct) * 0.5))
  
  let recommendation = 'WAIT'
  if (trend === 'UP' && trendPct > 5) recommendation = 'SELL_IN_3_DAYS'
  else if (trend === 'DOWN') recommendation = 'SELL_NOW'
  else if (trend === 'STABLE') recommendation = 'SELL_IN_7_DAYS'

  const today = new Date()
  const predictions = Array.from({ length: 7 }).map((_, i) => {
    const targetDate = new Date(today)
    targetDate.setDate(targetDate.getDate() + i + 1)
    const projected = Math.round(currentPrice + slope * (n + i) - slope * (n - 1) + (Math.random() - 0.5) * currentPrice * 0.02)
    const variance = Math.round(currentPrice * 0.05)
    return {
      date: targetDate.toISOString().split('T')[0],
      price: Math.max(0, projected),
      low: Math.max(0, projected - variance),
      high: projected + variance,
    }
  })

  const mspRef = crop.mspPrice ? `MSP is ₹${crop.mspPrice}/qt.` : ''
  return {
    predictions,
    trend,
    confidence: Math.round(confidence),
    recommendation,
    reasoning: `Based on ${n} days of historical data, ${crop.name} prices show a ${trend.toLowerCase()} trend (${trendPct.toFixed(1)}% over last 14 days). ${mspRef} Statistical model used — add OpenAI API key for AI-powered predictions.`,
    keyFactors: [
      `${trend === 'UP' ? 'Upward' : trend === 'DOWN' ? 'Downward' : 'Stable'} price momentum detected`,
      `Current price ₹${currentPrice}/qt vs ${n}-day average ₹${Math.round(prices.reduce((a,b)=>a+b,0)/n)}/qt`,
      crop.mspPrice ? `MSP support at ₹${crop.mspPrice}/qt provides price floor` : 'No MSP data available',
    ],
  }
}

/**
 * Pure mock prediction for crops with no price history
 */
function generateMockPrediction(crop) {
  const basePrice = crop.mspPrice || 2000
  const today = new Date()
  
  const predictions = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i + 1)
    const price = Math.round(basePrice * (1 + (Math.random() - 0.4) * 0.1))
    return {
      date: date.toISOString().split('T')[0],
      price,
      low: Math.round(price * 0.95),
      high: Math.round(price * 1.05),
    }
  })

  return {
    cropId: crop.id,
    cropName: crop.name,
    cropNameHindi: crop.nameHindi,
    mandiId: null,
    trend: 'STABLE',
    confidence: 45,
    recommendation: 'WAIT',
    reasoning: `Insufficient price history for ${crop.name}. Add more price data for accurate predictions.`,
    keyFactors: ['Insufficient historical data', 'Predictions based on MSP floor price', 'Seed more price data for better accuracy'],
    predictions,
    historicalPrices: [],
    currentPrice: basePrice,
    mspPrice: crop.mspPrice,
    isMock: true,
    generatedAt: new Date(),
  }
}

/**
 * Get predictions for top 6 most-active crops
 */
export const getTopPredictions = async () => {
  // Find crops with most price records
  const topCrops = await prisma.crop.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { prices: true } },
    },
    orderBy: { prices: { _count: 'desc' } },
    take: 6,
  })

  const predictions = await Promise.all(
    topCrops.map(crop =>
      getCropPrediction({ cropId: crop.id }).catch(err => {
        logger.error(`Failed prediction for ${crop.name}:`, err.message)
        return null
      })
    )
  )

  return predictions.filter(Boolean)
}

/**
 * Get historical predictions for a crop
 */
export const getPredictionHistory = async (cropId) => {
  return prisma.prediction.findMany({
    where: { cropId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { crop: { select: { name: true } }, mandi: { select: { name: true } } },
  })
}
