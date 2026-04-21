import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

// Env vars loaded via node --env-file=.env.local
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Inline Models for script
const TourSchema = new mongoose.Schema({
  title: String,
  slug: String,
  image: String,
  price: Number,
  difficulty: String,
  summary: String,
  duration: String,
  isFeatured: Boolean,
  itinerary: [{ day: Number, title: String, details: String }]
});

const DestinationSchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
  description: String
});

const SiteSettingsSchema = new mongoose.Schema({
  siteName: String,
  contactEmail: String,
  adminEmail: String,
  adminPassword: { type: String, default: 'admin@345' }
});

const BannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  highlightText: String,
  badgeText: String,
  image: String,
  buttonText: String,
  buttonLink: String,
  videoLink: String,
  order: Number,
  isActive: Boolean
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);
const Destination = mongoose.models.Destination || mongoose.model('Destination', DestinationSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
const Banner = mongoose.models.Banner || mongoose.model('Banner', BannerSchema);

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Activity = mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  image: String,
  content: String,
  author: String,
  category: String,
  isFeatured: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

const DUMMY_BANNERS = [
  {
    title: "Unik",
    highlightText: "Kulturelle",
    subtitle: "Opplevelse",
    badgeText: "Oppdag de mest engasjerte stedene",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80",
    buttonText: "TA EN TUR",
    buttonLink: "/tours",
    videoLink: "https://youtube.com",
    order: 1,
    isActive: true
  },
  {
    title: "Mektige",
    highlightText: "Fjellkjeder",
    subtitle: "Venter På Deg",
    badgeText: "Vandring i hjertet av Himalaya",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
    buttonText: "SE TREKKING",
    buttonLink: "/category/trekking",
    order: 2,
    isActive: true
  },
  {
    title: "Autentiske",
    highlightText: "Landsbyliv",
    subtitle: "Nær Naturen",
    badgeText: "Bo hos lokale familier",
    image: "https://images.unsplash.com/photo-1526715469145-8a881096a66d?auto=format&fit=crop&w=1920&q=80",
    buttonText: "UTFORSK MER",
    buttonLink: "/category/cultural-tour",
    order: 3,
    isActive: true
  }
];

const DUMMY_TOURS = [
  // NEPAL
  {
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp-trek',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    price: 18500,
    difficulty: 'Vanskelig',
    summary: 'Standing at the foot of the world\'s highest peak is an experience beyond words. This trek takes you through Sherpa heartlands and dramatic alpine scenery.',
    duration: '14 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Flight to Lukla', details: 'Thrilling flight followed by a trek to Phakding.' }]
  },
  {
    title: 'Annapurna Sanctuary Expedition',
    slug: 'annapurna-sanctuary',
    image: 'https://images.unsplash.com/photo-1526715469145-8a881096a66d?auto=format&fit=crop&w=800&q=80',
    price: 12500,
    difficulty: 'Moderat',
    summary: 'A natural amphitheater of snow-capped peaks. Walk through rhododendron forests to the base of Annapurna South.',
    duration: '10 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Pokhara to Nayapul', details: 'Scenic drive and start of the trek.' }]
  },
  {
    title: 'Island Peak Climbing Adventure',
    slug: 'island-peak-climbing',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    price: 35000,
    difficulty: 'Vanskelig',
    summary: 'The ultimate technical challenge for aspiring mountaineers. Reach the summit of 6,189m with expert Sherpa guides.',
    duration: '18 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Technical Training', details: 'Practice using ice axes and crampons in Chhukung.' }]
  },
  {
    title: 'Ghorepani Poon Hill Sunrise Trek',
    slug: 'poon-hill-trek',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    price: 6500,
    difficulty: 'Lett',
    summary: 'The most popular short trek in Nepal. Witness the sunrise over the Dhaulagiri and Annapurna ranges.',
    duration: '5 Days',
    isFeatured: false,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Ulleri Climb', details: 'Ascend the famous 3,300 stone steps.' }]
  },
  {
    title: 'Kathmandu Valley One-Day Tour',
    slug: 'kathmandu-day-tour',
    image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&w=800&q=80',
    price: 1200,
    difficulty: 'Lett',
    summary: 'Explore 4 UNESCO World Heritage sites in a single day, including the Swayambhunath Monkey Temple.',
    duration: '1 Day',
    isFeatured: false,
    category: 'Tour',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Patan Durbar Square', details: 'Admire the exquisite Newari architecture.' }]
  },
  {
    title: 'Manaslu Circuit Trek',
    slug: 'manaslu-circuit',
    image: 'https://images.unsplash.com/photo-1623492701902-47dc207df5dc?auto=format&fit=crop&w=800&q=80',
    price: 21000,
    difficulty: 'Vanskelig',
    summary: 'The untamed alternative to Annapurna. Cross the Larkya La Pass and circle the world\'s 8th highest mountain.',
    duration: '16 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Larkya La', details: 'The most challenging part of the trek at 5,106m.' }]
  },
  {
    title: 'Langtang Valley & Gosaikunda Lakes',
    slug: 'langtang-gosaikunda',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    price: 14500,
    difficulty: 'Moderat',
    summary: 'Combine a valley trek with a visit to the sacred high-altitude Gosaikunda lakes.',
    duration: '12 Days',
    isFeatured: false,
    category: 'Trekking',
    destination: 'Nepal',
    itinerary: [{ day: 1, title: 'Sing Gompa', details: 'Famous for its local cheese factory and ancient monastery.' }]
  },

  // BHUTAN
  {
    title: 'Dragon Kingdom Cultural Tour',
    slug: 'bhutan-dragon-tour',
    image: 'https://images.unsplash.com/photo-1578516123434-5fe5009f984b?auto=format&fit=crop&w=800&q=80',
    price: 24000,
    difficulty: 'Lett',
    summary: 'Explore Thimphu, Paro, and Punakha. Experience the unique Gross National Happiness of Bhutan.',
    duration: '7 Days',
    isFeatured: true,
    category: 'Tour',
    destination: 'Bhutan',
    itinerary: [{ day: 1, title: 'Arrive in Paro', details: 'Stunning flight into the Paro valley.' }]
  },
  {
    title: 'Jomolhari Base Camp Trek',
    slug: 'jomolhari-trek',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
    price: 38000,
    difficulty: 'Vanskelig',
    summary: 'One of the most scenic treks in Bhutan, reaching the base of the sacred Jomolhari peak.',
    duration: '10 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'Bhutan',
    itinerary: [{ day: 1, title: 'Jangothang', details: 'Acclimatization day with views of Jomolhari.' }]
  },
  {
    title: 'Bumthang Valley Cultural Odyssey',
    slug: 'bumthang-tour',
    image: 'https://images.unsplash.com/photo-1578516123434-5fe5009f984b?auto=format&fit=crop&w=800&q=80',
    price: 19500,
    difficulty: 'Lett',
    summary: 'The spiritual heart of Bhutan. Explore ancient temples and the unique culture of Central Bhutan.',
    duration: '8 Days',
    isFeatured: false,
    category: 'Tour',
    destination: 'Bhutan',
    itinerary: [{ day: 1, title: 'Jakar Dzong', details: 'The fortress of the white bird.' }]
  },

  // TIBET
  {
    title: 'Lhasa & Potala Palace Journey',
    slug: 'tibet-lhasa-journey',
    image: 'https://images.unsplash.com/photo-1544315264-966904943f9a?auto=format&fit=crop&w=800&q=80',
    price: 32000,
    difficulty: 'Lett',
    summary: 'Visit the spiritual heart of Tibet. Explore the Barkhor market and the majestic Potala Palace.',
    duration: '5 Days',
    isFeatured: true,
    category: 'Tour',
    destination: 'Tibet',
    itinerary: [{ day: 1, title: 'Welcome to Lhasa', details: 'Acclimatization and rest at high altitude.' }]
  },
  {
    title: 'Everest North Face Expedition (Tibet)',
    slug: 'everest-north-tibet',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
    price: 42000,
    difficulty: 'Moderat',
    summary: 'Drive to the North Base Camp of Everest. Witness the sheer Rongbuk glacier and the north face of the world\'s highest peak.',
    duration: '8 Days',
    isFeatured: true,
    category: 'Tour',
    destination: 'Tibet',
    itinerary: [{ day: 1, title: 'Rongbuk Monastery', details: 'The highest monastery in the world.' }]
  },
  {
    title: 'Ganden to Samye Trek',
    slug: 'ganden-samye-trek',
    image: 'https://images.unsplash.com/photo-1544315264-966904943f9a?auto=format&fit=crop&w=800&q=80',
    price: 28000,
    difficulty: 'Vanskelig',
    summary: 'The best trek in Tibet. Connecting the first monastery in Tibet with the great Ganden monastery.',
    duration: '12 Days',
    isFeatured: false,
    category: 'Trekking',
    destination: 'Tibet',
    itinerary: [{ day: 1, title: 'Shuga La Pass', details: 'Crossing the high pass at 5,250m.' }]
  },

  // INDIA
  {
    title: 'Leh-Ladakh: The Land of High Passes',
    slug: 'ladakh-expedition',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    price: 18000,
    difficulty: 'Moderat',
    summary: 'Explore the moonscapes of Ladakh. Visit ancient monasteries and drive through the world\'s highest motorable roads.',
    duration: '10 Days',
    isFeatured: true,
    category: 'Tour',
    destination: 'India',
    itinerary: [{ day: 1, title: 'Arrive in Leh', details: 'Complete rest for acclimatization.' }]
  },
  {
    title: 'Markha Valley Trek (Ladakh)',
    slug: 'markha-valley-trek',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    price: 13500,
    difficulty: 'Vanskelig',
    summary: 'The classic Ladakh trek. Walk through remote villages, cross high passes, and stay in authentic tea houses.',
    duration: '9 Days',
    isFeatured: false,
    category: 'Trekking',
    destination: 'India',
    itinerary: [{ day: 1, title: 'Skiu Village', details: 'Meeting the local Ladakhi community.' }]
  },
  {
    title: 'Sikkim: Goechala Trek',
    slug: 'goechala-trek',
    image: 'https://images.unsplash.com/photo-1524492717547-2249978a6200?auto=format&fit=crop&w=800&q=80',
    price: 16500,
    difficulty: 'Vanskelig',
    summary: 'Get up close and personal with the world\'s third highest peak, Mount Kanchenjunga.',
    duration: '11 Days',
    isFeatured: true,
    category: 'Trekking',
    destination: 'India',
    itinerary: [{ day: 1, title: 'Tshoka', details: 'Walking through beautiful oak and rhododendron forests.' }]
  },
  {
    title: 'Dharamshala: Little Lhasa Tour',
    slug: 'dharamshala-tour',
    image: 'https://images.unsplash.com/photo-1524492717547-2249978a6200?auto=format&fit=crop&w=800&q=80',
    price: 9500,
    difficulty: 'Lett',
    summary: 'Visit the residence of the Dalai Lama. Explore the Tibetan community in exile and the beautiful Dhaulagiri range.',
    duration: '5 Days',
    isFeatured: false,
    category: 'Tour',
    destination: 'India',
    itinerary: [{ day: 1, title: 'McLeod Ganj', details: 'Explore the vibrant Tibetan market.' }]
  }
];

const DUMMY_ACTIVITIES = [
  {
    name: 'Trekking',
    slug: 'trekking',
    description: 'Explore the world\'s most spectacular trails through the heart of the Himalayas.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    name: 'Peak Climbing',
    slug: 'peak-climbing',
    description: ' टेक्निकल technical peak climbing adventures for those seeking the ultimate summit challenge.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    name: 'Cultural Tours',
    slug: 'cultural-tours',
    description: 'Immerse yourself in the rich traditions, ancient temples, and spiritual heart of the Himalayas.',
    image: 'https://images.unsplash.com/photo-1524230652367-95f2ff47e70d?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    name: 'Jungle Safari',
    slug: 'jungle-safari',
    description: 'Discover the exotic wildlife of the lowlands, from one-horned rhinos to the elusive Royal Bengal Tiger.',
    image: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false
  }
];

const DUMMY_DESTINATIONS = [
  {
    name: 'Nepal',
    slug: 'nepal',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Home to 8 of the world\'s 10 highest peaks and deep spiritual traditions.'
  },
  {
    name: 'India',
    slug: 'india',
    image: 'https://images.unsplash.com/photo-1524492717547-2249978a6200?auto=format&fit=crop&w=800&q=80',
    description: 'A kaleidoscope of landscapes, from the Indian Himalayas to the sacred Ganges.'
  },
  {
    name: 'Bhutan',
    slug: 'bhutan',
    image: 'https://images.unsplash.com/photo-1578516123434-5fe5009f984b?auto=format&fit=crop&w=800&q=80',
    description: 'The Dragon Kingdom where Gross National Happiness is more important than GDP.'
  },
  {
    name: 'Tibet',
    slug: 'tibet',
    image: 'https://images.unsplash.com/photo-1544315264-966904943f9a?auto=format&fit=crop&w=800&q=80',
    description: 'The Roof of the World, a spiritual plateau of endless horizons and ancient palaces.'
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Cleaning existing data...');
    await Tour.deleteMany({});
    await Destination.deleteMany({});
    await SiteSettings.deleteMany({});
    await Banner.deleteMany({});

    console.log('Seeding tours...');
    await Tour.insertMany(DUMMY_TOURS);

    console.log('Seeding destinations...');
    await Destination.insertMany(DUMMY_DESTINATIONS);

    console.log('Seeding banners...');
    await Banner.insertMany(DUMMY_BANNERS);

    console.log('Seeding activities...');
    await Activity.insertMany(DUMMY_ACTIVITIES);

    console.log('Seeding site settings...');
    await SiteSettings.create({
      siteName: 'Nepalvibb',
      contactEmail: 'sajankafle9841@gmail.com',
      adminEmail: 'sajankafle9841@gmail.com',
      adminPassword: 'admin@345'
    });

    console.log('Database seeded successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
}

seed();
