import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import { getEarningsReport } from '../controllers/adminPaymentController.js'

const router = express.Router()

router.use(auth)
router.use((req, res, next) => {
  if (!['admin','superadmin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
})

router.get('/earnings', getEarningsReport)

export default router
