import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';

// Env vars loaded via node --env-file=.env.local
const MONGODB_URI = process.env.MONGODB_URI;

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  itinerary: [{ day: Number, title: String, details: String }]
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function scrapeTour(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const itinerary = [];

    $('.yatra-itinerary-list-item').each((i, el) => {
      const headerText = $(el).find('.itinerary-heading').text().trim();
      const match = headerText.match(/Dag\s+(\d+)\s*:\s*(.*)/i);
      
      let day = i + 1;
      let title = headerText.replace('...', '').trim();

      if (match) {
        day = parseInt(match[1]);
        title = match[2].trim();
      }

      let details = $(el).find('.itinerary-details').text().trim();

      itinerary.push({ day, title, details });
    });

    return itinerary;
  } catch (error) {
    console.error(`Error fetching itinerary for ${url}:`, error);
    return [];
  }
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Fetching sitemap...');
    const sitemapRes = await fetch('https://nepalvibb.com/tour-sitemap.xml');
    const sitemapXml = await sitemapRes.text();
    
    // Quick regex to find all <loc> tags in the sitemap
    const locRegex = /<loc>(https:\/\/nepalvibb\.com\/tour\/[^<]+)<\/loc>/g;
    let match;
    const urls = [];
    while ((match = locRegex.exec(sitemapXml)) !== null) {
      if (match[1] !== 'https://nepalvibb.com/tour/') {
        urls.push(match[1]);
      }
    }

    console.log(`Found ${urls.length} tour URLs.`);

    const allData = {};
    let updatedCount = 0;

    for (const url of urls) {
      console.log(`Scraping ${url}...`);
      const slug = url.replace('https://nepalvibb.com/tour/', '').replace(/\/$/, '');
      const itinerary = await scrapeTour(url);
      
      if (itinerary.length > 0) {
        allData[slug] = itinerary;
        // Attempt to update the database for this slug
        const result = await Tour.updateOne({ slug }, { $set: { itinerary } });
        if (result.matchedCount > 0) {
           console.log(`✅ Updated itinerary in DB for slug: ${slug}`);
           updatedCount++;
        } else {
           console.log(`⚠️ No matching tour found in DB for slug: ${slug}`);
        }
      } else {
        console.log(`❌ No itinerary found on page for slug: ${slug}`);
      }
    }

    // Save to a JSON file as well
    await fs.writeFile('scraped-itineraries.json', JSON.stringify(allData, null, 2));
    console.log(`\nMigration complete. Updated ${updatedCount} tours in DB.`);
    console.log('All scraped itineraries have been saved to scraped-itineraries.json');

    process.exit(0);
  } catch (error) {
    console.error('Migration Error:', error);
    process.exit(1);
  }
}

migrate();
