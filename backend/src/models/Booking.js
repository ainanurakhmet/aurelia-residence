import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  room:       { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn:    { type: Date, required: true },
  checkOut:   { type: Date, required: true },
  total:      { type: Number, required: true },
  paid:       { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
