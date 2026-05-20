import fs from 'fs';
import path from 'path';

const logos = [
  { name: 'ntb.svg', url: 'https://www.actual-adventure.com/public/uploads/ntb.svg' },
  { name: 'taan.svg', url: 'https://www.actual-adventure.com/public/uploads/taan.svg' },
  { name: 'nma.svg', url: 'https://www.actual-adventure.com/public/uploads/nma.svg' },
  { name: 'keep.svg', url: 'https://www.actual-adventure.com/public/uploads/keep.svg' },
  { name: 'nepal-goverment.svg', url: 'https://www.actual-adventure.com/public/uploads/nepal-goverment.svg' },
  { name: 'actual-adventure-logo-np.svg', url: 'https://www.actual-adventure.com/public/uploads/actual-adventure-logo-np.svg' }
];

async function downloadLogos() {
  for (const logo of logos) {
    const dest = path.resolve('public/uploads', logo.name);
    try {
      const res = await fetch(logo.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.actual-adventure.com/'
        }
      });
      
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(dest, text);
        console.log(`Successfully downloaded ${logo.name}, size: ${text.length}`);
      } else {
        console.error(`Failed to download ${logo.name}: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(`Error downloading ${logo.name}: ${err.message}`);
    }
  }
}

downloadLogos();
