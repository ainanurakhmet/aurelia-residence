import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import {
  createBooking,
  checkAvailability,
  listMyBookings
} from '../controllers/bookingController.js';

const router = express.Router();

router.use(auth);

router.get('/', listMyBookings);
router.get('/availability', checkAvailability);
router.post('/', createBooking);

export default router;
