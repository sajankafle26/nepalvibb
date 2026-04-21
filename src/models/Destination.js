import mongoose from 'mongoose';

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  popularTours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour'
  }]
});

const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);

export default Destination;
