import mongoose from 'mongoose';

// Env vars loaded via node --env-file=.env.local
const MONGODB_URI = process.env.MONGODB_URI;

const TourSchema = new mongoose.Schema({
  title: String,
  slug: String,
  itinerary: [{ day: Number, title: String, details: String }]
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const tours = await Tour.find({}, 'title slug itinerary');
    console.log(JSON.stringify(tours, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

check();
