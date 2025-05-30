import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'

export async function getProfile(req, res) {
  res.json({user:req.user})
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({message:'All fields required'})
  }
  if (newPassword.length<8) {
    return res.status(400).json({message:'Password must be at least 8 characters'})
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({message:'Password must contain a number'})
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({message:'Password must contain an uppercase letter'})
  }
  const user = await User.findById(req.user.id)
  const ok = await bcrypt.compare(currentPassword, user.password)
  if (!ok) {
    return res.status(400).json({message:'Current password is incorrect'})
  }
  user.password = await bcrypt.hash(newPassword,10)
  await user.save()
  res.json({message:'Password changed'})
}


export async function listMyBookings(req, res) {
  const userId = req.user.id
  const bookings = await Booking.find({ user: userId })
    .populate('room', 'title price')
    .sort('-checkIn')
  res.json({ bookings })
}

export async function listMyPayments(req, res) {
  const userId = req.user.id
  const payments = await Payment.find({ user: userId })
    .sort('-date')
  res.json({ payments })
}
