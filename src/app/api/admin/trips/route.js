import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

// GET all tours
export async function GET() {
  try {
    await dbConnect();
    const tours = await Tour.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new tour
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const tour = await Tour.create(data);
    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
