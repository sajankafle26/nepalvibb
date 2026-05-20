import { MongoClient } from 'mongodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';

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
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI missing');
  process.exit(1);
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return await res.text();
}

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db();
    const toursCollection = db.collection('tours');

    const tours = await toursCollection.find({}).project({ slug: 1, title: 1 }).toArray();
    console.log(`Found ${tours.length} tours in database to process.`);

    for (const tour of tours) {
      const { slug, title } = tour;
      const url = `https://nepalvibb.com/tour/${slug}/`;
      console.log(`\nProcessing: ${title} (${slug})`);
      console.log(`🔗 Fetching: ${url}`);

      try {
        const html = await fetchHtml(url);
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // Try multiple selectors in order of preference
        const selectors = [
          '.yatra-tab-item.overview .yatra-tab-section-inner',
          '.overview-section .yatra-tab-section-inner',
          '.overview-section',
          '.yatra-tour-overview',
          '#overview',
          '.yatra-tour-content'
        ];

        let overviewHtml = '';
        for (const selector of selectors) {
          const el = doc.querySelector(selector);
          if (el) {
            overviewHtml = el.innerHTML.trim();
            if (overviewHtml) {
              console.log(`   ✓ Found overview content using selector: "${selector}"`);
              break;
            }
          }
        }

        if (overviewHtml) {
          const updated = await toursCollection.updateOne(
            { _id: tour._id },
            { $set: { overview: overviewHtml, updatedAt: new Date() } }
          );
          if (updated.modifiedCount > 0) {
            console.log(`   ✨ Updated in database!`);
          } else {
            console.log(`   ℹ️ Database already has this exact content (no changes made).`);
          }
        } else {
          console.warn(`   ⚠️ Warning: Could not find overview content for "${slug}". Leaving database entry intact.`);
        }
      } catch (err) {
        console.error(`   ❌ Error fetching/parsing ${slug}:`, err.message);
      }

      // Respectful delay between requests
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    console.log('\n🎉 Finished updating all tour overviews!');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

run();
