import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Unique filename
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const path = join(uploadDir, uniqueName);
    
    await writeFile(path, buffer);
    
    const url = `/uploads/${uniqueName}`;
    const type = file.type.startsWith('image/') ? 'image' : 'file';

    return NextResponse.json({ 
      url, 
      type, 
      name: file.name 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
