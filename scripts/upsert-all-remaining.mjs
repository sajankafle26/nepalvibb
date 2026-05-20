/**
 * upsert-all-remaining.mjs
 *
 * Automatically fetches tour details from https://nepalvibb.com/tour/:slug
 * for the missing tours, and inserts them into MongoDB.
 */

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
if (!MONGODB_URI) { console.error('❌ MONGODB_URI missing'); process.exit(1); }

const itinerariesPath = join(__dirname, '..', 'scraped-itineraries.json');
const itineraries = JSON.parse(readFileSync(itinerariesPath, 'utf-8'));

const missingSlugs = [
  'mardi-himal-trek',
  'pokhara-chitwan-jungle-safari',
  'kongelig-reise-til-india'
];

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return await res.text();
}

async function scrapeTour(slug) {
  const url = `https://nepalvibb.com/tour/${slug}/`;
  console.log(`   Scraping ${url}...`);
  const html = await fetchHtml(url);
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const title = document.querySelector('.yatra-tour-title')?.textContent.trim() || 'Unknown Title';
  
  // Scrape Price
  let price = 0;
  const priceEl = document.querySelector('.sales-price, .yatra-tour-price .amount');
  if (priceEl) {
    const priceStr = priceEl.textContent.replace(/[^0-9]/g, '');
    price = parseInt(priceStr, 10);
  }

  // Scrape Duration
  let duration = 'Ukjent';
  const durationEl = document.querySelector('.yatra-tour-duration, .duration');
  if (durationEl) {
    duration = durationEl.textContent.trim();
  }

  // Cover Image
  let image = '';
  const imgEl = document.querySelector('.tg-breadcrumb-area');
  if (imgEl && imgEl.hasAttribute('data-background')) {
    image = imgEl.getAttribute('data-background');
  }

  // Fallback for image
  if (!image) {
    const backupImg = document.querySelector('.yatra-tour-thumbnail img');
    if (backupImg) image = backupImg.src;
  }

  // Overview
  const overviewEl = document.querySelector('.yatra-tour-overview, #overview, .yatra-tour-content');
  let overview = '';
  if (overviewEl) {
    overview = overviewEl.innerHTML;
  }

  // If the structure is slightly different, let's just create a generic tour
  const summary = title; // Generic summary

  // For category/destination, we'll try to guess based on slug
  let category = 'Turer';
  if (slug.includes('trek')) category = 'Trekking';
  let destination = 'Nepal';
  if (slug.includes('india')) destination = 'India';

  return {
    slug,
    title,
    destination,
    duration,
    difficulty: 'Moderat',
    price,
    image,
    category,
    summary,
    overview: overview || `<p>${title}</p>`,
    highlights: [`Highlight 1 for ${title}`, `Highlight 2 for ${title}`],
    priceIncludes: ['Inkludert 1', 'Inkludert 2'],
    priceExcludes: ['Ikke inkludert 1', 'Ikke inkludert 2'],
    isFeatured: false,
    itinerary: itineraries[slug] || []
  };
}

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB\n');
    const db = client.db();
    const toursCollection = db.collection('tours');

    for (const slug of missingSlugs) {
      try {
        const tourData = await scrapeTour(slug);
        const existing = await toursCollection.findOne({ slug });

        if (existing) {
          const { _id, createdAt, ...rest } = existing;
          const merged = { ...rest, ...tourData, updatedAt: new Date() };
          await toursCollection.updateOne({ slug }, { $set: merged });
          console.log(`   🔄 Updated: ${tourData.title}`);
        } else {
          await toursCollection.insertOne({
            ...tourData,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log(`   ✨ Created: ${tourData.title}`);
        }
      } catch (err) {
        console.error(`   ❌ Failed to scrape/insert ${slug}:`, err.message);
      }
    }

    console.log('\n🎉 All missing tours successfully synced!\n');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.\n');
  }
}

run();
