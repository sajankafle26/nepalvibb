import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';

// Manual env load
const envContent = readFileSync('.env.local', 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) continue;
  process.env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
}

const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const toursCollection = db.collection('tours');
    const tours = await toursCollection.find({}).project({ slug: 1, title: 1, overview: 1, summary: 1 }).toArray();
    console.log(JSON.stringify(tours, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
