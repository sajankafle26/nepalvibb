import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://localhost:27017/nepalvibb"; // Adjust if needed

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

const DUMMY_BLOGS = [
  {
    title: 'Hvorfor Everest Base Camp-turen i Nepal ikke er et billig eventyr',
    slug: 'everest-base-camp-trip-cost',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    content: '<p>Everest Base Camp er mer enn bare en tur; det er en investering i minner for livet. Fra logistikk til sikkerhet, her er hvorfor kvalitet koster...</p>',
    author: 'Nepalvibb Editor',
    category: 'Travel Tips',
    isFeatured: true
  },
  {
    title: 'Topp 5 Eventyrturer i Nepal for Nordmenn',
    slug: 'top-5-adventure-tours-nepal',
    image: 'https://images.unsplash.com/photo-1533041045271-20921e25e9be?auto=format&fit=crop&w=800&q=80',
    content: '<p>Nepal tilbyr unike opplevelser som passer perfekt for den eventyrlystne nordmannen. Her er våre toppvalg for årets sesong...</p>',
    author: 'Nepalvibb Editor',
    category: 'Adventure',
    isFeatured: true
  },
  {
    title: 'Kultur og Tradisjon: Et dypdykk i Katmandudalen',
    slug: 'culture-tradition-kathmandu-valley',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    content: '<p>Oppdag de syv UNESCO-verdensarvstedene i Katmandudalen og lær om den rike historien som preger denne magiske regionen...</p>',
    author: 'Nepalvibb Editor',
    category: 'Culture',
    isFeatured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Blog.deleteMany({});
    await Blog.insertMany(DUMMY_BLOGS);

    console.log('Blogs seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
