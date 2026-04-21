import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'specialist', 'system'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TripRequestSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  destination: { type: String, default: 'Nepal' },
  status: { type: String, enum: ['active', 'closed', 'booked'], default: 'active' },
  
  // Onboarding Data
  group: String,
  dateType: String,
  month: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  interests: [String],
  budget: String,
  accommodation: String,
  
  // Contact Info
  name: String,
  email: { type: String, required: true },
  phone: String,
  notes: String,

  messages: [MessageSchema],
  
  // Pricing and Payment
  price: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  itineraryPdf: String, // URL to itinerary
}, { timestamps: true });

// Avoid OverwriteModelError in development
const TripRequest = mongoose.models.TripRequest || mongoose.model('TripRequest', TripRequestSchema);

export default TripRequest;
