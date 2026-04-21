import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/nepalvibb";

const TripFormSchema = new mongoose.Schema({
  step: Number,
  title: String,
  subtitle: String,
  type: String,
  multiSelect: Boolean,
  options: [{ label: String, value: String, icon: String }],
  isActive: Boolean
});

const TripForm = mongoose.models.TripForm || mongoose.model('TripForm', TripFormSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await TripForm.deleteMany({});

    const steps = [
      {
        step: 1,
        title: 'Hvor vil du reise?',
        subtitle: 'Velg dine drømmedestinasjoner',
        type: 'selection',
        multiSelect: true,
        options: [
          { label: 'Nepal', value: 'Nepal', icon: 'MapPin' },
          { label: 'Bhutan', value: 'Bhutan', icon: 'MapPin' },
          { label: 'India', value: 'India', icon: 'MapPin' },
          { label: 'Tibet', value: 'Tibet', icon: 'MapPin' }
        ],
        isActive: true
      },
      {
        step: 2,
        title: 'Hva vil du oppleve?',
        subtitle: 'Velg dine interesser',
        type: 'selection',
        multiSelect: true,
        options: [
          { label: 'Trekking', value: 'Trekking', icon: 'Mountain' },
          { label: 'Kultur', value: 'Kultur', icon: 'Landmark' },
          { label: 'Eventyr', value: 'Eventyr', icon: 'Sparkles' },
          { label: 'Velvære', value: 'Velvære', icon: 'Heart' }
        ],
        isActive: true
      },
      {
        step: 3,
        title: 'Dine Kontaktopplysninger',
        subtitle: 'Slik at vi kan sende deg forslaget',
        type: 'contact',
        multiSelect: false,
        options: [],
        isActive: true
      }
    ];

    await TripForm.insertMany(steps);
    console.log('Dynamic Form Seeded!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
