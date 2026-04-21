import mongoose from 'mongoose';

const PlanTripQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ['select', 'multi-select', 'text', 'date'],
    default: 'select',
  },
  options: [{
    label: String,
    value: String,
    icon: String, // Name of the lucide icon
    description: String, // Added for more detail
  }],
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.PlanTripQuestion || mongoose.model('PlanTripQuestion', PlanTripQuestionSchema);
