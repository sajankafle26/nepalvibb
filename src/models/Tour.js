import mongoose from 'mongoose';

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, default: 'Moderat' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  summary: { type: String, required: true },
  overview: { type: String },
  category: { type: String, default: 'Trekking' },
  highlights: [String],
  itinerary: [
    {
      day: Number,
      title: String,
      details: String,
    }
  ],
  // New Dynamic Trip Details section
  tripDetails: [
    {
      label: String,
      value: String,
      icon: String, // e.g. 'Clock', 'Mountain', 'Users'
    }
  ],
  priceIncludes: [String],
  priceExcludes: [String],
  gallery: [String],
  usefulInfo: {
    bestTime: String,
    accommodation: String,
    meals: String,
    visaInfo: String,
    packingList: String
  },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
