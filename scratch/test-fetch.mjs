import { JSDOM } from 'jsdom';

async function test() {
  const url = 'https://nepalvibb.com/tour/mardi-himal-trek/';
  try {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    console.log("=== Title ===");
    console.log(doc.querySelector('h1')?.textContent.trim());

    // 1. Scrape Gallery
    console.log("\n=== Scraped Gallery ===");
    const galleryUrls = [];
    const galleryAnchors = doc.querySelectorAll('.yatra-tab-item.gallery a[href*="wp-content/uploads"]');
    galleryAnchors.forEach(a => {
      const href = a.getAttribute('href');
      if (href && !galleryUrls.includes(href)) galleryUrls.push(href);
    });

    if (galleryUrls.length === 0) {
      const galleryImgs = doc.querySelectorAll('.yatra-tab-item.gallery img');
      galleryImgs.forEach(img => {
        const src = img.getAttribute('data-src') || img.getAttribute('src');
        if (src && !galleryUrls.includes(src)) galleryUrls.push(src);
      });
    }
    console.log(`Scraped ${galleryUrls.length} gallery images:`, galleryUrls);

    // 2. Scrape Itinerary
    console.log("\n=== Scraped Itinerary ===");
    const itinerary = [];
    const itineraryItems = doc.querySelectorAll('.yatra-tab-item.itinerary .yatra-itinerary-list-item');
    
    itineraryItems.forEach((item, idx) => {
      // Heading e.g., "Dag 1: Ankomst i Kathmandu" or "Day 1: Arrival..."
      const headingEl = item.querySelector('.itinerary-heading');
      if (!headingEl) return;
      
      // Clone heading and remove icon span if present
      const clonedHeading = headingEl.cloneNode(true);
      const iconSpan = clonedHeading.querySelector('.yatra-icon');
      if (iconSpan) iconSpan.remove();
      
      const headingText = clonedHeading.textContent.trim();
      
      // Parse day and title using Regex
      // Matching patterns like "Dag 1: Ankomst" or "Day 1 - Arrival" or "Dag 1 Ankomst"
      const dayMatch = headingText.match(/(?:Dag|Day)\s*(\d+)[:\-\s]*(.*)/i);
      let day = idx + 1;
      let title = headingText;
      
      if (dayMatch) {
        day = parseInt(dayMatch[1], 10);
        title = dayMatch[2].trim();
      }
      
      // Details HTML
      const detailsEl = item.querySelector('.itinerary-details');
      const details = detailsEl ? detailsEl.innerHTML.trim() : '';
      
      itinerary.push({ day, title, details });
    });
    
    console.log(`Scraped ${itinerary.length} itinerary days. First 3 items:`);
    console.log(itinerary.slice(0, 3));

  } catch (err) {
    console.error(err);
  }
}

test();
