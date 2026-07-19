import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { generalLimiter } from './middleware/rateLimit.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'
import routes from './routes/index.js'
import { corsOptions } from './config/cors.js'
import { httpLogger } from './utils/logger.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors(corsOptions))

// Request parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan('combined', { stream: httpLogger }))

// Rate limiting
app.use('/api', generalLimiter)

// Routes
app.use('/api/v1', routes)

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
)

// 404 handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
)

// Error handler (must be last)
app.use(errorHandler)

export default app
