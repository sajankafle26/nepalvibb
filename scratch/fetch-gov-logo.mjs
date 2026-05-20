import fs from 'fs';
import path from 'path';

async function download() {
  const url = 'https://nepalvibb.com/wp-content/uploads/2025/05/gov.png';
  const dest = path.resolve('public/uploads/gov.png');
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      console.log('Successfully downloaded gov.png, size:', buffer.byteLength);
    } else {
      console.error('Failed to download:', res.status, res.statusText);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

download();
