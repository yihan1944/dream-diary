import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  bucket: { type: String, unique: true },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

export default mongoose.model('RateLimit', rateLimitSchema);
