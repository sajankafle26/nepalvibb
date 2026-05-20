/**
 * upsert-blogs.mjs
 *
 * Scrapes all blog posts from https://nepalvibb.com/category/blog/
 * and inserts/updates them in the MongoDB `blogs` collection.
 *
 * Usage: node scripts/upsert-blogs.mjs
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

async function fetchHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return await res.text();
}

function parseNorwegianDate(dateStr) {
  // example: "juni 17, 2025"
  const months = {
    'januar': 0, 'februar': 1, 'mars': 2, 'april': 3, 'mai': 4, 'juni': 5,
    'juli': 6, 'august': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
  };
  
  const cleanStr = dateStr.replace(',', '').trim().toLowerCase();
  const parts = cleanStr.split(/\s+/);
  if (parts.length === 3) {
    const month = months[parts[0]];
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date();
}

async function scrapeBlogPage(url) {
  console.log(`   Scraping blog post: ${url}`);
  const html = await fetchHtml(url);
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const titleEl = document.querySelector('.tg-blog-standard-title');
  const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';

  const imgEl = document.querySelector('.tg-blog-standard-thumb img');
  const image = imgEl ? imgEl.src : '/placeholder-blog.jpg';
  
  let createdAt = new Date();
  const dateEl = document.querySelector('.tg-blog-standard-date');
  if (dateEl) {
    const spans = dateEl.querySelectorAll('span');
    if (spans.length >= 2) {
      const dateStr = spans[1].textContent.trim();
      createdAt = parseNorwegianDate(dateStr);
    }
  }

  // Extract content
  // Content is everything between .tg-blog-standard-title and .tg-blog-details-tag
  const container = document.querySelector('.tg-blog-standard-content');
  let content = '';
  if (container) {
    let startCollecting = false;
    for (const node of container.childNodes) {
      if (node.nodeType === 1 && node.classList.contains('tg-blog-standard-title')) {
        startCollecting = true;
        continue;
      }
      if (node.nodeType === 1 && node.classList.contains('tg-blog-details-tag')) {
        break;
      }
      if (startCollecting) {
        if (node.nodeType === 1) {
          content += node.outerHTML;
        } else if (node.nodeType === 3) {
          content += node.textContent;
        }
      }
    }
  }

  // Generate slug from URL (e.g., https://nepalvibb.com/ting-du-trenger.../ -> ting-du-trenger...)
  let slug = url.replace('https://nepalvibb.com/', '').replace(/\/$/, '');
  
  return {
    title,
    slug,
    image,
    content: content.trim(),
    author: 'Nepalvibb Editor',
    category: 'Travel Tips',
    isFeatured: false,
    createdAt
  };
}

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB\n');
    const db = client.db();
    const blogsCollection = db.collection('blogs');

    console.log('⏳ Fetching main blog list...');
    const listHtml = await fetchHtml('https://nepalvibb.com/category/blog/');
    const dom = new JSDOM(listHtml);
    const document = dom.window.document;

    const blogLinks = Array.from(document.querySelectorAll('.tg-blog-title a')).map(a => a.href);
    console.log(`📌 Found ${blogLinks.length} blog posts to scrape.\n`);

    for (const url of blogLinks) {
      try {
        const blogData = await scrapeBlogPage(url);
        
        const existing = await blogsCollection.findOne({ slug: blogData.slug });
        if (existing) {
          await blogsCollection.updateOne({ slug: blogData.slug }, { $set: blogData });
          console.log(`   🔄 Updated: ${blogData.title}`);
        } else {
          await blogsCollection.insertOne(blogData);
          console.log(`   ✨ Created: ${blogData.title}`);
        }
      } catch (err) {
        console.error(`   ❌ Failed to scrape ${url}:`, err.message);
      }
    }

    console.log('\n🎉 All blogs successfully synced!\n');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed.\n');
  }
}

run();
