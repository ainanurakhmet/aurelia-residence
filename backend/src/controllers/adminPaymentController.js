import Booking from '../models/Booking.js'

export async function getEarningsReport(req, res) {
  try {
    const paidBookings = await Booking.find({ paid: true })
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('room', 'title')

    const totalEarned = paidBookings.reduce((sum, b) => sum + b.total, 0)

    res.json({
      totalEarned,
      payments: paidBookings.map(b => ({
        _id:       b._id,
        user:      b.user,
        room:      b.room,
        amount:    b.total,
        date:      b.createdAt
      }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
