/**
 * insert-turer-activity.mjs
 *
 * Adds the "Turer" activity to MongoDB.
 *
 * Usage: node scripts/insert-turer-activity.mjs
 */

import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      process.env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
    }
  } catch (e) {
    console.error('Could not read .env.local:', e.message);
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('❌  MONGODB_URI missing'); process.exit(1); }

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('\n✅  Connected to MongoDB\n');

    const db = client.db();
    const activitiesCollection = db.collection('activities');

    const turerActivity = {
      name: 'Turer',
      slug: 'turer',
      description: 'Nepal er mer enn bare fjell. I jungelen i Chitwan og Bardia kan du dra på safari og se neshorn, krokodiller og kanskje den sjeldne bengaltigeren. I byene Kathmandu og Pokhara møter du fargerike markeder, eldgamle templer og en rik kulturarv. Enten du søker spenning i høyden, villmarkseventyr eller kulturelle opplevelser, byr Nepal på turer som gir minner for livet.',
      image: 'https://nepalvibb.com/wp-content/themes/nepaltravel/assets/img/breadcrumb/breadcrumb.jpg',
      isFeatured: true
    };

    const existing = await activitiesCollection.findOne({ slug: turerActivity.slug });

    if (existing) {
      await activitiesCollection.updateOne(
        { slug: turerActivity.slug },
        { $set: turerActivity }
      );
      console.log(`   🔄  Updated  "Turer" activity`);
    } else {
      await activitiesCollection.insertOne({
        ...turerActivity,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`   ✨  Created  "Turer" activity`);
    }

    console.log('\n🎉  All done!\n');

  } catch (err) {
    console.error('\n❌  Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌  MongoDB connection closed.\n');
  }
}

run();
