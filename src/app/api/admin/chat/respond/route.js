import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

export async function POST(req) {
  try {
    await dbConnect();
    const { tripId, text } = await req.json();

    const trip = await TripRequest.findById(tripId);
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    trip.messages.push({
      sender: 'specialist',
      text,
      timestamp: new Date()
    });

    await trip.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
