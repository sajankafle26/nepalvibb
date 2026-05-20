/**
 * insert-itineraries.mjs
 * 
 * Reads scraped-itineraries.json and updates each matching tour in MongoDB
 * with the correct itinerary data fetched from https://nepalvibb.com/destination/nepal/
 * 
 * Usage: node scripts/insert-itineraries.mjs
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local manually
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      process.env[key] = value;
    }
  } catch (e) {
    console.error('Could not read .env.local:', e.message);
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Read scraped itineraries
const itinerariesPath = join(__dirname, '..', 'scraped-itineraries.json');
let itineraries;
try {
  itineraries = JSON.parse(readFileSync(itinerariesPath, 'utf-8'));
} catch (e) {
  console.error('❌  Could not read scraped-itineraries.json:', e.message);
  process.exit(1);
}

const slugList = Object.keys(itineraries);
console.log(`\n📋  Found itineraries for ${slugList.length} tours:\n`);
slugList.forEach(s => console.log(`   • ${s} (${itineraries[s].length} days)`));

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('\n✅  Connected to MongoDB');

    const db = client.db(); // Uses DB name from URI
    const toursCollection = db.collection('tours');

    // Fetch all tours from DB
    const allTours = await toursCollection.find({}, { projection: { slug: 1, title: 1, itinerary: 1 } }).toArray();
    console.log(`\n📦  Found ${allTours.length} tours in database:\n`);
    allTours.forEach(t => console.log(`   • ${t.slug} — "${t.title}" [itinerary: ${t.itinerary?.length || 0} days]`));

    console.log('\n🔄  Updating itineraries...\n');

    let updated = 0;
    let skipped = 0;
    let notFound = 0;

    for (const [slug, itinerary] of Object.entries(itineraries)) {
      const tour = allTours.find(t => t.slug === slug);
      if (!tour) {
        console.log(`   ⚠️   No tour found in DB for slug: "${slug}" — skipping`);
        notFound++;
        continue;
      }

      const result = await toursCollection.updateOne(
        { slug },
        { $set: { itinerary } }
      );

      if (result.modifiedCount > 0) {
        console.log(`   ✅  Updated "${tour.title}" — ${itinerary.length} days inserted`);
        updated++;
      } else {
        console.log(`   ℹ️   No change needed for "${tour.title}" (already up to date)`);
        skipped++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n🎉  Done!\n`);
    console.log(`   ✅  Updated: ${updated} tours`);
    console.log(`   ℹ️   Skipped (no change): ${skipped} tours`);
    console.log(`   ⚠️   Not found in DB: ${notFound} slugs`);
    console.log('');

  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌  MongoDB connection closed.\n');
  }
}

run();
