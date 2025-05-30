import Booking from '../models/Booking.js'
import Room    from '../models/Room.js'

export async function createBooking(req, res) {
  const { roomId, checkIn, checkOut } = req.body
  if (!roomId || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'Missing fields' })
  }

  const room = await Room.findById(roomId)
  if (!room) return res.status(404).json({ message: 'Room not found' })

  const ci = new Date(checkIn)
  const co = new Date(checkOut)
  const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24))
  if (nights <= 0) return res.status(400).json({ message: 'Invalid dates' })

  const conflict = await Booking.findOne({
    room: roomId,
    checkIn:  { $lt: co },
    checkOut: { $gt: ci }
  })

  if (conflict) {
    return res.status(409).json({ message: 'Dates not available' })
  }

  const total = nights * room.price
  const booking = await Booking.create({
    room:     roomId,
    user:     req.user.id,
    checkIn:  ci,
    checkOut: co,
    total,
    paid:     false
  })

  const io = req.app.get('io')
  io.emit('new-booking', {
    roomId:   booking.room.toString(),
    userId:   booking.user.toString(),
    checkIn:  booking.checkIn,
    checkOut: booking.checkOut,
    total:    booking.total,
  })

  res.status(201).json({ booking })
}

export async function checkAvailability(req, res) {
  const { roomId, checkIn, checkOut } = req.query
  const ci = new Date(checkIn)
  const co = new Date(checkOut)

  const conflict = await Booking.findOne({
    room:    roomId,
    checkIn:  { $lt: co },
    checkOut: { $gt: ci }
  })

  res.json({ available: !conflict })
}

export async function listMyBookings(req, res) {
  const b = await Booking.find({ user: req.user.id })
    .sort('-createdAt')
    .populate('room', 'title price')
  res.json({ bookings: b })
}
