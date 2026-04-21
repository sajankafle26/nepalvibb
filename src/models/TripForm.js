import mongoose from 'mongoose';

const TripFormSchema = new mongoose.Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  type: { 
    type: String, 
    enum: ['selection', 'text', 'contact'], 
    default: 'selection' 
  },
  multiSelect: { type: Boolean, default: false },
  options: [
    {
      label: { type: String, required: true },
      icon: { type: String }, // Lucide icon name
      value: { type: String, required: true }
    }
  ],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.TripForm || mongoose.model('TripForm', TripFormSchema);
