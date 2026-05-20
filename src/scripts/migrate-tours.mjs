import mongoose from 'mongoose';
import * as cheerio from 'cheerio';

// Env vars loaded via node --env-file=.env.local
const MONGODB_URI = process.env.MONGODB_URI;

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, default: 'Moderat' },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  summary: { type: String, required: true },
  overview: { type: String },
  category: { type: String, default: 'Trekking' },
  highlights: [String],
  itinerary: [{ day: Number, title: String, details: String }],
  priceIncludes: [String],
  priceExcludes: [String],
  gallery: [String],
  isFeatured: { type: Boolean, default: false },
}, { strict: false });

const Tour = mongoose.models.Tour || mongoose.model('Tour', TourSchema);

async function scrapeTour(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('.yatra-tour-title').text().trim();
    if (!title) return null; // Not a valid tour page

    const slug = url.replace('https://nepalvibb.com/tour/', '').replace(/\/$/, '');
    const destination = $('.destination-links a').text().trim() || 'Nepal';
    const category = $('.activity-links a').text().trim() || 'Trekking';
    
    let duration = 'Ukjent';
    let difficulty = 'Moderat';

    $('.yatra-tour-additional-info-item').each((i, el) => {
      const infoTitle = $(el).find('.info-title').text().trim();
      const infoContent = $(el).find('.info-content').text().trim();
      if (infoTitle.toLowerCase().includes('varighet')) {
        duration = infoContent;
      }
      if (infoTitle.toLowerCase().includes('karakter')) {
        difficulty = infoContent;
      }
    });

    const image = $('meta[property="og:image"]').attr('content') || '';
    
    let summary = '';
    const metaContentNodes = $('.yatra-single-meta-content').contents();
    for (let i = 0; i < metaContentNodes.length; i++) {
        if (metaContentNodes[i].nodeType === 3) { // text node
            const text = $(metaContentNodes[i]).text().trim();
            if (text) {
                summary = text;
                break;
            }
        }
    }

    const highlights = [];
    $('.yatra-single-meta-content .yatra-tour-content ul li').each((i, el) => {
      highlights.push($(el).text().trim());
    });

    const overview = $('.overview-section .yatra-tab-section-inner').html() || '';

    const priceIncludes = [];
    $('.cost_included ul li').each((i, el) => {
      priceIncludes.push($(el).text().trim());
    });

    const priceExcludes = [];
    $('.cost_excluded ul li').each((i, el) => {
      priceExcludes.push($(el).text().trim());
    });

    const gallery = [];
    $('.yatra-tour-gallery a').each((i, el) => {
      const href = $(el).attr('href');
      if (href) gallery.push(href);
    });

    let price = 0;
    const yatraParamsScript = html.match(/var yatra_params = (\{.*?\});/);
    if (yatraParamsScript) {
        try {
            const params = JSON.parse(yatraParamsScript[1]);
            const datesData = params.single_tour?.all_available_date_data;
            if (datesData) {
                const firstKey = Object.keys(datesData)[0];
                if (firstKey && datesData[firstKey]) {
                    const priceStr = datesData[firstKey].title;
                    const match = priceStr.match(/NOK([0-9,]+(\.[0-9]+)?)/);
                    if (match) {
                        price = parseFloat(match[1].replace(/,/g, ''));
                    }
                }
            }
        } catch (e) {
            console.error(`Failed to parse price for ${slug}`, e);
        }
    }

    const itinerary = [];
    $('.yatra-itinerary-list-item').each((i, el) => {
      const headerText = $(el).find('.itinerary-heading').text().trim();
      const match = headerText.match(/Dag\s+(\d+)\s*:\s*(.*)/i);
      
      let day = i + 1;
      let dayTitle = headerText.replace('...', '').trim();

      if (match) {
        day = parseInt(match[1]);
        dayTitle = match[2].trim();
      }

      let details = $(el).find('.itinerary-details').text().trim();
      itinerary.push({ day, title: dayTitle, details });
    });

    return {
      title,
      slug,
      destination,
      duration,
      difficulty,
      price: price || 10000, // fallback
      image: image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
      summary: summary || 'A wonderful trek in the Himalayas.',
      overview,
      category,
      highlights,
      itinerary,
      priceIncludes,
      priceExcludes,
      gallery,
      isFeatured: true
    };
  } catch (error) {
    console.error(`Error fetching tour ${url}:`, error);
    return null;
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
    
    const locRegex = /<loc>(https:\/\/nepalvibb\.com\/tour\/[^<]+)<\/loc>/g;
    let match;
    const urls = [];
    while ((match = locRegex.exec(sitemapXml)) !== null) {
      if (match[1] !== 'https://nepalvibb.com/tour/') {
        urls.push(match[1]);
      }
    }

    console.log(`Found ${urls.length} tour URLs.`);

    // Before inserting, optionally clear the old dummy data
    console.log('Clearing old dummy tours...');
    await Tour.deleteMany({});

    let insertedCount = 0;

    for (const url of urls) {
      console.log(`Scraping ${url}...`);
      const tourData = await scrapeTour(url);
      
      if (tourData) {
        try {
            await Tour.create(tourData);
            console.log(`✅ Inserted tour: ${tourData.title}`);
            insertedCount++;
        } catch (err) {
            console.error(`❌ Failed to insert tour: ${tourData.title}`, err);
        }
      } else {
        console.log(`❌ Skipped invalid tour page: ${url}`);
      }
    }

    console.log(`\nMigration complete. Inserted ${insertedCount} real tours from live website!`);
    process.exit(0);
  } catch (error) {
    console.error('Migration Error:', error);
    process.exit(1);
  }
}

migrate();
