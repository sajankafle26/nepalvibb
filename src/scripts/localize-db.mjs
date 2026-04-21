import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/nepalvibb";

const TourSchema = new mongoose.Schema({ title: String, summary: String, difficulty: String });
const DestinationSchema = new mongoose.Schema({ description: String });
const ActivitySchema = new mongoose.Schema({ name: String, description: String });
const BannerSchema = new mongoose.Schema({ title: String, subtitle: String, highlightText: String, badgeText: String, buttonText: String });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);
const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

async function localize() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update Tours
    await Tour.updateMany({ title: 'Everest Base Camp Trek' }, { 
      summary: 'Den ultimate vandringen til foten av verdens høyeste fjell.',
      difficulty: 'Vanskelig'
    });
    await Tour.updateMany({ title: 'Annapurna Circuit' }, { 
      summary: 'En av verdens vakreste vandreruter med fantastisk utsikt over Annapurna-massivet.',
      difficulty: 'Moderat'
    });

    // Update Destinations
    await Destination.updateMany({ name: 'Nepal' }, { description: 'Hjemmet til verdens høyeste fjell, rik kultur og uforglemmelige eventyr.' });
    await Destination.updateMany({ name: 'Bhutan' }, { description: 'Tordendragens land, kjent for sin lykke og uberørte natur.' });
    await Destination.updateMany({ name: 'India' }, { description: 'En fargerik mosaikk av kultur, historie og variert landskap.' });
    await Destination.updateMany({ name: 'Tibet' }, { description: 'Verdens tak, et sted for åndelighet og majestetiske fjell.' });

    // Update Activities
    await Activity.updateMany({ name: 'Trekking' }, { description: 'Vandring gjennom verdens mest spektakulære fjellandskap.' });
    await Activity.updateMany({ name: 'Cultural Tours' }, { name: 'Kulturelle Turer', description: 'Oppdag de eldgamle tradisjonene og historien i Himalaya.' });
    await Activity.updateMany({ name: 'Peak Climbing' }, { name: 'Topptur', description: 'Nå de høyeste toppene med våre erfarne guider.' });
    await Activity.updateMany({ name: 'Jungle Safari' }, { name: 'Jungelsafari', description: 'Møt de ville dyrene i de frodige junglene i Sør-Nepal.' });

    // Update Banners
    await Banner.updateMany({ title: 'Unik' }, { 
      title: 'Unike', 
      highlightText: 'Kulturelle', 
      subtitle: 'Opplevelser', 
      badgeText: 'Oppdag de mest spennende stedene',
      buttonText: 'UTFORSK NÅ'
    });
    await Banner.updateMany({ title: 'Mektige' }, { 
      badgeText: 'Vandring i hjertet av Himalaya',
      buttonText: 'SE TREKKING'
    });

    console.log('Database localized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Localization error:', err);
    process.exit(1);
  }
}

localize();
