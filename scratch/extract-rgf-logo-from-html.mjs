async function extract() {
  try {
    const res = await fetch('https://reisegarantifondet.no/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const html = await res.text();
      const logoMatches = html.match(/src="([^"]+logo[^"]+)"/gi);
      console.log('Logo matches:', logoMatches);
      const imgMatches = html.match(/<img[^>]+src="([^"]+)"/gi);
      console.log('All image sources containing uploads:', imgMatches?.filter(m => m.includes('uploads')).slice(0, 10));
    } else {
      console.error('Failed to fetch reisegarantifondet.no:', res.status);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

extract();
