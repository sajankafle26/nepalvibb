import fs from 'fs';
import path from 'path';

async function downloadRgf() {
  const dest = path.resolve('public/uploads/rgf.svg');
  
  // Try various possible logo paths
  const urls = [
    'https://reisegarantifondet.no/wp-content/uploads/2023/06/Logo-RGF-sirkel-250.png',
    'https://reisegarantifondet.no/wp-content/uploads/2021/04/reisegarantifondet-logo.png',
    'https://reisegarantifondet.no/wp-content/themes/rgf/assets/img/logo.svg',
    'https://reisegarantifondet.no/wp-content/uploads/2021/04/rgf-logo.png',
    'https://reisegarantifondet.no/wp-content/uploads/2023/06/RGF-sirkel-250.png',
    'https://reisegarantifondet.no/wp-content/uploads/logo.png',
    'https://rgf.no/wp-content/themes/rgf/assets/img/logo.svg'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const ext = url.endsWith('.svg') ? 'svg' : 'png';
        const finalDest = path.resolve('public/uploads/rgf.' + ext);
        fs.writeFileSync(finalDest, Buffer.from(buffer));
        console.log(`Successfully downloaded RGF logo from ${url}, saved to rgf.${ext}, size: ${buffer.byteLength}`);
        return;
      }
    } catch (err) {
      console.error(`Error trying ${url}: ${err.message}`);
    }
  }
  
  console.log('Could not find active RGF logo from URLs.');
}

downloadRgf();
