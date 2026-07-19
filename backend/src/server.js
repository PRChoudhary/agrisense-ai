import 'dotenv/config'

import app from './app.js'
import { logger } from './utils/logger.js'
import { connectDatabase } from './config/database.js'

const PORT = process.env.PORT || 5000

/**
 * Starts the application server
 */
async function startServer() {
  try {
    await connectDatabase()
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, '0.0.0.0', () => {
        logger.info(`🌿 AgriSense AI Server running on port ${PORT}`)
        logger.info(`📊 Environment: ${process.env.NODE_ENV}`)
      })
    }
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default app
