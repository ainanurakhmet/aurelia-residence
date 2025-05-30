import Booking from '../models/Booking.js'
import User from '../models/User.js'
import Room from '../models/Room.js'

export async function listAllBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('room', 'title price')
      .sort('-createdAt')
    res.json({ bookings })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function toggleBookingPaid(req, res) {
  try {
    const { id } = req.params
    const booking = await Booking.findById(id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    booking.paid = !booking.paid
    await booking.save()
    res.json({ booking })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params
    const booking = await Booking.findById(id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    await booking.deleteOne()     
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
