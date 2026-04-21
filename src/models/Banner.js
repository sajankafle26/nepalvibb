import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  subtitle: {
    type: String,
  },
  highlightText: {
    type: String, // The "Kulturelle" part in the middle
  },
  badgeText: {
    type: String,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  buttonText: {
    type: String,
    default: 'TA EN TUR',
  },
  buttonLink: {
    type: String,
    default: '/trips',
  },
  videoLink: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
