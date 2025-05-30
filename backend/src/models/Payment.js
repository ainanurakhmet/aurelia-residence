import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking:   { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount:    { type: Number, required: true },
  method:    { type: String, enum: ['card','cash'], required: true },
  transactionId: String,
  date:      { type: Date, default: Date.now },
})

export default mongoose.model('Payment', paymentSchema)
