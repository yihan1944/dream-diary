import mongoose from 'mongoose';

const symbolSchema = new mongoose.Schema({
  name: String,
  meaning: String,
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  emotion: String,
  emotionScore: Number,
  themes: [String],
  symbols: [symbolSchema],
  summary: String,
  keywords: [String],
}, { _id: false });

const dreamSchema = new mongoose.Schema({
  title: { type: String, default: '梦境' },
  content: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  tags: [String],
  analysis: { type: analysisSchema, default: null },
  clientIp: { type: String },
  createdAt: { type: Date, default: Date.now },
});

dreamSchema.index({ date: -1 });

dreamSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.clientIp;
    return ret;
  },
});

export default mongoose.model('Dream', dreamSchema);
