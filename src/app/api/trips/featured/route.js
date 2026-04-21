import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function GET() {
  try {
    await dbConnect();
    const tours = await Tour.find({ isFeatured: true }).limit(6);
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
