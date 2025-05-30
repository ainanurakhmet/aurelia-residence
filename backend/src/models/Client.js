import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:     { type: String, default: '' },
  role:      { type: String, enum: ['guest'], default: 'guest' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Client', clientSchema);
