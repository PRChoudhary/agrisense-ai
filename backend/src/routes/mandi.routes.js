import { Router } from 'express'
import * as mandiController from '../controllers/mandi.controller.js'

const router = Router()

router.get('/states', mandiController.getStates)
router.get('/nearby', mandiController.getNearbyMandis)
router.get('/', mandiController.getMandis)
router.get('/:id', mandiController.getMandiById)

export default router
