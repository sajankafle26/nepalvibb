import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// For admin use
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json(banner);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
