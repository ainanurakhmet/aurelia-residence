import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import {
  getProfile,
  changePassword,
  listMyBookings,
  listMyPayments
} from '../controllers/userController.js'

const router = express.Router()

router.use(auth)
router.get('/me', getProfile)
router.put('/me/password', changePassword)
router.get('/bookings', listMyBookings)
router.get('/payments', listMyPayments)

export default router
