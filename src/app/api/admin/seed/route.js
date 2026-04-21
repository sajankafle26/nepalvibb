import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import SiteSettings from '@/models/SiteSettings';

const DUMMY_TOURS = [
  {
    title: 'Unik Homestay-Kulturelle Opplevelse',
    slug: 'unik-homestay-kulturelle-opplevelse',
    image: 'https://images.unsplash.com/photo-1526715469145-8a881096a66d?auto=format&fit=crop&w=800&q=80',
    price: 1800,
    difficulty: 'Lett',
    summary: 'Å bo på homestay gir deg en helt spesiell opplevelse av Nepal. Du bor hos en lokal familie, spiser tradisjonell mat og lærer om hverdagslivet deres.',
    duration: '7 Days',
    isFeatured: true,
    itinerary: [
      { day: 1, title: 'Arrival in Kathmandu', details: 'Welcome to Nepal! We will pick you up from the airport.' },
      { day: 2, title: 'Village Life', details: 'Travel to the homestay village and meet your host family.' },
      { day: 3, title: 'Local Farming', details: 'Learn traditional Nepali farming techniques.' },
    ]
  },
  {
    title: 'Oppdag Magien ved Annapurna Circuit Trek',
    slug: 'oppdag-magien-ved-annapurna-circuit-trek',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    price: 1540,
    difficulty: 'Vanskelig',
    summary: 'Med to uker på Annapurna Circuit kan du fullføre hele ruten og få med deg uforglemmelige avstikkere underveis.',
    duration: '14 Days',
    isFeatured: true,
    itinerary: [
      { day: 1, title: 'Drive to Besisahar', details: 'Start your journey into the mountains.' },
      { day: 5, title: 'Manang Village', details: 'Acclimatization and local exploration.' },
      { day: 10, title: 'Thorong La Pass', details: 'The highest point of the trek at 5416m.' },
    ]
  },
  {
    title: 'Oppdag Skjønnheten i Himalaya: Langtang Valley Trek',
    slug: 'oppdag-skjonnheten-i-himalaya-langtang-valley-trek',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    price: 1800,
    difficulty: 'Moderat',
    summary: 'Langtang Valley Trek er en fantastisk fjelltur i Nepal som passer perfekt for deg som elsker natur og stillhet.',
    duration: '10 Days',
    isFeatured: true,
    itinerary: [
      { day: 1, title: 'Drive to Syabrubesi', details: 'Scenic drive to the trailhead.' },
      { day: 4, title: 'Kyanjin Gompa', details: 'Beautiful monastery surrounded by peaks.' },
      { day: 7, title: 'Tserko Ri Climb', details: 'Incredible 360-degree mountain views.' },
    ]
  }
];

const DUMMY_DESTINATIONS = [
  {
    name: 'Kathmandu Valley',
    slug: 'kathmandu-valley',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'The cultural heart of Nepal with ancient temples and bustling markets.'
  },
  {
    name: 'Everest Region',
    slug: 'everest-region',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    description: 'Home to the highest peaks on Earth and the legendary Sherpa culture.'
  },
  {
    name: 'Pokhara & Annapurna',
    slug: 'pokhara-annapurna',
    image: 'https://images.unsplash.com/photo-1526715469145-8a881096a66d?auto=format&fit=crop&w=800&q=80',
    description: 'A lakefront paradise serving as the gateway to the Annapurna range.'
  }
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await Tour.deleteMany({});
    await Destination.deleteMany({});
    await SiteSettings.deleteMany({});

    // Insert new data
    await Tour.insertMany(DUMMY_TOURS);
    await Destination.insertMany(DUMMY_DESTINATIONS);
    await SiteSettings.create({
      siteName: 'Nepalvibb',
      contactEmail: 'sajankafle9841@gmail.com',
      adminEmail: 'sajankafle9841@gmail.com',
      adminPassword: 'admin@345'
    });

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
