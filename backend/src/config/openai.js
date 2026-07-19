import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const MODELS = {
  CHAT: process.env.OPENAI_MODEL || 'gpt-4o',
  ANALYSIS: 'gpt-4o',
  FAST: 'gpt-4o-mini',
}

export default openai
