import { Router } from 'express'
import * as cropController from '../controllers/crop.controller.js'

const router = Router()

router.get('/', cropController.getCrops)
router.get('/:id', cropController.getCropById)

export default router
