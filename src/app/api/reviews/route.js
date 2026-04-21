import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { tripId, userName, userEmail, rating, comment } = body;
    
    if (!tripId || !userName || !userEmail || !rating || !comment) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const review = await Review.create({
      tripId,
      userName,
      userEmail,
      rating,
      comment,
      status: 'pending' // Always pending until admin approves
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const reviews = await Review.find({ tripId, status: 'approved' }).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
