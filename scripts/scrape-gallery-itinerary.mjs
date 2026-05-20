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
      console.log(`\n--------------------------------------------`);
      console.log(`Processing: "${title}" (${slug})`);
      console.log(`🔗 Fetching: ${url}`);

      try {
        const html = await fetchHtml(url);
        const dom = new JSDOM(html);
        const doc = dom.window.document;

        // 1. Scrape Gallery
        const galleryUrls = [];
        const galleryAnchors = doc.querySelectorAll('.yatra-tab-item.gallery a[href*="wp-content/uploads"], .gallery-section a[href*="wp-content/uploads"], [class*="gallery"] a[href*="wp-content/uploads"]');
        galleryAnchors.forEach(a => {
          const href = a.getAttribute('href');
          if (href && !galleryUrls.includes(href)) galleryUrls.push(href);
        });

        if (galleryUrls.length === 0) {
          const galleryImgs = doc.querySelectorAll('.yatra-tab-item.gallery img, .gallery-section img, [class*="gallery"] img');
          galleryImgs.forEach(img => {
            const src = img.getAttribute('data-src') || img.getAttribute('src');
            if (src && !galleryUrls.includes(src)) galleryUrls.push(src);
          });
        }

        // 2. Scrape Itinerary
        const itinerary = [];
        const itineraryItems = doc.querySelectorAll('.yatra-tab-item.itinerary .yatra-itinerary-list-item, .itinerary-section .yatra-itinerary-list-item, [class*="itinerary"] .yatra-itinerary-list-item');
        
        itineraryItems.forEach((item, idx) => {
          const headingEl = item.querySelector('.itinerary-heading, [class*="heading"]');
          if (!headingEl) return;
          
          const clonedHeading = headingEl.cloneNode(true);
          const iconSpan = clonedHeading.querySelector('.yatra-icon, [class*="icon"]');
          if (iconSpan) iconSpan.remove();
          
          const headingText = clonedHeading.textContent.trim();
          
          const dayMatch = headingText.match(/(?:Dag|Day)\s*(\d+)[:\-\s]*(.*)/i);
          let day = idx + 1;
          let itemTitle = headingText;
          
          if (dayMatch) {
            day = parseInt(dayMatch[1], 10);
            itemTitle = dayMatch[2].trim();
          }
          
          const detailsEl = item.querySelector('.itinerary-details, [class*="details"], [class*="content"]');
          const details = detailsEl ? detailsEl.innerHTML.trim() : '';
          
          itinerary.push({ day, title: itemTitle, details });
        });

        // 3. Database Update
        const updates = {};
        if (galleryUrls.length > 0) {
          updates.gallery = galleryUrls;
          console.log(`   ✓ Found ${galleryUrls.length} gallery images.`);
        } else {
          console.log(`   ⚠️ No gallery images found on the live page.`);
        }

        if (itinerary.length > 0) {
          updates.itinerary = itinerary;
          console.log(`   ✓ Found ${itinerary.length} itinerary days.`);
        } else {
          console.log(`   ⚠️ No itinerary steps found on the live page.`);
        }

        if (Object.keys(updates).length > 0) {
          updates.updatedAt = new Date();
          const updated = await toursCollection.updateOne(
            { _id: tour._id },
            { $set: updates }
          );
          if (updated.modifiedCount > 0) {
            console.log(`   ✨ Updated gallery/itinerary in database!`);
          } else {
            console.log(`   ℹ️ Database already has this exact content (no changes made).`);
          }
        } else {
          console.log(`   ℹ️ No updates found for this tour.`);
        }

      } catch (err) {
        console.error(`   ❌ Error fetching/parsing ${slug}:`, err.message);
      }

      // Respectful delay between requests
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    console.log('\n🎉 Finished updating all tour galleries and itineraries!');
  } catch (err) {
    console.error('❌ Database error:', err);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

run();
