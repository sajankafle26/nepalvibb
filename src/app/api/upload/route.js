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
    
    try {
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
    } catch (fsError) {
      console.warn('Filesystem write failed, falling back to Base64 data URL:', fsError);
      
      // Fallback: convert file to Base64 data URL
      const base64Data = buffer.toString('base64');
      const mimeType = file.type || 'image/jpeg';
      const url = `data:${mimeType};base64,${base64Data}`;
      const type = file.type.startsWith('image/') ? 'image' : 'file';

      return NextResponse.json({
        url,
        type,
        name: file.name
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
