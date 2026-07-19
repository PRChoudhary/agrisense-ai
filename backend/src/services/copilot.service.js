import prisma from '../config/database.js'
import openai, { MODELS } from '../config/openai.js'
import { logger } from '../utils/logger.js'

/** System prompt for AgriSense AI Copilot */
const SYSTEM_PROMPT = `You are AgriSense AI Copilot, an expert agricultural market intelligence assistant built specifically for Indian farmers.

Your purpose is to help farmers make the best crop selling decisions by analyzing:
- Live mandi prices across India
- Weather conditions and forecasts
- Market trends and news
- Government MSP (Minimum Support Price) data
- Seasonal patterns and demand analysis

## Your Personality
- Warm, helpful, and respectful — like a knowledgeable friend
- Speak directly to the farmer in simple language
- Always give SPECIFIC, ACTIONABLE recommendations — not vague advice
- When farmer writes in Hindi, respond FULLY in Hindi (Devanagari script)
- When farmer writes in English, respond in English
- Use ₹ symbol for prices, always mention per quintal (प्रति क्विंटल)

## Response Format
- Lead with a CLEAR recommendation (Sell Today / Wait / Best Mandi)
- Back it up with data from the context below
- Keep responses under 300 words unless complex analysis is needed
- Use bullet points for multiple insights
- Always mention MSP for reference when discussing a crop

## Important
- Never make up prices — only use data provided in context
- If no price data available for a crop, say so clearly
- Always compare current price to MSP to help farmer know if they are getting fair value
- Consider weather impact on price predictions
- Be honest about uncertainty — say "likely" or "probably" when uncertain`

/**
 * Build rich context for the AI based on the message
 * @param {string} message - user's message
 * @param {string} language
 * @returns {string} formatted context string
 */
async function buildContext(message) {
  const contextParts = []

  try {
    // Fetch recent prices (last 7 days, top 20)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentPrices = await prisma.price.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: 'desc' },
      take: 30,
      include: {
        crop: true,
        mandi: { include: { state: true } },
      },
    })

    if (recentPrices.length > 0) {
      const priceLines = recentPrices.map(p =>
        `${p.crop.name} (${p.crop.nameHindi || ''}) at ${p.mandi.name}, ${p.mandi.state.name}: ₹${p.modalPrice}/qt (Min: ₹${p.minPrice}, Max: ₹${p.maxPrice}, Arrival: ${p.arrivalQuantity}qt) on ${new Date(p.date).toLocaleDateString('en-IN')}${
          p.crop.mspPrice ? ` | MSP: ₹${p.crop.mspPrice}` : ''
        }`
      )
      contextParts.push(`## Recent Mandi Prices (Last 7 Days)\n${priceLines.join('\n')}`)
    }

    // Fetch MSP data for all crops
    const crops = await prisma.crop.findMany({
      where: { isActive: true, mspPrice: { not: null } },
      select: { name: true, nameHindi: true, mspPrice: true, season: true },
      take: 30,
    })

    if (crops.length > 0) {
      const mspLines = crops.map(c =>
        `${c.name}${c.nameHindi ? ` (${c.nameHindi})` : ''}: MSP ₹${c.mspPrice}/qt${c.season ? ` | Season: ${c.season}` : ''}`
      )
      contextParts.push(`## Government MSP Prices 2024-25\n${mspLines.join('\n')}`)
    }

    // Fetch recent weather data if available
    const recentWeather = await prisma.weatherData.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 5,
      select: { location: true, state: true, temperature: true, humidity: true, rainfall: true, condition: true, riskLevel: true },
    })

    if (recentWeather.length > 0) {
      const weatherLines = recentWeather.map(w =>
        `${w.location}, ${w.state}: ${w.temperature}°C, ${w.condition}, Humidity: ${w.humidity}%, Rain: ${w.rainfall}mm, Risk: ${w.riskLevel}`
      )
      contextParts.push(`## Current Weather Conditions\n${weatherLines.join('\n')}`)
    }

    // Today's date for temporal awareness
    contextParts.push(`## Current Date\n${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`)

  } catch (error) {
    logger.error('Context building error:', error)
    contextParts.push('## Note\nLive price data temporarily unavailable. Providing general agricultural advice.')
  }

  return contextParts.join('\n\n')
}

/**
 * Main streaming chat function
 * @param {{ message: string, sessionId: string|null, userId: string|null, language: string, sendEvent: function }} params
 */
export const streamChatResponse = async ({ message, sessionId, userId, language, sendEvent }) => {
  let session = null
  let chatHistory = []

  // Load or create session
  if (sessionId && userId) {
    session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
      },
    })

    if (session) {
      chatHistory = session.messages.map(m => ({
        role: m.role.toLowerCase(),
        content: m.content,
      }))
    }
  }

  // Build dynamic context from DB
  const context = await buildContext(message)

  // Construct messages array for OpenAI
  const messages = [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\n---\n\n# LIVE DATA CONTEXT\n${context}`,
    },
    ...chatHistory,
    { role: 'user', content: message },
  ]

  // Signal to frontend that streaming is starting
  sendEvent({ type: 'start', sessionId: session?.id || null })

  // Stream from OpenAI
  let fullContent = ''
  let promptTokens = 0
  let completionTokens = 0

  const stream = openai.beta.chat.completions.stream({
    model: MODELS.CHAT,
    messages,
    max_tokens: 1000,
    temperature: 0.7,
    stream: true,
  })

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || ''
    if (delta) {
      fullContent += delta
      sendEvent({ type: 'token', content: delta })
    }
  }

  // Get final usage stats
  try {
    const finalMessage = await stream.finalMessage()
    promptTokens = finalMessage.usage?.prompt_tokens || 0
    completionTokens = finalMessage.usage?.completion_tokens || 0
  } catch (e) {
    // Usage stats optional
  }

  // Save messages to DB if user is authenticated
  if (userId) {
    // Auto-create session if none
    if (!session) {
      const title = message.slice(0, 60) + (message.length > 60 ? '...' : '')
      session = await prisma.chatSession.create({
        data: {
          userId,
          title,
          language: language === 'HI' ? 'HI' : 'EN',
        },
      })
    }

    // Save user message + AI response
    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: session.id,
          role: 'USER',
          content: message,
          metadata: {},
        },
        {
          sessionId: session.id,
          role: 'ASSISTANT',
          content: fullContent,
          metadata: { promptTokens, completionTokens, model: MODELS.CHAT },
        },
      ],
    })

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    })
  }

  // Send completion event
  sendEvent({
    type: 'done',
    sessionId: session?.id || null,
    sessionTitle: session?.title || null,
    tokens: { prompt: promptTokens, completion: completionTokens },
  })
}

/**
 * Get all sessions for a user (newest first)
 * @param {string} userId
 */
export const getUserSessions = async (userId) => {
  return prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1, // Latest message for preview
        select: { content: true, role: true, createdAt: true },
      },
      _count: { select: { messages: true } },
    },
  })
}

/**
 * Get a single session with all messages
 * @param {string} sessionId
 * @param {string} userId
 */
export const getSessionById = async (sessionId, userId) => {
  return prisma.chatSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

/**
 * Create a new chat session
 * @param {string} userId
 * @param {string} title
 * @param {string} language
 */
export const createSession = async (userId, title = 'New Conversation', language = 'EN') => {
  return prisma.chatSession.create({
    data: { userId, title, language },
  })
}

/**
 * Delete a session and all its messages
 * @param {string} sessionId
 * @param {string} userId
 */
export const deleteSession = async (sessionId, userId) => {
  return prisma.chatSession.deleteMany({
    where: { id: sessionId, userId },
  })
}

/**
 * Update session title
 */
export const updateSessionTitle = async (sessionId, userId, title) => {
  return prisma.chatSession.updateMany({
    where: { id: sessionId, userId },
    data: { title },
  })
}
