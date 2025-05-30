import Booking from '../models/Booking.js'
import Payment from '../models/Payment.js'
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
})

export async function createPayment(req, res) {
  const { bookingId, method, token } = req.body
  const userId = req.user.id

  const booking = await Booking.findById(bookingId).populate('room', 'price')
  if (!booking || booking.user.toString() !== userId) {
    return res.status(404).json({ message: 'Booking not found' })
  }
  if (booking.paid) {
    return res.status(400).json({ message: 'Already paid' })
  }

  const nights = Math.ceil((booking.checkOut - booking.checkIn)/(1000*60*60*24))
  const amount = nights * booking.room.price * 100  

  let chargeId = null
  if (method === 'card') {
    if (!token) return res.status(400).json({ message: 'Missing payment token' })
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: token,
      confirm: true,
    })
    chargeId = intent.id
  }

  const payment = await Payment.create({
    user: userId,
    booking: bookingId,
    amount: amount / 100,
    method,
    transactionId: chargeId,
  })

  booking.paid = true
  await booking.save()

  return res.status(201).json({ payment })
}




export async function createCheckoutSession(req, res) {
  const { bookingId } = req.body

  const booking = await Booking.findById(bookingId).populate('room')
  if (!booking) return res.status(404).json({ error: 'Booking not found' })
  if (booking.user.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: booking.room.title },
          unit_amount: Math.round(booking.total * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/profile?paid=1`,
    cancel_url: `${process.env.FRONTEND_URL}/profile?paid=0`,
    metadata: { bookingId },
  })

  return res.json({ sessionUrl: session.url })
}

