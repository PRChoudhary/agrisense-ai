import dotenv from 'dotenv'
dotenv.config()

/**
 * CORS Configuration
 */
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000'
    
    // Allow if no origin (e.g. mobile apps, curl), or exact match, or it's a Vercel URL
    if (!origin || origin === allowedOrigin || origin.endsWith('vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
