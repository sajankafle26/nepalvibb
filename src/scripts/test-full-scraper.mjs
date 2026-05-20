import * as cheerio from 'cheerio';

async function fetchTourDetails(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const title = $('.yatra-tour-title').text().trim();
    const destination = $('.destination-links a').text().trim() || 'Nepal';
    const category = $('.activity-links a').text().trim() || 'Trekking';
    
    let duration = '';
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

    const overview = $('.overview-section .yatra-tab-section-inner').html();

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
      gallery.push($(el).attr('href'));
    });

    // Parse price from script
    let price = 0;
    const yatraParamsScript = html.match(/var yatra_params = (\{.*?\});/);
    if (yatraParamsScript) {
        try {
            const params = JSON.parse(yatraParamsScript[1]);
            const datesData = params.single_tour.all_available_date_data;
            if (datesData) {
                const firstKey = Object.keys(datesData)[0];
                if (firstKey && datesData[firstKey]) {
                    const priceStr = datesData[firstKey].title; // "Guest: NOK14,000.00"
                    const match = priceStr.match(/NOK([0-9,]+(\.[0-9]+)?)/);
                    if (match) {
                        price = parseFloat(match[1].replace(/,/g, ''));
                    }
                }
            }
        } catch (e) {
            console.error('Failed to parse yatra_params', e);
        }
    }

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

    console.log(JSON.stringify({
        title, destination, category, duration, difficulty, price, image, summary, overview: !!overview,
        highlightsCount: highlights.length, includesCount: priceIncludes.length,
        excludesCount: priceExcludes.length, galleryCount: gallery.length, itineraryCount: itinerary.length
    }, null, 2));

  } catch (error) {
    console.error(`Error:`, error);
  }
}

fetchTourDetails('https://nepalvibb.com/tour/everest-base-camp-trek/');
