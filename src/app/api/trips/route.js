import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function GET() {
  try {
    await dbConnect();
    const tours = await Tour.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const tour = await Tour.create(body);
    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
