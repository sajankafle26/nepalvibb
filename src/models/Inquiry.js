import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: String,
  selections: {
    type: Map,
    of: [String]
  },
  // Legacy fields for backward compatibility
  destinations: [String],
  activities: [String],
  duration: String,
  travelers: String,
  
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
}, { strict: false }); // Allow extra fields if needed

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
