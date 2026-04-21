import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await dbConnect();
    const settings = await SiteSettings.findOne({});
    
    const ADMIN_EMAIL = settings?.adminEmail || 'sajankafle9841@gmail.com';
    const ADMIN_PASSWORD = settings?.adminPassword || 'admin@345';

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set a simple secure cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated_true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
