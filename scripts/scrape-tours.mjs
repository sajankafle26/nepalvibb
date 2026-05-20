import axios from 'axios';
import * as cheerio from 'cheerio';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const WEBSITE_URL = 'https://nepalvibb.com';
const client = new MongoClient(MONGODB_URI);

async function scrapeTours() {
  try {
    console.log('🚀 Starting tour scraper...');
    
    // Fetch tours page
    const tourListUrl = `${WEBSITE_URL}/activity/turer/`;
    console.log(`📥 Fetching tours from: ${tourListUrl}`);
    
    const response = await axios.get(tourListUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const tourLinks = [];
    
    // Extract individual tour URLs
    $('a[href*="/tour/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && !tourLinks.includes(href)) {
        tourLinks.push(href);
      }
    });
    
    console.log(`✅ Found ${tourLinks.length} tours`);
    
    const tours = [];
    
    // Scrape each tour
    for (let i = 0; i < tourLinks.length; i++) {
      try {
        console.log(`📖 Scraping tour ${i + 1}/${tourLinks.length}: ${tourLinks[i]}`);
        
        const tourResponse = await axios.get(tourLinks[i], {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const tour$ = cheerio.load(tourResponse.data);
        
        // Extract tour data
        const title = tour$('h1').first().text().trim();
        const description = tour$('p').first().text().trim();
        const price = tour$('.price, [class*="price"]').first().text().trim();
        const duration = tour$('[class*="duration"], span:contains("dager"), span:contains("dag")').text().trim();
        const destination = tour$('a[href*="/destination/"]').first().text().trim();
        const category = tour$('a[href*="/activity/"]').first().text().trim();
        
        // Extract full content
        const fullContent = tour$('main, article, .content, [class*="content"]').html() || '';
        
        const tourData = {
          title,
          slug: tourLinks[i].split('/').filter(p => p).pop().replace(/\/$/, ''),
          description,
          price,
          duration,
          destination,
          category,
          url: tourLinks[i],
          content: fullContent,
          scrapedAt: new Date(),
          status: 'published'
        };
        
        if (title) {
          tours.push(tourData);
          console.log(`✓ Scraped: ${title}`);
        }
      } catch (error) {
        console.error(`✗ Error scraping ${tourLinks[i]}:`, error.message);
      }
    }
    
    // Connect to MongoDB and save
    console.log('\n💾 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db('nepalvibb');
    const toursCollection = db.collection('tours');
    
    // Insert or update tours
    for (const tour of tours) {
      await toursCollection.updateOne(
        { slug: tour.slug },
        { $set: tour },
        { upsert: true }
      );
    }
    
    console.log(`✅ Saved ${tours.length} tours to database`);
    
    // Save JSON backup
    const fs = await import('fs/promises');
    await fs.writeFile(
      'scraped-tours-backup.json',
      JSON.stringify(tours, null, 2)
    );
    console.log('✅ Backup saved to scraped-tours-backup.json');
    
  } catch (error) {
    console.error('❌ Scraper error:', error);
  } finally {
    await client.close();
    console.log('✅ Done!');
  }
}

scrapeTours();
