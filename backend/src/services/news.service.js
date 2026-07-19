import axios from 'axios'
import prisma from '../config/database.js'
import openai, { MODELS } from '../config/openai.js'
import { logger } from '../utils/logger.js'

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_API_BASE = 'https://newsapi.org/v2'

/**
 * Rich mock news data for Indian agriculture
 * Used when no NewsAPI key is configured
 */
const MOCK_NEWS = [
  {
    title: 'Wheat MSP hiked by ₹150 per quintal for Rabi season 2024-25',
    summary: 'The Cabinet Committee on Economic Affairs approved a ₹150 increase in the Minimum Support Price for wheat, benefiting over 15 million farmers across Punjab, Haryana, and UP.',
    aiSummary: 'Government raised wheat MSP to ₹2,275/quintal, a 7% increase. Farmers in key wheat-producing states will directly benefit. Expect market prices to stabilize above MSP floor in coming weeks.',
    category: 'POSITIVE',
    impact: 'HIGH',
    source: 'The Economic Times',
    sourceUrl: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    title: 'Unseasonal rains damage onion crop in Nashik, prices may spike 20-30%',
    summary: 'Heavy unseasonal rainfall in Nashik district has damaged standing onion crops, with farmers reporting 40-50% loss. Mandi arrivals expected to drop significantly in the coming weeks.',
    aiSummary: 'Nashik crop damage will reduce onion supply to major mandis. Prices already up 15% at Lasalgaon APMC. If you hold onion stock, current situation favors selling at higher prices in 1-2 weeks.',
    category: 'NEGATIVE',
    impact: 'HIGH',
    source: 'Maharashtra Times',
    sourceUrl: 'https://maharashtratimes.com',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    title: 'Government opens 500 new PM Kisan Samridhi Kendras for farm inputs',
    summary: 'Under PM Kisan Yojana, 500 new Samridhi Kendras will provide subsidized seeds, fertilizers, and crop insurance to small and marginal farmers across 10 states.',
    aiSummary: 'New centers improve access to subsidized farm inputs. Small farmers can save 20-30% on seeds and fertilizers. Enroll at your nearest Kendra with Aadhaar and land records.',
    category: 'POSITIVE',
    impact: 'MEDIUM',
    source: 'Krishak Jagat',
    sourceUrl: 'https://krishakjagat.org',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    title: 'Tomato prices crash to ₹8/kg as arrivals surge from Karnataka',
    summary: 'Tomato prices at major mandis including Azadpur and Vashi have crashed to ₹8-12/kg as Karnataka harvest peak coincides with low demand. Farmers are distressed.',
    aiSummary: 'Tomato surplus has driven prices well below cost of production. Farmers in Karnataka and Andhra should delay selling if possible. Price recovery expected in 3-4 weeks as summer demand picks up.',
    category: 'NEGATIVE',
    impact: 'HIGH',
    source: 'Agri Business News',
    sourceUrl: 'https://agribusiness.com',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    title: 'India signs $2 billion rice export deal with 3 African nations',
    summary: 'Ministry of Commerce announced a landmark deal to export 2 million tonnes of non-Basmati rice to Nigeria, Ethiopia, and Tanzania over 2 years, supporting domestic prices.',
    aiSummary: 'Export deal removes 2MT of rice from domestic supply, supporting farm-gate prices. Rice farmers in Andhra, Telangana, and Punjab should expect 5-8% price improvement over next quarter.',
    category: 'POSITIVE',
    impact: 'HIGH',
    source: 'Business Standard',
    sourceUrl: 'https://business-standard.com',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    title: 'Cotton prices rise 8% as Pakistan crop hit by floods',
    summary: 'International cotton prices have risen sharply as Pakistan, the world\'s 5th largest producer, reports 30% crop loss due to monsoon flooding. Indian cotton exports projected to increase.',
    aiSummary: 'Pakistan floods create export opportunity for Indian cotton. Prices up 8% in Vidarbha and Gujarat mandis. Cotton farmers holding stocks may benefit from continuing to wait.',
    category: 'POSITIVE',
    impact: 'MEDIUM',
    source: 'Fibre2Fashion',
    sourceUrl: 'https://fibre2fashion.com',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    title: 'Soybean futures fall 3% on USDA bumper crop forecast',
    summary: 'US Department of Agriculture projects a record soybean crop, sending futures lower. Indian soybean prices may face downward pressure due to global supply expectations.',
    aiSummary: 'Global soybean surplus could depress Indian prices by 5-10% over next 2 months. Soybean farmers in Madhya Pradesh and Maharashtra should consider selling current stock rather than holding.',
    category: 'NEGATIVE',
    impact: 'MEDIUM',
    source: 'Agro Spectrum India',
    sourceUrl: 'https://agrospectrum.in',
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
  },
  {
    title: 'Punjab mandis to go fully digital with e-NAM integration by March 2025',
    summary: 'Punjab Agricultural Marketing Board announced all 148 APMCs will complete e-NAM integration, enabling farmers to sell digitally and receive payment within 24 hours.',
    aiSummary: 'Digital mandi integration reduces intermediary costs by 2-3%. Punjab farmers can access buyers from across India, potentially getting better prices. Register on e-NAM portal with your farmer ID.',
    category: 'POSITIVE',
    impact: 'MEDIUM',
    source: 'Tribune India',
    sourceUrl: 'https://tribuneindia.com',
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  },
  {
    title: 'Kharif sowing lags 12% behind last year due to erratic monsoon',
    summary: 'Kharif crop sowing is running 12% behind the corresponding period last year due to uneven monsoon distribution. Rice, pulses, and oilseed sowing are most affected.',
    aiSummary: 'Delayed sowing will reduce Kharif output, supporting prices for rice, arhar dal, and oilseeds later this year. Farmers with existing stocks of these commodities may benefit from holding.',
    category: 'NEGATIVE',
    impact: 'HIGH',
    source: 'Hindu Business Line',
    sourceUrl: 'https://thehindubusinessline.com',
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  },
  {
    title: 'Potato storage up 15% year-on-year; price support unlikely in near term',
    summary: 'Cold storage occupancy data shows potato stocks are 15% higher than last year. Traders expect prices to remain subdued through Q1 as storage inventory is released gradually.',
    aiSummary: 'Potato surplus in cold storage will keep prices low for another 6-8 weeks. Potato farmers should plan harvest timing carefully. Western UP and Punjab growers face most pressure.',
    category: 'NEGATIVE',
    impact: 'MEDIUM',
    source: 'Agri Inputs Online',
    sourceUrl: 'https://agriinputsonline.com',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    title: 'New crop insurance scheme covers post-harvest losses for first time',
    summary: 'PMFBY extended to cover post-harvest storage losses up to 14 days. Farmers storing produce before reaching the mandi can now claim insurance on weather-related damage.',
    aiSummary: 'New PMFBY coverage reduces risk of holding produce for better prices. Farmers can now safely store without fear of weather damage losses. Enroll before next Kharif season begins.',
    category: 'POSITIVE',
    impact: 'HIGH',
    source: 'Down to Earth',
    sourceUrl: 'https://downtoearth.org.in',
    publishedAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
  },
  {
    title: 'Spice exports hit record $4.5 billion; turmeric and chili lead growth',
    summary: 'India\'s spice exports crossed $4.5 billion in FY24, with turmeric up 28% and chili up 19% in value terms. Andhra Pradesh and Telangana farmers are major beneficiaries.',
    aiSummary: 'Record spice exports are driving sustained price improvement for turmeric and chili growers. Andhra and Telangana farmers holding turmeric can expect continued strength.',
    category: 'POSITIVE',
    impact: 'MEDIUM',
    source: 'Spices Board India',
    sourceUrl: 'https://indianspices.com',
    publishedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
  },
]

/**
 * Use GPT-4o-mini to analyze a news article and return category + impact + AI summary
 * @param {{ title: string, summary: string }} article
 * @returns {Promise<{ category: string, impact: string, aiSummary: string }>}
 */
async function analyzeArticleWithAI(article) {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
    return null
  }

  try {
    const prompt = `Analyze this Indian agriculture news article and return JSON:

Title: ${article.title}
Content: ${article.description || article.summary || ''}

Return ONLY valid JSON:
{
  "category": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
  "impact": "HIGH" | "MEDIUM" | "LOW",
  "aiSummary": "2-3 sentence farmer-focused summary with specific actionable insight. What should farmers DO based on this news?"
}

Category: POSITIVE = good for farmer income, NEGATIVE = harmful to income/crops, NEUTRAL = informational
Impact: HIGH = affects prices/income directly this week, MEDIUM = affects in 1-4 weeks, LOW = long-term or indirect`

    const response = await openai.chat.completions.create({
      model: MODELS.FAST,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 200,
      temperature: 0.3,
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    logger.error('AI news analysis error:', error.message)
    return null
  }
}

/**
 * Fetch news from NewsAPI and save to DB
 * @returns {Promise<object[]>} saved articles
 */
export const fetchAndSaveNews = async () => {
  if (!NEWS_API_KEY || NEWS_API_KEY === 'your_newsapi_key') {
    logger.info('No NewsAPI key — seeding mock news data')
    return seedMockNews()
  }

  try {
    const queries = [
      'India agriculture mandi price',
      'India farming crop harvest',
      'India MSP wheat rice farmer',
    ]

    // Fetch from NewsAPI
    const query = queries[Math.floor(Math.random() * queries.length)]
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: NEWS_API_KEY,
      },
      timeout: 10000,
    })

    const rawArticles = response.data.articles || []
    if (rawArticles.length === 0) return seedMockNews()

    const savedArticles = []

    for (const raw of rawArticles.slice(0, 15)) {
      if (!raw.title || raw.title === '[Removed]') continue

      // Check if already in DB
      const existing = await prisma.news.findFirst({
        where: { sourceUrl: raw.url },
      })
      if (existing) continue

      // AI analysis (with graceful fallback)
      const ai = await analyzeArticleWithAI({
        title: raw.title,
        summary: raw.description,
      })

      const article = await prisma.news.create({
        data: {
          title: raw.title,
          summary: raw.description || raw.title,
          content: raw.content,
          aiSummary: ai?.aiSummary || raw.description || raw.title,
          category: ai?.category || 'NEUTRAL',
          impact: ai?.impact || 'MEDIUM',
          source: raw.source?.name || 'News Source',
          sourceUrl: raw.url,
          imageUrl: raw.urlToImage,
          publishedAt: new Date(raw.publishedAt),
        },
      })
      savedArticles.push(article)
    }

    logger.info(`Fetched and saved ${savedArticles.length} news articles from NewsAPI`)
    return savedArticles
  } catch (error) {
    logger.error('NewsAPI fetch error:', error.message)
    return seedMockNews()
  }
}

/**
 * Seed mock news articles into DB (only if not already present)
 */
async function seedMockNews() {
  const count = await prisma.news.count()
  if (count >= 10) {
    logger.info('Mock news already seeded, skipping')
    return prisma.news.findMany({ orderBy: { publishedAt: 'desc' }, take: 12 })
  }

  const saved = []
  for (const mock of MOCK_NEWS) {
    try {
      const existing = await prisma.news.findFirst({ where: { sourceUrl: mock.sourceUrl, title: mock.title } })
      if (existing) continue

      const article = await prisma.news.create({ data: mock })
      saved.push(article)
    } catch (e) {
      logger.error('Mock news seed error:', e.message)
    }
  }

  logger.info(`Seeded ${saved.length} mock news articles`)
  return saved
}

/**
 * Get paginated, filtered news from DB
 * Auto-fetches fresh news if DB is empty or stale
 */
export const getNews = async ({ category, impact, search, page = 1, limit = 12 }) => {
  // Auto-fetch if DB is empty or stale (> 4 hours)
  const count = await prisma.news.count()
  if (count === 0) {
    await fetchAndSaveNews()
  } else {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000)
    const recent = await prisma.news.count({ where: { createdAt: { gte: fourHoursAgo } } })
    if (recent === 0) {
      fetchAndSaveNews().catch(e => logger.error('Background news refresh error:', e.message))
    }
  }

  // Build filter
  const where = {}
  if (category) where.category = category
  if (impact) where.impact = impact
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { summary: { contains: search, mode: 'insensitive' } },
      { aiSummary: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [articles, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.news.count({ where }),
  ])

  return { articles, total }
}

/**
 * Get a single article by ID
 */
export const getNewsById = async (id) => {
  return prisma.news.findUnique({ where: { id } })
}
