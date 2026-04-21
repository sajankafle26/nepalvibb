import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TripRequest from '@/models/TripRequest';

export async function POST(request) {
  try {
    await dbConnect();
    const { tripId, price } = await request.json();
    
    const trip = await TripRequest.findByIdAndUpdate(
      tripId,
      { price },
      { new: true }
    );
    
    // Add a system message about the price update
    if (trip) {
      trip.messages.push({
        sender: 'system',
        text: `Specialist updated the trip price to $${price}`,
        timestamp: new Date()
      });
      await trip.save();
    }

    return NextResponse.json(trip);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
