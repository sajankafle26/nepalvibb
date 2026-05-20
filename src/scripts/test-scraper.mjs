import * as cheerio from 'cheerio';

async function fetchItinerary(url) {
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

      // Remove the span text if it gets included (like fa-angle-down)
      // Actually we just want the text node, but `.text()` includes child nodes
      // Let's clean the title if it contains any extra icons
      
      let details = $(el).find('.itinerary-details').text().trim();

      itinerary.push({ day, title, details });
    });

    console.log(JSON.stringify(itinerary, null, 2));
  } catch (error) {
    console.error('Error fetching itinerary:', error);
  }
}

fetchItinerary('https://nepalvibb.com/tour/everest-base-camp-trek/');
