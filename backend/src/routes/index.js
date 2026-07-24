import { Router } from 'express'
import authRoutes from './auth.routes.js'
import priceRoutes from './prices.routes.js'
import mandiRoutes from './mandi.routes.js'
import cropRoutes from './crop.routes.js'
import copilotRoutes from './copilot.routes.js'
import weatherRoutes from './weather.routes.js'
import predictionsRoutes from './predictions.routes.js'
import newsRoutes from './news.routes.js'
import alertsRoutes from './alerts.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/prices', priceRoutes)
router.use('/mandis', mandiRoutes)
router.use('/crops', cropRoutes)
router.use('/copilot', copilotRoutes)
router.use('/weather', weatherRoutes)
router.use('/predictions', predictionsRoutes)
router.use('/news', newsRoutes)
router.use('/alerts', alertsRoutes)
router.use('/admin', adminRoutes)

export default router
