import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory already exists
    }

    const uniqueName = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    const path = join(uploadDir, uniqueName);
    
    await writeFile(path, buffer);
    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
