import express from 'express'
import auth from '../middlewares/authMiddleware.js'
import {
  listReviews,
  createReview,
  deleteReview
} from '../controllers/reviewController.js'

const router = express.Router()

router.get('/', listReviews)

router.post('/', auth, createReview)
router.delete('/:id', auth, deleteReview)


export default router
