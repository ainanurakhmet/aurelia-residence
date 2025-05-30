import Stripe from 'stripe'
import Booking from '../models/Booking.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata.bookingId
    await Booking.findByIdAndUpdate(bookingId, { paid: true })
  }

  res.json({ received: true })
}
