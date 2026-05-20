import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIndex = trimmed.indexOf('=');
  if (eqIndex === -1) continue;
  process.env[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
}

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const blogs = await db.collection('blogs').find({}).toArray();
  console.log(`Found ${blogs.length} blogs in DB.`);
  for (const b of blogs) {
    console.log(`- Title: "${b.title}"`);
    console.log(`  Slug: "${b.slug}"`);
    console.log(`  Author: "${b.author}"`);
    console.log(`  Content Length: ${b.content?.length || 0}`);
  }
  await client.close();
}
run();
