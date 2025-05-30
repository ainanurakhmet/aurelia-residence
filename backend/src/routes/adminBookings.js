import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import { listAllBookings, toggleBookingPaid, deleteBooking } from '../controllers/adminBookingController.js'

const router = express.Router()

router.use(auth, (req, res, next) => {
  if (!['admin','superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
})

router.get('/', listAllBookings)
router.put('/:id/toggle-paid', toggleBookingPaid)
router.delete('/:id', deleteBooking)

export default router
