
import express from 'express'
import auth from '../middlewares/authMiddleware.js'

import { createPayment, createCheckoutSession } from '../controllers/paymentController.js'

const router = express.Router()

router.use(auth)

router.post('/create', createPayment)
router.post('/checkout', createCheckoutSession)

export default router
